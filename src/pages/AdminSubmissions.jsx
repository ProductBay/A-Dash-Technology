import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminProjectsWorkspace from "../components/admin/AdminProjectsWorkspace";
import {
  createRatePresetMap,
  DEFAULT_RATE_PRESETS,
  estimateRequestPricing,
} from "../lib/requestEstimator";
import "../styles/admin.css";

const STATUS_OPTIONS = ["new", "contacted", "quoted", "closed"];

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatCurrency(value, currency = "JMD") {
  const numeric = Number(value || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${currency} ${numeric.toFixed(0)}`;
  }
}

function isAdminSession(session) {
  const role = session?.user?.app_metadata?.role;
  return role === "admin";
}

function getErrorText(error, mode = "load") {
  const source = [
    error?.message,
    error?.details,
    error?.hint,
    error?.code,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    source.includes("schema cache") ||
    source.includes("relation") ||
    source.includes("service_requests")
  ) {
    return "The service_requests table is not ready in Supabase yet. Run supabase/service_requests.sql in the SQL Editor, then refresh this page.";
  }

  if (
    source.includes("permission denied") ||
    source.includes("row-level security") ||
    source.includes("jwt") ||
    source.includes("not authorized") ||
    source.includes("42501")
  ) {
    if (mode === "update") {
      return "Status update blocked by Supabase permissions. Make sure the signed-in user has app_metadata.role = admin and that the RLS policies from supabase/service_requests.sql have been applied.";
    }

    return "Admin read access is blocked by Supabase permissions. Make sure the signed-in user has app_metadata.role = admin and that the RLS policies from supabase/service_requests.sql have been applied.";
  }

  return error?.message || "Could not complete the admin request.";
}

function getEstimateErrorText(error) {
  const source = [error?.message, error?.details, error?.hint, error?.code]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (source.includes("service_request_estimates") || source.includes("relation")) {
    return "Pricing snapshot table is missing. Run the latest supabase/service_requests.sql migration and refresh.";
  }

  if (
    source.includes("permission denied") ||
    source.includes("row-level security") ||
    source.includes("42501")
  ) {
    return "Pricing snapshot save blocked by Supabase permissions. Confirm admin role and RLS policies.";
  }

  return error?.message || "Could not process estimate snapshot.";
}

function parseMoney(value) {
  const normalized = String(value || "")
    .trim()
    .replace(/,/g, "");
  if (!normalized) return 0;
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : NaN;
}

const PAYMENT_TYPE_OPTIONS = [
  "deposit",
  "milestone",
  "design",
  "development",
  "qa",
  "launch",
  "retainer",
  "final",
];

const PAYMENT_CURRENCY_OPTIONS = ["USD", "JMD"];

const PAYMENT_TIER_PACKAGES = [
  {
    key: "2x50",
    label: "2-tier split (50/50)",
    tiers: [
      { type: "milestone", label: "Build phase", percent: 50, dueInDays: 14 },
      { type: "final", label: "Delivery + launch", percent: 50, dueInDays: 28 },
    ],
  },
  {
    key: "3x40-35-25",
    label: "3-tier split (40/35/25)",
    tiers: [
      { type: "design", label: "Design + planning", percent: 40, dueInDays: 10 },
      { type: "development", label: "Core build", percent: 35, dueInDays: 24 },
      { type: "launch", label: "QA + deployment", percent: 25, dueInDays: 38 },
    ],
  },
  {
    key: "4x30-30-25-15",
    label: "4-tier split (30/30/25/15)",
    tiers: [
      { type: "design", label: "Discovery + UX", percent: 30, dueInDays: 7 },
      { type: "development", label: "Feature implementation", percent: 30, dueInDays: 21 },
      { type: "qa", label: "Testing + revisions", percent: 25, dueInDays: 35 },
      { type: "final", label: "Launch + handoff", percent: 15, dueInDays: 49 },
    ],
  },
];

function formatDateInput(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    return fallback.toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function addDays(dateInput, days) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function getPaymentPackageByKey(key) {
  return PAYMENT_TIER_PACKAGES.find((item) => item.key === key) || PAYMENT_TIER_PACKAGES[1];
}

function getRecommendedPaymentPackageKey(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return "3x40-35-25";
  if (amount < 300000) return "2x50";
  if (amount < 1200000) return "3x40-35-25";
  return "4x30-30-25-15";
}

function parsePaymentTiers(input, agreedPrice, downPayment) {
  const tiers = Array.isArray(input)
    ? input.map((item, index) => ({
        type: String(item?.type || "milestone").trim().toLowerCase(),
        label: String(item?.label || `Milestone ${index + 1}`).trim(),
        amount: Number(item?.amount || 0),
        dueDate: String(item?.dueDate || "").trim(),
      }))
    : [];

  tiers.forEach((tier, index) => {
    if (!tier.label) {
      throw new Error(`Payment tier ${index + 1} requires a label.`);
    }
    if (!PAYMENT_TYPE_OPTIONS.includes(tier.type)) {
      throw new Error(`Payment tier ${index + 1} has an invalid payment type.`);
    }
    if (!Number.isFinite(tier.amount) || tier.amount <= 0) {
      throw new Error(`Payment tier ${index + 1} must have an amount greater than zero.`);
    }
    if (!tier.dueDate) {
      throw new Error(`Payment tier ${index + 1} requires a due date.`);
    }
  });

  if (Number.isFinite(agreedPrice) && agreedPrice > 0) {
    const tierTotal = tiers.reduce((sum, item) => sum + item.amount, 0);
    const remaining = Math.max(0, agreedPrice - (Number.isFinite(downPayment) ? downPayment : 0));
    const diff = Math.abs(tierTotal - remaining);
    if (tiers.length && diff > 0.01) {
      throw new Error(
        `Payment tiers must equal ${remaining.toFixed(2)} after down payment. Current tier total is ${tierTotal.toFixed(2)}.`
      );
    }
  }

  return tiers;
}

function buildTiersFromPackage(
  packageKey,
  agreedPrice,
  downPayment,
  billingStartDate,
  intervalDays
) {
  const pkg = getPaymentPackageByKey(packageKey);
  const total = Number(agreedPrice || 0);
  const down = Number(downPayment || 0);
  const remaining = Math.max(0, total - down);
  const start = formatDateInput(billingStartDate);
  const defaultSpacing = Number(intervalDays || 14);

  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("Set agreed total price before generating payment tiers.");
  }

  if (remaining <= 0) {
    return [];
  }

  let allocated = 0;
  return pkg.tiers.map((tier, index) => {
    const isLast = index === pkg.tiers.length - 1;
    const amount = isLast
      ? Math.round((remaining - allocated) * 100) / 100
      : Math.round(((remaining * tier.percent) / 100) * 100) / 100;
    allocated += amount;

    return {
      type: tier.type,
      label: tier.label,
      amount,
      dueDate: addDays(start, tier.dueInDays || (index + 1) * defaultSpacing),
    };
  });
}

function buildInvoicePlan({
  agreedPrice,
  downPayment,
  currency,
  paymentTiers,
  billingStartDate,
  requestId,
}) {
  const total = Number(agreedPrice || 0);
  const down = Number(downPayment || 0);
  const startDate = formatDateInput(billingStartDate);
  const rows = [];

  if (down > 0) {
    rows.push({
      label: "Down payment",
      amount: down,
      currency,
      due_date: startDate,
      type: "deposit",
      notes: "Required to confirm kickoff.",
    });
  }

  paymentTiers.forEach((tier, index) => {
    rows.push({
      label: `${formatLabel(tier.type)} - ${tier.label}`,
      amount: Number(tier.amount || 0),
      currency,
      due_date: tier.dueDate || addDays(startDate, (index + 1) * 14),
      type: tier.type,
      notes: `Invoice tier ${index + 1} for request #${requestId}.`,
    });
  });

  const invoiceTotal = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const completion = total > 0 ? Math.min(100, Math.round((invoiceTotal / total) * 100)) : 0;

  return {
    rows,
    invoiceTotal,
    completion,
    remaining: Math.max(0, total - invoiceTotal),
  };
}

function buildClientInvoiceText(projectName, plan, agreedPrice, currency) {
  const lines = [
    `Project: ${projectName || "Pending project"}`,
    `Total agreed amount: ${formatCurrency(agreedPrice || 0, currency)}`,
    "",
    "Invoice schedule:",
  ];

  plan.rows.forEach((row, index) => {
    lines.push(
      `${index + 1}. ${row.label} | ${formatCurrency(row.amount, row.currency)} | Due: ${row.due_date}`
    );
  });

  lines.push("");
  lines.push(`Planned invoicing total: ${formatCurrency(plan.invoiceTotal, currency)}`);
  lines.push(`Funding coverage: ${plan.completion}%`);
  lines.push(`Unallocated balance: ${formatCurrency(plan.remaining, currency)}`);

  return lines.join("\n");
}

function buildInvoiceEmailTemplate({
  projectName,
  clientName,
  agreedPrice,
  currency,
  plan,
}) {
  const subject = `Invoice Schedule Confirmation - ${projectName || "Project"}`;

  const bodyLines = [
    `Hi ${clientName || "there"},`,
    "",
    `Please find the confirmed invoice schedule for ${projectName || "your project"}.`,
    `Total agreed amount: ${formatCurrency(agreedPrice || 0, currency)}.`,
    "",
    "Invoice schedule:",
    ...plan.rows.map(
      (row, index) =>
        `${index + 1}. ${row.label} - ${formatCurrency(row.amount, row.currency)} (Due ${row.due_date})`
    ),
    "",
    `Coverage: ${plan.completion}%`,
    `Unallocated balance: ${formatCurrency(plan.remaining, currency)}`,
    "",
    "Please confirm receipt and let us know if you need any clarifications.",
    "",
    "Best regards,",
    "A'Dash Technology",
  ];

  return {
    subject,
    body: bodyLines.join("\n"),
  };
}

function buildExportInvoiceBundle(clientInvoiceText, emailTemplate) {
  return [
    clientInvoiceText,
    "",
    "--- Email Template ---",
    `Subject: ${emailTemplate.subject}`,
    "",
    emailTemplate.body,
  ].join("\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDefaultPresetByService(serviceType) {
  const key = String(serviceType || "website").toLowerCase();
  return DEFAULT_RATE_PRESETS[key] || DEFAULT_RATE_PRESETS.website;
}

function buildClientQuoteNote(requestRow, estimate) {
  if (!requestRow || !estimate) return "";

  const payload = requestRow.payload || {};
  const serviceLabel = formatLabel(requestRow.service_type || "project");
  const timeline = payload.timeline || "standard timeline";
  const factors = (estimate.factors || []).slice(0, 3);

  const summary = [
    `This ${serviceLabel.toLowerCase()} proposal is estimated between ${formatCurrency(
      estimate.low,
      estimate.currency
    )} and ${formatCurrency(estimate.high, estimate.currency)}, with a target of ${formatCurrency(
      estimate.target,
      estimate.currency
    )}.`,
    `The estimate assumes a ${timeline} delivery schedule and includes scope based on the submitted request details.`,
  ];

  if (factors.length) {
    summary.push(`Key pricing drivers: ${factors.join(" ")}`);
  }

  if (estimate.varianceStatus === "over") {
    summary.push(
      "The target estimate currently sits above the selected budget range; a phased rollout can be used to align early scope with budget."
    );
  } else if (estimate.varianceStatus === "near") {
    summary.push(
      "The target estimate is near the selected budget cap, so final scope prioritization will help keep delivery on target."
    );
  } else if (estimate.varianceStatus === "within") {
    summary.push("The current scope is aligned within the selected budget range.");
  }

  summary.push(
    "Final pricing is confirmed after discovery and technical validation, then converted into milestone invoices."
  );

  return summary.join("\n\n");
}

function SubmissionField({ label, value }) {
  return (
    <div className="admin-detail-field">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default function AdminSubmissions() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [requestFilter, setRequestFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [adminView, setAdminView] = useState("requests");
  const [conversionError, setConversionError] = useState("");
  const [converting, setConverting] = useState(false);
  const [linkedProject, setLinkedProject] = useState(null);
  const [loadingLinkedProject, setLoadingLinkedProject] = useState(false);
  const [conversionForm, setConversionForm] = useState({
    projectName: "",
    agreedPrice: "",
    downPayment: "",
    currency: "USD",
    billingStartDate: formatDateInput(new Date()),
    paymentIntervalDays: "14",
    paymentPackage: "3x40-35-25",
    paymentTiers: [],
    finalVerdictConfirmed: false,
  });
  const [estimateSnapshot, setEstimateSnapshot] = useState(null);
  const [loadingEstimateSnapshot, setLoadingEstimateSnapshot] = useState(false);
  const [savingEstimateSnapshot, setSavingEstimateSnapshot] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [ratePresetRows, setRatePresetRows] = useState([]);
  const [loadingRatePresets, setLoadingRatePresets] = useState(false);
  const [savingRatePreset, setSavingRatePreset] = useState(false);
  const [ratePresetError, setRatePresetError] = useState("");
  const [ratePresetForm, setRatePresetForm] = useState({
    baseRate: "",
    currency: "JMD",
    modifiersJson: "{}",
  });
  const [creatingEstimateDraft, setCreatingEstimateDraft] = useState(false);
  const [quoteNoteCopyStatus, setQuoteNoteCopyStatus] = useState("");
  const [clientInvoiceCopyStatus, setClientInvoiceCopyStatus] = useState("");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) {
        setAuthError(sessionError.message || "Could not verify admin session.");
      }
      setSession(data.session || null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadRows() {
    setError("");
    try {
      const { data, error: queryError } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setRows(data || []);
      setSelectedId((current) => {
        if (current && (data || []).some((item) => item.id === current)) {
          return current;
        }
        return data?.[0]?.id || null;
      });
    } catch (loadError) {
      console.error("Admin submissions load failed:", loadError);
      setError(getErrorText(loadError, "load"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    if (!isAdminSession(session)) {
      setRows([]);
      setSelectedId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadRows();
  }, [authReady, session]);

  const requestTypes = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(rows.map((row) => row.service_type).filter(Boolean))),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesType =
        requestFilter === "all" || row.service_type === requestFilter;
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [rows, requestFilter, statusFilter]);

  const selectedRow = useMemo(() => {
    return (
      filteredRows.find((row) => row.id === selectedId) ||
      rows.find((row) => row.id === selectedId) ||
      filteredRows[0] ||
      null
    );
  }, [filteredRows, rows, selectedId]);

  const ratePresetMap = useMemo(() => {
    return createRatePresetMap(ratePresetRows);
  }, [ratePresetRows]);

  const liveEstimate = useMemo(() => {
    if (!selectedRow) return null;
    return estimateRequestPricing(selectedRow, ratePresetMap);
  }, [selectedRow, ratePresetMap]);

  const quoteNote = useMemo(() => {
    return buildClientQuoteNote(selectedRow, liveEstimate);
  }, [selectedRow, liveEstimate]);

  const conversionPreview = useMemo(() => {
    const agreedPrice = parseMoney(conversionForm.agreedPrice);
    const downPayment = parseMoney(conversionForm.downPayment);
    const currency = (conversionForm.currency || "USD").trim().toUpperCase();

    if (!Number.isFinite(agreedPrice) || agreedPrice <= 0) {
      return null;
    }

    try {
      const parsedTiers = parsePaymentTiers(
        conversionForm.paymentTiers,
        agreedPrice,
        downPayment
      );
      const plan = buildInvoicePlan({
        agreedPrice,
        downPayment,
        currency,
        paymentTiers: parsedTiers,
        billingStartDate: conversionForm.billingStartDate,
        requestId: selectedRow?.id,
      });

      return {
        ...plan,
        clientText: buildClientInvoiceText(
          conversionForm.projectName,
          plan,
          agreedPrice,
          currency
        ),
        emailTemplate: buildInvoiceEmailTemplate({
          projectName: conversionForm.projectName,
          clientName: selectedRow?.full_name || selectedRow?.company,
          agreedPrice,
          currency,
          plan,
        }),
      };
    } catch {
      return null;
    }
  }, [
    conversionForm.agreedPrice,
    conversionForm.downPayment,
    conversionForm.currency,
    conversionForm.billingStartDate,
    conversionForm.paymentTiers,
    conversionForm.projectName,
    selectedRow?.id,
  ]);

  const conversionChecklist = useMemo(() => {
    const agreedPrice = parseMoney(conversionForm.agreedPrice);
    const downPayment = parseMoney(conversionForm.downPayment);
    const checks = [
      { label: "Project name", done: Boolean(conversionForm.projectName.trim()) },
      { label: "Agreed amount", done: Number.isFinite(agreedPrice) && agreedPrice > 0 },
      {
        label: "Currency",
        done: PAYMENT_CURRENCY_OPTIONS.includes(
          String(conversionForm.currency || "").trim().toUpperCase()
        ),
      },
      {
        label: "Down payment valid",
        done:
          Number.isFinite(downPayment) &&
          downPayment >= 0 &&
          (!Number.isFinite(agreedPrice) || downPayment <= agreedPrice),
      },
      { label: "Invoice plan", done: Boolean(conversionPreview?.rows?.length) },
      {
        label: "Final verdict confirmed",
        done: Boolean(conversionForm.finalVerdictConfirmed),
      },
    ];

    const completed = checks.filter((item) => item.done).length;
    const percent = Math.round((completed / checks.length) * 100);
    return { checks, percent };
  }, [
    conversionForm.projectName,
    conversionForm.agreedPrice,
    conversionForm.currency,
    conversionForm.downPayment,
    conversionForm.finalVerdictConfirmed,
    conversionPreview,
  ]);

  useEffect(() => {
    if (!filteredRows.length) {
      setSelectedId(null);
      return;
    }

    if (!filteredRows.some((row) => row.id === selectedId)) {
      setSelectedId(filteredRows[0].id);
    }
  }, [filteredRows, selectedId]);

  useEffect(() => {
    let mounted = true;

    async function loadEstimateSnapshot() {
      if (!selectedRow?.id || adminView !== "requests") {
        setEstimateSnapshot(null);
        setEstimateError("");
        return;
      }

      setLoadingEstimateSnapshot(true);
      setEstimateError("");

      try {
        const { data, error: snapshotError } = await supabase
          .from("service_request_estimates")
          .select("*")
          .eq("request_id", selectedRow.id)
          .maybeSingle();

        if (snapshotError) throw snapshotError;
        if (!mounted) return;
        setEstimateSnapshot(data || null);
      } catch (failure) {
        if (!mounted) return;
        setEstimateSnapshot(null);
        setEstimateError(getEstimateErrorText(failure));
      } finally {
        if (!mounted) return;
        setLoadingEstimateSnapshot(false);
      }
    }

    loadEstimateSnapshot();

    return () => {
      mounted = false;
    };
  }, [selectedRow?.id, adminView]);

  useEffect(() => {
    let mounted = true;

    async function loadLinkedProject() {
      if (!selectedRow?.id || adminView !== "requests") {
        setLinkedProject(null);
        setLoadingLinkedProject(false);
        return;
      }

      setLoadingLinkedProject(true);
      setConversionError("");

      const defaultProjectName =
        selectedRow.company || selectedRow.full_name
          ? `${selectedRow.company || selectedRow.full_name} ${formatLabel(
              selectedRow.service_type || "project"
            )}`
          : `${formatLabel(selectedRow.service_type || "Service")} Project`;

      setConversionForm({
        projectName: defaultProjectName,
        agreedPrice: "",
        downPayment: "",
        currency: "USD",
        billingStartDate: formatDateInput(new Date()),
        paymentIntervalDays: "14",
        paymentPackage: "3x40-35-25",
        paymentTiers: [],
        finalVerdictConfirmed: false,
      });

      try {
        const { data, error: linkedError } = await supabase
          .from("customer_projects")
          .select("id, name, status, created_at")
          .eq("request_id", selectedRow.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (linkedError) throw linkedError;
        if (!mounted) return;

        setLinkedProject((data && data[0]) || null);
      } catch (failure) {
        console.error("Linked project load failed:", failure);
        if (!mounted) return;
        setLinkedProject(null);
      } finally {
        if (!mounted) return;
        setLoadingLinkedProject(false);
      }
    }

    loadLinkedProject();

    return () => {
      mounted = false;
    };
  }, [selectedRow?.id, selectedRow?.company, selectedRow?.full_name, selectedRow?.service_type, adminView]);

  useEffect(() => {
    let mounted = true;

    async function loadRatePresets() {
      if (adminView !== "requests") return;

      setLoadingRatePresets(true);
      setRatePresetError("");

      try {
        const { data, error: presetError } = await supabase
          .from("service_pricing_presets")
          .select("service_type, currency, base_rate, config");

        if (presetError) throw presetError;
        if (!mounted) return;
        setRatePresetRows(data || []);
      } catch (failure) {
        if (!mounted) return;
        setRatePresetRows([]);
        setRatePresetError(
          "Pricing presets are not available yet. Apply the latest supabase/service_requests.sql migration to enable editable rates."
        );
      } finally {
        if (!mounted) return;
        setLoadingRatePresets(false);
      }
    }

    loadRatePresets();

    return () => {
      mounted = false;
    };
  }, [adminView]);

  useEffect(() => {
    const serviceType = String(selectedRow?.service_type || "website").toLowerCase();
    const preset = ratePresetMap[serviceType] || getDefaultPresetByService(serviceType);

    setRatePresetForm({
      baseRate: String(preset.baseRate || ""),
      currency: preset.currency || "JMD",
      modifiersJson: JSON.stringify(preset.modifiers || {}, null, 2),
    });
    setQuoteNoteCopyStatus("");
  }, [selectedRow?.id, selectedRow?.service_type, ratePresetMap]);

  const stats = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => {
        acc[status] = rows.filter((row) => row.status === status).length;
        return acc;
      },
      { new: 0, contacted: 0, quoted: 0, closed: 0 }
    );
  }, [rows]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) throw loginError;

      if (!isAdminSession(data.session)) {
        await supabase.auth.signOut();
        throw new Error(
          "This account is authenticated but not authorized as an admin. Set app_metadata.role to admin in Supabase Auth."
        );
      }
    } catch (loginFailure) {
      console.error("Admin sign-in failed:", loginFailure);
      setAuthError(getErrorText(loginFailure, "auth"));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRows([]);
    setSelectedId(null);
    setEmail("");
    setPassword("");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRows();
  };

  const handleStatusChange = async (nextStatus) => {
    if (!selectedRow?.id) return;

    setSavingStatus(true);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("service_requests")
        .update({
          status: nextStatus,
          admin_updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRow.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setRows((current) =>
        current.map((row) => (row.id === selectedRow.id ? data : row))
      );
    } catch (updateFailure) {
      console.error("Admin status update failed:", updateFailure);
      setError(getErrorText(updateFailure, "update"));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleGeneratePaymentTiers = (mode = "selected") => {
    try {
      const agreedPrice = parseMoney(conversionForm.agreedPrice);
      const downPayment = parseMoney(conversionForm.downPayment);
      const packageKey =
        mode === "auto"
          ? getRecommendedPaymentPackageKey(agreedPrice)
          : conversionForm.paymentPackage;
      const tiers = buildTiersFromPackage(
        packageKey,
        agreedPrice,
        downPayment,
        conversionForm.billingStartDate,
        conversionForm.paymentIntervalDays
      );

      setConversionError("");
      setConversionForm((current) => ({
        ...current,
        paymentPackage: packageKey,
        paymentTiers: tiers,
      }));
    } catch (failure) {
      setConversionError(failure?.message || "Could not generate payment tiers.");
    }
  };

  const handleAddPaymentTier = () => {
    const spacing = Number(conversionForm.paymentIntervalDays || 14);
    const nextOffset = (conversionForm.paymentTiers.length + 1) * spacing;
    setConversionForm((current) => ({
      ...current,
      paymentTiers: [
        ...current.paymentTiers,
        {
          type: "milestone",
          label: `Milestone ${current.paymentTiers.length + 1}`,
          amount: "",
          dueDate: addDays(current.billingStartDate || new Date(), nextOffset),
        },
      ],
    }));
  };

  const handleUpdatePaymentTier = (index, field, value) => {
    setConversionForm((current) => ({
      ...current,
      paymentTiers: current.paymentTiers.map((tier, tierIndex) =>
        tierIndex === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const handleRemovePaymentTier = (index) => {
    setConversionForm((current) => ({
      ...current,
      paymentTiers: current.paymentTiers.filter((_, tierIndex) => tierIndex !== index),
    }));
  };

  const handleConvertToProject = async (event) => {
    event.preventDefault();
    if (!selectedRow?.id || linkedProject) return;

    setConverting(true);
    setConversionError("");
    setError("");

    try {
      const agreedPrice = parseMoney(conversionForm.agreedPrice);
      const downPayment = parseMoney(conversionForm.downPayment);
      const currency = (conversionForm.currency || "USD").trim().toUpperCase();
      const projectName = conversionForm.projectName.trim();

      if (!PAYMENT_CURRENCY_OPTIONS.includes(currency)) {
        throw new Error("Currency must be USD or JMD.");
      }

      if (!conversionForm.finalVerdictConfirmed) {
        throw new Error("Confirm final verdict before converting to project.");
      }

      const milestoneTiers = parsePaymentTiers(
        conversionForm.paymentTiers,
        agreedPrice,
        downPayment
      );

      const invoicePlan = buildInvoicePlan({
        agreedPrice,
        downPayment,
        currency,
        paymentTiers: milestoneTiers,
        billingStartDate: conversionForm.billingStartDate,
        requestId: selectedRow.id,
      });

      if (!projectName) {
        throw new Error("Project name is required.");
      }

      if (!Number.isFinite(agreedPrice) || agreedPrice <= 0) {
        throw new Error("Agreed total price must be a valid number greater than zero.");
      }

      if (!Number.isFinite(downPayment) || downPayment < 0) {
        throw new Error("Down payment must be zero or a positive number.");
      }

      if (downPayment > agreedPrice) {
        throw new Error("Down payment cannot be greater than the agreed total price.");
      }

      const projectSummary = [
        `Converted from request #${selectedRow.id}`,
        `Agreed total: ${currency} ${agreedPrice.toFixed(2)}`,
        `Down payment: ${currency} ${downPayment.toFixed(2)}`,
        `Plan coverage: ${invoicePlan.completion}%`,
        milestoneTiers.length
          ? `Milestones: ${milestoneTiers
              .map(
                (item) =>
                  `${formatLabel(item.type)} - ${item.label} (${currency} ${item.amount.toFixed(
                    2
                  )})`
              )
              .join(", ")}`
          : "Milestones: none",
      ].join(" | ");

      const { data: project, error: projectError } = await supabase
        .from("customer_projects")
        .insert({
          request_id: selectedRow.id,
          name: projectName,
          customer_name: selectedRow.full_name || selectedRow.company || null,
          customer_email: selectedRow.email || null,
          service_type: selectedRow.service_type || null,
          summary: projectSummary,
          status: "active",
        })
        .select("*")
        .single();

      if (projectError) throw projectError;

      const invoiceRows = [];
      const finalizedStatus = conversionForm.finalVerdictConfirmed ? "issued" : "draft";
      const finalizedSentAt = conversionForm.finalVerdictConfirmed
        ? new Date().toISOString()
        : null;
      if (downPayment > 0) {
        invoiceRows.push({
          project_id: project.id,
          label: "Down payment",
          amount: downPayment,
          currency,
          due_date: formatDateInput(conversionForm.billingStartDate),
          status: finalizedStatus,
          sent_at: finalizedSentAt,
        });
      }

      milestoneTiers.forEach((tier) => {
        invoiceRows.push({
          project_id: project.id,
          label: `${formatLabel(tier.type)} - ${tier.label}`,
          amount: tier.amount,
          currency,
          due_date: tier.dueDate,
          status: finalizedStatus,
          sent_at: finalizedSentAt,
        });
      });

      if (invoiceRows.length) {
        const { error: invoiceError } = await supabase
          .from("project_invoices")
          .insert(invoiceRows);

        if (invoiceError) throw invoiceError;
      }

      const { error: timelineError } = await supabase
        .from("project_timeline_events")
        .insert({
          project_id: project.id,
          event_type: "milestone",
          title: "Project confirmed",
          details: `Converted from admin request #${selectedRow.id}. Invoice plan coverage ${invoicePlan.completion}% with ${invoicePlan.rows.length} scheduled payments.`,
        });

      if (timelineError) throw timelineError;

      const { data: updatedRequest, error: requestUpdateError } = await supabase
        .from("service_requests")
        .update({
          status: "closed",
          admin_updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRow.id)
        .select("*")
        .single();

      if (requestUpdateError) throw requestUpdateError;

      setRows((current) =>
        current.map((row) => (row.id === selectedRow.id ? updatedRequest : row))
      );
      setLinkedProject(project);
    } catch (failure) {
      console.error("Request conversion failed:", failure);
      setConversionError(
        failure?.message ||
          "Could not convert this request to a project. Check Supabase policies and try again."
      );
    } finally {
      setConverting(false);
    }
  };

  const handleSaveEstimateSnapshot = async () => {
    if (!selectedRow?.id || !liveEstimate) return;

    setSavingEstimateSnapshot(true);
    setEstimateError("");

    try {
      const payload = {
        request_id: selectedRow.id,
        rate_version: liveEstimate.rateVersion,
        currency: liveEstimate.currency,
        estimated_low: liveEstimate.low,
        estimated_target: liveEstimate.target,
        estimated_high: liveEstimate.high,
        confidence: liveEstimate.confidence,
        client_budget_text: liveEstimate.budget.text || null,
        client_budget_min: liveEstimate.budget.min,
        client_budget_max: liveEstimate.budget.max,
        variance_status: liveEstimate.varianceStatus,
        variance_amount: liveEstimate.varianceAmount,
        variance_percent: liveEstimate.variancePercent,
        estimate_payload: {
          factors: liveEstimate.factors,
          service_type: selectedRow.service_type,
        },
      };

      const { data, error: upsertError } = await supabase
        .from("service_request_estimates")
        .upsert(payload, { onConflict: "request_id" })
        .select("*")
        .single();

      if (upsertError) throw upsertError;
      setEstimateSnapshot(data);
    } catch (failure) {
      setEstimateError(getEstimateErrorText(failure));
    } finally {
      setSavingEstimateSnapshot(false);
    }
  };

  const handleSaveRatePreset = async () => {
    const serviceType = String(selectedRow?.service_type || "website").toLowerCase();
    if (!serviceType) return;

    setSavingRatePreset(true);
    setRatePresetError("");

    try {
      const baseRate = Number(ratePresetForm.baseRate);
      if (!Number.isFinite(baseRate) || baseRate <= 0) {
        throw new Error("Base rate must be a number greater than zero.");
      }

      let config = {};
      try {
        config = JSON.parse(ratePresetForm.modifiersJson || "{}");
      } catch {
        throw new Error("Modifiers JSON is invalid. Please provide valid JSON.");
      }

      const payload = {
        service_type: serviceType,
        currency: (ratePresetForm.currency || "JMD").trim().toUpperCase(),
        base_rate: baseRate,
        config,
      };

      const { data, error: saveError } = await supabase
        .from("service_pricing_presets")
        .upsert(payload, { onConflict: "service_type" })
        .select("service_type, currency, base_rate, config")
        .single();

      if (saveError) throw saveError;

      setRatePresetRows((current) => {
        const next = (current || []).filter((item) => item.service_type !== data.service_type);
        next.push(data);
        return next;
      });
    } catch (failure) {
      setRatePresetError(failure?.message || "Could not save pricing preset.");
    } finally {
      setSavingRatePreset(false);
    }
  };

  const handleCreateEstimateDraft = async () => {
    if (!linkedProject?.id || !liveEstimate || !selectedRow?.id) return;

    setCreatingEstimateDraft(true);
    setEstimateError("");

    try {
      const label = `Proposal Draft (${liveEstimate.rateVersion})`;
      const { data: existingDraft } = await supabase
        .from("project_invoices")
        .select("id")
        .eq("project_id", linkedProject.id)
        .eq("label", label)
        .limit(1);

      if (existingDraft?.length) {
        throw new Error("A proposal draft already exists for this estimate version.");
      }

      const { error: invoiceError } = await supabase.from("project_invoices").insert({
        project_id: linkedProject.id,
        label,
        amount: liveEstimate.target,
        currency: liveEstimate.currency,
        status: "draft",
      });

      if (invoiceError) throw invoiceError;

      const { error: timelineError } = await supabase.from("project_timeline_events").insert({
        project_id: linkedProject.id,
        event_type: "update",
        title: "Proposal draft generated",
        details: `Created from estimate snapshot on request #${selectedRow.id}.`,
      });

      if (timelineError) throw timelineError;

      if (["new", "contacted"].includes(selectedRow.status || "")) {
        const { data: updatedRequest, error: requestUpdateError } = await supabase
          .from("service_requests")
          .update({
            status: "quoted",
            admin_updated_at: new Date().toISOString(),
          })
          .eq("id", selectedRow.id)
          .select("*")
          .single();

        if (requestUpdateError) throw requestUpdateError;
        setRows((current) =>
          current.map((row) => (row.id === selectedRow.id ? updatedRequest : row))
        );
      }
    } catch (failure) {
      setEstimateError(failure?.message || "Could not create draft proposal invoice.");
    } finally {
      setCreatingEstimateDraft(false);
    }
  };

  const handleCopyQuoteNote = async () => {
    if (!quoteNote) return;
    try {
      await navigator.clipboard.writeText(quoteNote);
      setQuoteNoteCopyStatus("Copied");
    } catch {
      setQuoteNoteCopyStatus("Copy failed");
    }
  };

  const handleCopyClientInvoice = async () => {
    if (!conversionPreview?.clientText || !conversionPreview?.emailTemplate) return;
    try {
      await navigator.clipboard.writeText(
        buildExportInvoiceBundle(
          conversionPreview.clientText,
          conversionPreview.emailTemplate
        )
      );
      setClientInvoiceCopyStatus("Copied");
    } catch {
      setClientInvoiceCopyStatus("Copy failed");
    }
  };

  const handleExportClientInvoicePdf = () => {
    if (!conversionPreview?.rows?.length) return;

    const agreedPrice = parseMoney(conversionForm.agreedPrice);
    const currency = (conversionForm.currency || "USD").trim().toUpperCase();

    const exportBundle = buildExportInvoiceBundle(
      conversionPreview.clientText,
      conversionPreview.emailTemplate
    );

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Client Invoice Plan - ${escapeHtml(conversionForm.projectName || "Project")}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
      h1 { margin: 0 0 6px; }
      p { margin: 2px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 18px; }
      th, td { border: 1px solid #d0d0d0; padding: 8px; text-align: left; font-size: 13px; }
      th { background: #f3f5f7; }
      .right { text-align: right; }
      .summary { margin-top: 16px; font-weight: 700; }
      .muted { color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>Client Invoice Plan</h1>
    <p><strong>Project:</strong> ${escapeHtml(conversionForm.projectName || "Pending")}</p>
    <p><strong>Request:</strong> #${escapeHtml(selectedRow?.id || "N/A")}</p>
    <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Invoice</th>
          <th>Type</th>
          <th>Due Date</th>
          <th class="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${conversionPreview.rows
          .map(
            (row, index) => `<tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(row.label)}</td>
              <td>${escapeHtml(formatLabel(row.type || "milestone"))}</td>
              <td>${escapeHtml(row.due_date || "Not set")}</td>
              <td class="right">${escapeHtml(formatCurrency(row.amount, row.currency || currency))}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <p class="summary">Total agreed amount: ${escapeHtml(formatCurrency(agreedPrice || 0, currency))}</p>
    <p class="summary">Planned invoicing total: ${escapeHtml(formatCurrency(conversionPreview.invoiceTotal, currency))}</p>
    <p class="summary">Coverage: ${escapeHtml(conversionPreview.completion)}%</p>
    <p class="summary">Unallocated balance: ${escapeHtml(formatCurrency(conversionPreview.remaining, currency))}</p>
    <h2>Email Template</h2>
    <p><strong>Subject:</strong> ${escapeHtml(conversionPreview.emailTemplate.subject)}</p>
    <pre>${escapeHtml(conversionPreview.emailTemplate.body)}</pre>
    <h2>Combined Export Text</h2>
    <pre>${escapeHtml(exportBundle)}</pre>
    <p class="muted">Use Print and choose Save as PDF to export.</p>
  </body>
</html>`;

    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!printWindow) {
      setConversionError("Popup blocked. Allow popups to export PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (!authReady) {
    return (
      <main className="admin-shell">
        <div className="admin-bg" />
        <section className="admin-lock-card">
          <span className="admin-eyebrow">Private Admin</span>
          <h1>Loading admin access</h1>
          <p>Checking the current Supabase Auth session.</p>
        </section>
      </main>
    );
  }

  if (!isAdminSession(session)) {
    return (
      <main className="admin-shell">
        <div className="admin-bg" />
        <section className="admin-lock-card">
          <span className="admin-eyebrow">Private Admin</span>
          <h1>Sign in to the submissions console</h1>
          <p>
            Use a Supabase Auth account that has <code>app_metadata.role =
            "admin"</code>. Access is enforced by database policies, not a client-side key.
          </p>
          <form className="admin-lock-form" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
            <button type="submit" disabled={authLoading}>
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {authError ? <p className="admin-error">{authError}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-bg" />
      <section className="admin-page">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">A&apos;Dash Admin</span>
            <h1>
              {adminView === "requests"
                ? "Service request submissions"
                : "Customer project workspace"}
            </h1>
            <p>
              {adminView === "requests"
                ? "Review incoming leads, filter by request type, and move each item through your pipeline."
                : "Create and manage customer projects with timeline updates, notifications, invoices, deliverables, and approvals."}
            </p>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-view-switch" role="tablist" aria-label="Admin sections">
              <button
                type="button"
                className={adminView === "requests" ? "active" : ""}
                onClick={() => setAdminView("requests")}
              >
                Requests
              </button>
              <button
                type="button"
                className={adminView === "projects" ? "active" : ""}
                onClick={() => setAdminView("projects")}
              >
                Projects
              </button>
            </div>
            {adminView === "requests" ? (
              <button type="button" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            ) : null}
            <button type="button" className="admin-ghost" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {adminView === "requests" ? (
          <>
            <section className="admin-stats">
              {STATUS_OPTIONS.map((status) => (
                <div key={status} className={`admin-stat admin-status-${status}`}>
                  <span>{formatLabel(status)}</span>
                  <strong>{stats[status]}</strong>
                </div>
              ))}
            </section>

            <section className="admin-filters">
              <div className="admin-filter-group">
                <label htmlFor="request-filter">Request type</label>
                <select
                  id="request-filter"
                  value={requestFilter}
                  onChange={(event) => setRequestFilter(event.target.value)}
                >
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All request types" : formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-filter-group">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {error ? <p className="admin-error">{error}</p> : null}

            <section className="admin-content">
              <aside className="admin-list">
                <div className="admin-list-head">
                  <strong>Submissions</strong>
                  <span>{filteredRows.length} visible</span>
                </div>

                {loading ? <div className="admin-empty">Loading submissions...</div> : null}

                {!loading && !filteredRows.length ? (
                  <div className="admin-empty">No submissions match the current filters.</div>
                ) : null}

                {!loading &&
                  filteredRows.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      className={`admin-row ${selectedRow?.id === row.id ? "active" : ""}`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <div className="admin-row-top">
                        <strong>{row.full_name || "Unnamed request"}</strong>
                        <span className={`admin-pill admin-status-${row.status || "new"}`}>
                          {formatLabel(row.status || "new")}
                        </span>
                      </div>
                      <span className="admin-row-type">
                        {formatLabel(row.service_type || "unknown")}
                      </span>
                      <span className="admin-row-meta">
                        {row.company || row.email || "No company or email"}
                      </span>
                      <span className="admin-row-date">{formatDate(row.created_at)}</span>
                    </button>
                  ))}
              </aside>

              <section className="admin-detail">
                {!selectedRow ? (
                  <div className="admin-empty">Select a submission to review its details.</div>
                ) : (
                  <>
                    <div className="admin-detail-head">
                      <div>
                        <span className="admin-eyebrow">Submission detail</span>
                        <h2>{selectedRow.full_name || "Unnamed request"}</h2>
                        <p>
                          {formatLabel(selectedRow.service_type)} request submitted on{" "}
                          {formatDate(selectedRow.created_at)}.
                        </p>
                      </div>

                      <div className="admin-detail-status">
                        <label htmlFor="status-select">Pipeline status</label>
                        <select
                          id="status-select"
                          value={selectedRow.status || "new"}
                          onChange={(event) => handleStatusChange(event.target.value)}
                          disabled={savingStatus}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="admin-detail-grid">
                      <SubmissionField label="Company" value={selectedRow.company} />
                      <SubmissionField label="Email" value={selectedRow.email} />
                      <SubmissionField label="WhatsApp" value={selectedRow.whatsapp} />
                      <SubmissionField label="Region" value={selectedRow.region} />
                      <SubmissionField
                        label="Client type"
                        value={selectedRow.client_type}
                      />
                      <SubmissionField
                        label="Last admin update"
                        value={formatDate(selectedRow.admin_updated_at)}
                      />
                    </div>

                    {liveEstimate ? (
                      <section className="admin-estimate-card">
                        <div className="admin-estimate-head">
                          <div>
                            <span className="admin-eyebrow">AI Pricing Estimate</span>
                            <h3>Estimated project price against selected budget</h3>
                          </div>
                          <span
                            className={`admin-estimate-variance admin-estimate-${liveEstimate.varianceStatus}`}
                          >
                            {liveEstimate.varianceStatus === "within"
                              ? "Within Budget"
                              : liveEstimate.varianceStatus === "near"
                              ? "Near Budget"
                              : liveEstimate.varianceStatus === "over"
                              ? "Over Budget"
                              : "Budget Unknown"}
                          </span>
                        </div>

                        <div className="admin-estimate-grid">
                          <div className="admin-estimate-item">
                            <span>Low Estimate</span>
                            <strong>{formatCurrency(liveEstimate.low, liveEstimate.currency)}</strong>
                          </div>
                          <div className="admin-estimate-item">
                            <span>Target Estimate</span>
                            <strong>{formatCurrency(liveEstimate.target, liveEstimate.currency)}</strong>
                          </div>
                          <div className="admin-estimate-item">
                            <span>High Estimate</span>
                            <strong>{formatCurrency(liveEstimate.high, liveEstimate.currency)}</strong>
                          </div>
                          <div className="admin-estimate-item">
                            <span>Client Budget</span>
                            <strong>{
                              liveEstimate.budget.text || "Not selected"
                            }</strong>
                          </div>
                          <div className="admin-estimate-item">
                            <span>Variance (Target vs Budget Max)</span>
                            <strong>
                              {liveEstimate.varianceAmount == null
                                ? "N/A"
                                : `${formatCurrency(liveEstimate.varianceAmount, liveEstimate.currency)} (${liveEstimate.variancePercent.toFixed(1)}%)`}
                            </strong>
                          </div>
                          <div className="admin-estimate-item">
                            <span>Confidence</span>
                            <strong>{liveEstimate.confidence}%</strong>
                          </div>
                        </div>

                        <div className="admin-estimate-actions">
                          <button
                            type="button"
                            onClick={handleSaveEstimateSnapshot}
                            disabled={savingEstimateSnapshot}
                          >
                            {savingEstimateSnapshot ? "Saving..." : "Save Estimate Snapshot"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateEstimateDraft}
                            disabled={creatingEstimateDraft || !linkedProject}
                          >
                            {creatingEstimateDraft
                              ? "Creating draft..."
                              : linkedProject
                              ? "Create Proposal/Invoice Draft"
                              : "Link Project To Create Draft"}
                          </button>
                          <span>
                            {loadingEstimateSnapshot
                              ? "Loading saved snapshot..."
                              : estimateSnapshot?.updated_at
                              ? `Saved ${formatDate(estimateSnapshot.updated_at)}`
                              : "No snapshot saved yet"}
                          </span>
                        </div>

                        <ul className="admin-estimate-factors">
                          {liveEstimate.factors.slice(0, 6).map((factor) => (
                            <li key={factor}>{factor}</li>
                          ))}
                        </ul>

                        <div className="admin-quote-note">
                          <span className="admin-panel-label">Client-facing quote note</span>
                          <textarea readOnly value={quoteNote} />
                          <div className="admin-estimate-actions">
                            <button type="button" onClick={handleCopyQuoteNote}>
                              Copy Quote Note
                            </button>
                            {quoteNoteCopyStatus ? <span>{quoteNoteCopyStatus}</span> : null}
                          </div>
                        </div>

                        {estimateError ? <p className="admin-error">{estimateError}</p> : null}
                      </section>
                    ) : null}

                    <section className="admin-rate-card">
                      <div className="admin-convert-head">
                        <div>
                          <span className="admin-eyebrow">Rate Preset Config</span>
                          <h3>Editable pricing rates for {formatLabel(selectedRow.service_type)}</h3>
                          <p>
                            Update base rate and modifier JSON; estimates refresh immediately for this request type.
                          </p>
                        </div>
                        {loadingRatePresets ? (
                          <span className="admin-convert-badge">Loading presets...</span>
                        ) : (
                          <span className="admin-convert-badge">Preset source: Supabase</span>
                        )}
                      </div>

                      <div className="admin-rate-form">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Base rate"
                          value={ratePresetForm.baseRate}
                          onChange={(event) =>
                            setRatePresetForm((current) => ({
                              ...current,
                              baseRate: event.target.value,
                            }))
                          }
                          disabled={savingRatePreset}
                        />
                        <input
                          type="text"
                          placeholder="Currency"
                          value={ratePresetForm.currency}
                          onChange={(event) =>
                            setRatePresetForm((current) => ({
                              ...current,
                              currency: event.target.value,
                            }))
                          }
                          disabled={savingRatePreset}
                        />
                        <textarea
                          placeholder='Modifiers JSON (example: {"featureUnit": 30000})'
                          value={ratePresetForm.modifiersJson}
                          onChange={(event) =>
                            setRatePresetForm((current) => ({
                              ...current,
                              modifiersJson: event.target.value,
                            }))
                          }
                          disabled={savingRatePreset}
                        />
                        <div className="admin-convert-actions">
                          <button
                            type="button"
                            onClick={handleSaveRatePreset}
                            disabled={savingRatePreset || loadingRatePresets}
                          >
                            {savingRatePreset ? "Saving preset..." : "Save Rate Preset"}
                          </button>
                        </div>
                      </div>

                      {ratePresetError ? <p className="admin-error">{ratePresetError}</p> : null}
                    </section>

                    <section className="admin-convert-card">
                      <div className="admin-convert-head">
                        <div>
                          <span className="admin-eyebrow">Convert To Project</span>
                          <h3>Confirm this lead as a customer project</h3>
                          <p>
                            Capture agreed pricing terms and generate draft invoices in one action.
                          </p>
                        </div>

                        {loadingLinkedProject ? (
                          <span className="admin-convert-badge">Checking link...</span>
                        ) : linkedProject ? (
                          <span className="admin-convert-badge admin-convert-badge-linked">
                            Linked: #{linkedProject.id} {linkedProject.name}
                          </span>
                        ) : (
                          <span className="admin-convert-badge">Not linked yet</span>
                        )}
                      </div>

                      <form className="admin-convert-form" onSubmit={handleConvertToProject}>
                        <input
                          type="text"
                          placeholder="Project name"
                          value={conversionForm.projectName}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              projectName: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Agreed total price"
                          value={conversionForm.agreedPrice}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              agreedPrice: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Down payment"
                          value={conversionForm.downPayment}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              downPayment: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        />
                        <select
                          value={conversionForm.currency}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              currency: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        >
                          {PAYMENT_CURRENCY_OPTIONS.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>

                        <input
                          type="date"
                          value={conversionForm.billingStartDate}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              billingStartDate: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        />
                        <input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Default tier spacing (days)"
                          value={conversionForm.paymentIntervalDays}
                          onChange={(event) =>
                            setConversionForm((current) => ({
                              ...current,
                              paymentIntervalDays: event.target.value,
                            }))
                          }
                          disabled={converting || Boolean(linkedProject)}
                        />

                        <div className="admin-tier-controls">
                          <label htmlFor="payment-package-select">Payment Package</label>
                          <select
                            id="payment-package-select"
                            value={conversionForm.paymentPackage}
                            onChange={(event) =>
                              setConversionForm((current) => ({
                                ...current,
                                paymentPackage: event.target.value,
                              }))
                            }
                            disabled={converting || Boolean(linkedProject)}
                          >
                            {PAYMENT_TIER_PACKAGES.map((item) => (
                              <option key={item.key} value={item.key}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="admin-tier-package-actions">
                          <button
                            type="button"
                            onClick={() => handleGeneratePaymentTiers("selected")}
                            disabled={converting || Boolean(linkedProject)}
                          >
                            Apply Selected Package
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGeneratePaymentTiers("auto")}
                            disabled={converting || Boolean(linkedProject)}
                          >
                            Auto Package By Amount
                          </button>
                          <button
                            type="button"
                            className="admin-ghost"
                            onClick={handleAddPaymentTier}
                            disabled={converting || Boolean(linkedProject)}
                          >
                            Add Custom Tier
                          </button>
                        </div>

                        <div className="admin-tier-list">
                          {!conversionForm.paymentTiers.length ? (
                            <p className="admin-note">
                              No payment tiers yet. Apply a package or add custom tiers.
                            </p>
                          ) : null}

                          {conversionForm.paymentTiers.map((tier, index) => (
                            <div key={`${tier.type}-${index}`} className="admin-tier-row">
                              <select
                                value={tier.type}
                                onChange={(event) =>
                                  handleUpdatePaymentTier(index, "type", event.target.value)
                                }
                                disabled={converting || Boolean(linkedProject)}
                              >
                                {PAYMENT_TYPE_OPTIONS.map((type) => (
                                  <option key={type} value={type}>
                                    {formatLabel(type)}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="Tier label"
                                value={tier.label}
                                onChange={(event) =>
                                  handleUpdatePaymentTier(index, "label", event.target.value)
                                }
                                disabled={converting || Boolean(linkedProject)}
                              />
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                value={tier.amount}
                                onChange={(event) =>
                                  handleUpdatePaymentTier(index, "amount", event.target.value)
                                }
                                disabled={converting || Boolean(linkedProject)}
                              />
                              <input
                                type="date"
                                value={tier.dueDate || ""}
                                onChange={(event) =>
                                  handleUpdatePaymentTier(index, "dueDate", event.target.value)
                                }
                                disabled={converting || Boolean(linkedProject)}
                              />
                              <button
                                type="button"
                                className="admin-ghost"
                                onClick={() => handleRemovePaymentTier(index)}
                                disabled={converting || Boolean(linkedProject)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="admin-convert-progress">
                          <div className="admin-convert-progress-head">
                            <strong>Finalization Progress</strong>
                            <span>{conversionChecklist.percent}%</span>
                          </div>
                          <div className="admin-progress-track">
                            <div
                              className="admin-progress-fill"
                              style={{ width: `${conversionChecklist.percent}%` }}
                            />
                          </div>
                          <div className="admin-convert-checks">
                            {conversionChecklist.checks.map((check) => (
                              <span
                                key={check.label}
                                className={check.done ? "is-done" : "is-pending"}
                              >
                                {check.done ? "Done" : "Pending"}: {check.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <label className="admin-final-verdict-toggle">
                          <input
                            type="checkbox"
                            checked={conversionForm.finalVerdictConfirmed}
                            onChange={(event) =>
                              setConversionForm((current) => ({
                                ...current,
                                finalVerdictConfirmed: event.target.checked,
                              }))
                            }
                            disabled={converting || Boolean(linkedProject)}
                          />
                          <span>Final verdict confirmed for conversion</span>
                        </label>

                        {conversionPreview ? (
                          <div className="admin-invoice-preview">
                            <span className="admin-panel-label">Client invoice structure preview</span>
                            <div className="admin-invoice-preview-grid">
                              <div>
                                <span>Total Planned</span>
                                <strong>
                                  {formatCurrency(
                                    conversionPreview.invoiceTotal,
                                    conversionForm.currency
                                  )}
                                </strong>
                              </div>
                              <div>
                                <span>Coverage</span>
                                <strong>{conversionPreview.completion}%</strong>
                              </div>
                              <div>
                                <span>Unallocated</span>
                                <strong>
                                  {formatCurrency(
                                    conversionPreview.remaining,
                                    conversionForm.currency
                                  )}
                                </strong>
                              </div>
                            </div>
                            <textarea readOnly value={conversionPreview.clientText} />
                            <div className="admin-estimate-actions">
                              <button type="button" onClick={handleCopyClientInvoice}>
                                Copy Client Invoice Text
                              </button>
                              <button type="button" onClick={handleExportClientInvoicePdf}>
                                Export Invoice PDF
                              </button>
                              {clientInvoiceCopyStatus ? (
                                <span>{clientInvoiceCopyStatus}</span>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        <div className="admin-convert-actions">
                          <button
                            type="submit"
                            disabled={
                              converting ||
                              Boolean(linkedProject) ||
                              conversionChecklist.percent < 100
                            }
                          >
                            {converting ? "Converting..." : "Convert To Confirmed Project"}
                          </button>
                          {linkedProject ? (
                            <button
                              type="button"
                              className="admin-ghost"
                              onClick={() => setAdminView("projects")}
                            >
                              Open Project Workspace
                            </button>
                          ) : null}
                        </div>
                      </form>

                      {conversionError ? <p className="admin-error">{conversionError}</p> : null}
                    </section>

                    <div className="admin-detail-panels">
                      <div className="admin-panel">
                        <span className="admin-panel-label">Structured payload</span>
                        <pre>{JSON.stringify(selectedRow.payload || {}, null, 2)}</pre>
                      </div>

                      <div className="admin-panel">
                        <span className="admin-panel-label">Summary</span>
                        <dl className="admin-summary">
                          {Object.entries(selectedRow.payload || {})
                            .filter(
                              ([, value]) =>
                                value !== "" &&
                                value !== null &&
                                value !== false &&
                                !(Array.isArray(value) && value.length === 0)
                            )
                            .slice(0, 10)
                            .map(([key, value]) => (
                              <div key={key}>
                                <dt>{formatLabel(key)}</dt>
                                <dd>
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </dd>
                              </div>
                            ))}
                        </dl>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </section>
          </>
        ) : (
          <AdminProjectsWorkspace supabase={supabase} formatDate={formatDate} />
        )}
      </section>
    </main>
  );
}
