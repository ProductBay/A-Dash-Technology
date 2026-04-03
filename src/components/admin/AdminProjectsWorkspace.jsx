import { useEffect, useMemo, useState } from "react";

const PROJECT_STATUS = ["active", "paused", "completed", "archived"];
const INVOICE_STATUS = ["draft", "issued", "paid", "overdue"];
const DELIVERABLE_STATUS = ["queued", "in_progress", "submitted", "approved"];
const CHECKPOINT_STATUS = ["pending", "approved", "rejected"];

function labelize(value) {
  if (!value) return "Unknown";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusClass(value) {
  return `admin-pill admin-status-${value || "new"}`;
}

function formatMoney(amount, currency) {
  const numeric = Number(amount || 0);
  const safeCurrency = currency || "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return `${safeCurrency} ${numeric.toFixed(2)}`;
  }
}

function isoDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function yesNo(value) {
  return String(value || "").toLowerCase() === "yes";
}

function buildClientRequestedChecklist({
  project,
  requestPayload,
  timelineRows,
  invoiceRows,
  deliverableRows,
  checkpointRows,
}) {
  const serviceType = String(project?.service_type || "").toLowerCase();
  const payload = requestPayload || {};

  const scopeSignals =
    hasArray(payload.features) ||
    hasArray(payload.coreFeatures) ||
    Boolean(String(payload.summary || "").trim()) ||
    hasArray(payload.goals);

  const checklist = [
    {
      key: "scope",
      title: "Scope requirements captured",
      details: "Confirm business goals, feature scope, and technical boundaries from the request.",
      done: scopeSignals,
    },
    {
      key: "stakeholders",
      title: "Client stakeholders and channel confirmed",
      details: "Ensure primary contacts, company context, and communication channels are documented.",
      done: Boolean(project?.customer_name || project?.customer_email),
    },
    {
      key: "timeline",
      title: "Timeline plan created",
      details: "Set baseline milestones and updates for client-facing execution flow.",
      done: (timelineRows || []).length > 0,
    },
    {
      key: "invoices",
      title: "Payment structure finalized",
      details: "Draft invoice schedule should be aligned to agreed amount and phase deliverables.",
      done: (invoiceRows || []).length > 0,
    },
    {
      key: "deliverables",
      title: "Deliverables and ownership set",
      details: "List all required outputs, target dates, and ownership to avoid scope drift.",
      done: (deliverableRows || []).length > 0,
    },
    {
      key: "approvals",
      title: "Approval checkpoints configured",
      details: "Define acceptance gates for design, build, QA, and launch readiness.",
      done: (checkpointRows || []).length > 0,
    },
  ];

  if (serviceType === "website") {
    checklist.push({
      key: "website-assets",
      title: "Brand/assets readiness reviewed",
      details: "Validate design assets, references, and migration requirements before build execution.",
      done: yesNo(payload.hasDesign) || Boolean(String(payload.referenceLinks || "").trim()),
    });
  }

  if (serviceType === "software") {
    checklist.push({
      key: "software-integrations",
      title: "Integrations and security needs reviewed",
      details: "Confirm API dependencies, role model, and security constraints for architecture kickoff.",
      done: hasArray(payload.integrations) || hasArray(payload.securityNeeds) || yesNo(payload.hasApi),
    });
  }

  return checklist;
}

function buildAiExecutionGuide({ project, checklist, requestPayload }) {
  const incomplete = checklist.filter((item) => !item.done);
  const serviceType = String(project?.service_type || "project").toLowerCase();
  const payload = requestPayload || {};

  const firstPriority = incomplete[0]?.title || "Baseline execution is configured";

  const steps = [
    {
      phase: "1. Intake alignment",
      hint:
        incomplete.find((item) => item.key === "scope")
          ? "Start by converting request payload into a concise technical brief and acceptance criteria."
          : "Scope is available. Keep a one-page technical brief updated as source of truth.",
      vscodeTip: "Use VS Code workspace notes (docs/project-brief.md) and keep a change log per milestone.",
    },
    {
      phase: "2. Execution setup",
      hint:
        incomplete.find((item) => item.key === "timeline") || incomplete.find((item) => item.key === "deliverables")
          ? "Define timeline events and deliverables before coding to reduce rework."
          : "Timeline and deliverables are set. Confirm checkpoint owners and handoff conditions.",
      vscodeTip: "Break delivery into folders/tasks by milestone and map each to feature branches.",
    },
    {
      phase: "3. Financial + release control",
      hint:
        incomplete.find((item) => item.key === "invoices") || incomplete.find((item) => item.key === "approvals")
          ? "Finalize invoice structure and approval gates before major implementation milestones."
          : "Use approvals and invoice schedule to enforce release quality and payment cadence.",
      vscodeTip: "Before each release checkpoint, run build/test scripts and attach outputs to timeline events.",
    },
  ];

  const serviceHints = [];
  if (serviceType === "website") {
    serviceHints.push("Prioritize sitemap/content structure and responsive component inventory before styling details.");
  }
  if (serviceType === "software") {
    serviceHints.push("Model roles, core entities, and API contracts first; implement vertical slices per milestone.");
  }
  if (serviceType === "discovery") {
    serviceHints.push("Focus on requirement validation, risk log, and phased roadmap before committing build estimates.");
  }

  if (Boolean(String(payload.timeline || "").trim())) {
    serviceHints.push(`Client timeline signal: ${String(payload.timeline).trim()}. Plan checkpoints against this window.`);
  }

  return {
    firstPriority,
    steps,
    serviceHints,
  };
}

export default function AdminProjectsWorkspace({ supabase, formatDate }) {
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    customer_name: "",
    customer_email: "",
    service_type: "",
    summary: "",
  });
  const [creatingProject, setCreatingProject] = useState(false);

  const [timelineRows, setTimelineRows] = useState([]);
  const [notificationRows, setNotificationRows] = useState([]);
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [deliverableRows, setDeliverableRows] = useState([]);
  const [checkpointRows, setCheckpointRows] = useState([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [linkedRequest, setLinkedRequest] = useState(null);
  const [briefCopyStatus, setBriefCopyStatus] = useState("");

  const [timelineForm, setTimelineForm] = useState({
    event_type: "update",
    title: "",
    details: "",
  });
  const [notificationForm, setNotificationForm] = useState({
    channel: "email",
    recipient: "",
    message: "",
  });
  const [invoiceForm, setInvoiceForm] = useState({
    label: "",
    amount: "",
    currency: "USD",
    due_date: "",
  });
  const [deliverableForm, setDeliverableForm] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [checkpointForm, setCheckpointForm] = useState({
    checkpoint: "",
    owner: "",
    notes: "",
  });

  async function syncOverdueInvoices(projectId) {
    const today = isoDate(new Date());
    const { error } = await supabase
      .from("project_invoices")
      .update({ status: "overdue" })
      .eq("project_id", projectId)
      .in("status", ["draft", "issued"])
      .lt("due_date", today);

    if (error) {
      console.error("Overdue sync failed", error);
    }
  }

  const selectedProject = useMemo(
    () => projects.find((item) => item.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const accountingSummary = useMemo(() => {
    if (!invoiceRows.length) {
      return {
        agreedTotal: 0,
        paidTotal: 0,
        remainingTotal: 0,
        invoiceCount: 0,
        paidCount: 0,
        currency: "USD",
      };
    }

    const currencyCounts = invoiceRows.reduce((acc, row) => {
      const currency = row.currency || "USD";
      acc[currency] = (acc[currency] || 0) + 1;
      return acc;
    }, {});

    const dominantCurrency = Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "USD";

    const agreedTotal = invoiceRows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );
    const paidRows = invoiceRows.filter((row) => row.status === "paid");
    const paidTotal = paidRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const remainingTotal = agreedTotal - paidTotal;

    return {
      agreedTotal,
      paidTotal,
      remainingTotal,
      invoiceCount: invoiceRows.length,
      paidCount: paidRows.length,
      currency: dominantCurrency,
    };
  }, [invoiceRows]);

  const balanceState = useMemo(() => {
    if (!accountingSummary.invoiceCount) return "open";
    if (accountingSummary.remainingTotal < 0) return "overpaid";
    if (accountingSummary.remainingTotal === 0) return "settled";
    return "open";
  }, [accountingSummary]);

  const clientChecklist = useMemo(() => {
    return buildClientRequestedChecklist({
      project: selectedProject,
      requestPayload: linkedRequest?.payload,
      timelineRows,
      invoiceRows,
      deliverableRows,
      checkpointRows,
    });
  }, [selectedProject, linkedRequest, timelineRows, invoiceRows, deliverableRows, checkpointRows]);

  const checklistProgress = useMemo(() => {
    if (!clientChecklist.length) return 0;
    const doneCount = clientChecklist.filter((item) => item.done).length;
    return Math.round((doneCount / clientChecklist.length) * 100);
  }, [clientChecklist]);

  const aiGuide = useMemo(() => {
    return buildAiExecutionGuide({
      project: selectedProject,
      checklist: clientChecklist,
      requestPayload: linkedRequest?.payload,
    });
  }, [selectedProject, clientChecklist, linkedRequest]);

  async function loadProjects() {
    setProjectError("");
    setProjectLoading(true);

    try {
      const { data, error } = await supabase
        .from("customer_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      setSelectedProjectId((current) => {
        if (current && (data || []).some((item) => item.id === current)) {
          return current;
        }
        return data?.[0]?.id || null;
      });
    } catch (failure) {
      console.error("Project load failed", failure);
      setProjectError(
        "Could not load customer projects. Ensure the new workspace tables are created from supabase/service_requests.sql."
      );
    } finally {
      setProjectLoading(false);
    }
  }

  async function loadWorkspace(projectId) {
    if (!projectId) {
      setTimelineRows([]);
      setNotificationRows([]);
      setInvoiceRows([]);
      setDeliverableRows([]);
      setCheckpointRows([]);
      setLinkedRequest(null);
      return;
    }

    setWorkspaceLoading(true);
    setProjectError("");

    try {
      await syncOverdueInvoices(projectId);

      const projectRow = projects.find((item) => item.id === projectId) || null;

      const [timelineResult, notificationResult, invoiceResult, deliverableResult, checkpointResult, requestResult] = await Promise.all([
        supabase
          .from("project_timeline_events")
          .select("*")
          .eq("project_id", projectId)
          .order("event_at", { ascending: false }),
        supabase
          .from("project_notifications")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_invoices")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_deliverables")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_approval_checkpoints")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
        projectRow?.request_id
          ? supabase
              .from("service_requests")
              .select("id, payload, service_type, full_name, company")
              .eq("id", projectRow.request_id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      const results = [
        timelineResult,
        notificationResult,
        invoiceResult,
        deliverableResult,
        checkpointResult,
      ];

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) throw firstError;

      setTimelineRows(timelineResult.data || []);
      setNotificationRows(notificationResult.data || []);
      setInvoiceRows(invoiceResult.data || []);
      setDeliverableRows(deliverableResult.data || []);
      setCheckpointRows(checkpointResult.data || []);
      setLinkedRequest(requestResult.data || null);
    } catch (failure) {
      console.error("Workspace load failed", failure);
      setProjectError("Could not load workspace details for the selected project.");
    } finally {
      setWorkspaceLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadWorkspace(selectedProjectId);
  }, [selectedProjectId]);

  async function handleCreateProject(event) {
    event.preventDefault();
    setCreatingProject(true);
    setProjectError("");

    try {
      const payload = {
        name: createForm.name.trim(),
        customer_name: createForm.customer_name.trim() || null,
        customer_email: createForm.customer_email.trim() || null,
        service_type: createForm.service_type.trim() || null,
        summary: createForm.summary.trim() || null,
      };

      if (!payload.name) {
        throw new Error("Project name is required.");
      }

      const { data, error } = await supabase
        .from("customer_projects")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;

      setProjects((current) => [data, ...current]);
      setSelectedProjectId(data.id);
      setCreateForm({
        name: "",
        customer_name: "",
        customer_email: "",
        service_type: "",
        summary: "",
      });
    } catch (failure) {
      console.error("Project create failed", failure);
      setProjectError(failure.message || "Could not create project.");
    } finally {
      setCreatingProject(false);
    }
  }

  async function handleProjectStatus(status) {
    if (!selectedProject) return;

    try {
      const { data, error } = await supabase
        .from("customer_projects")
        .update({ status })
        .eq("id", selectedProject.id)
        .select("*")
        .single();

      if (error) throw error;

      setProjects((current) =>
        current.map((item) => (item.id === selectedProject.id ? data : item))
      );
    } catch (failure) {
      console.error("Project status update failed", failure);
      setProjectError("Could not update project status.");
    }
  }

  async function addTimelineEvent(event) {
    event.preventDefault();
    if (!selectedProject) return;

    try {
      if (!timelineForm.title.trim()) {
        throw new Error("Timeline title is required.");
      }

      const { data, error } = await supabase
        .from("project_timeline_events")
        .insert({
          project_id: selectedProject.id,
          event_type: timelineForm.event_type,
          title: timelineForm.title.trim(),
          details: timelineForm.details.trim() || null,
        })
        .select("*")
        .single();

      if (error) throw error;

      setTimelineRows((current) => [data, ...current]);
      setTimelineForm({ event_type: "update", title: "", details: "" });

      if (selectedProject.customer_email) {
        const note = `${data.title}${data.details ? ` - ${data.details}` : ""}`;
        await supabase.from("project_notifications").insert({
          project_id: selectedProject.id,
          channel: "email",
          recipient: selectedProject.customer_email,
          message: `Project update: ${note}`,
          status: "pending",
        });
      }
    } catch (failure) {
      console.error("Timeline add failed", failure);
      setProjectError(failure.message || "Could not add timeline event.");
    }
  }

  async function addNotification(event) {
    event.preventDefault();
    if (!selectedProject) return;

    try {
      if (!notificationForm.message.trim()) {
        throw new Error("Notification message is required.");
      }

      const { data, error } = await supabase
        .from("project_notifications")
        .insert({
          project_id: selectedProject.id,
          channel: notificationForm.channel,
          recipient: notificationForm.recipient.trim() || null,
          message: notificationForm.message.trim(),
          status: "pending",
        })
        .select("*")
        .single();

      if (error) throw error;

      setNotificationRows((current) => [data, ...current]);
      setNotificationForm({ channel: "email", recipient: "", message: "" });
    } catch (failure) {
      console.error("Notification add failed", failure);
      setProjectError(failure.message || "Could not add notification.");
    }
  }

  async function addInvoice(event) {
    event.preventDefault();
    if (!selectedProject) return;

    try {
      if (!invoiceForm.label.trim()) {
        throw new Error("Invoice label is required.");
      }

      const numericAmount = Number(invoiceForm.amount || 0);
      const { data, error } = await supabase
        .from("project_invoices")
        .insert({
          project_id: selectedProject.id,
          label: invoiceForm.label.trim(),
          amount: Number.isFinite(numericAmount) ? numericAmount : 0,
          currency: invoiceForm.currency.trim() || "USD",
          due_date: invoiceForm.due_date || null,
        })
        .select("*")
        .single();

      if (error) throw error;

      setInvoiceRows((current) => [data, ...current]);
      setInvoiceForm({ label: "", amount: "", currency: "USD", due_date: "" });
    } catch (failure) {
      console.error("Invoice add failed", failure);
      setProjectError(failure.message || "Could not add invoice.");
    }
  }

  async function updateInvoiceStatus(invoiceId, status) {
    try {
      const payload = {
        status,
        sent_at: status === "issued" || status === "paid" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("project_invoices")
        .update(payload)
        .eq("id", invoiceId)
        .select("*")
        .single();

      if (error) throw error;

      setInvoiceRows((current) =>
        current.map((item) => (item.id === invoiceId ? data : item))
      );
    } catch (failure) {
      console.error("Invoice status update failed", failure);
      setProjectError("Could not update invoice status.");
    }
  }

  async function addDeliverable(event) {
    event.preventDefault();
    if (!selectedProject) return;

    try {
      if (!deliverableForm.title.trim()) {
        throw new Error("Deliverable title is required.");
      }

      const { data, error } = await supabase
        .from("project_deliverables")
        .insert({
          project_id: selectedProject.id,
          title: deliverableForm.title.trim(),
          description: deliverableForm.description.trim() || null,
          due_date: deliverableForm.due_date || null,
        })
        .select("*")
        .single();

      if (error) throw error;

      setDeliverableRows((current) => [data, ...current]);
      setDeliverableForm({ title: "", description: "", due_date: "" });
    } catch (failure) {
      console.error("Deliverable add failed", failure);
      setProjectError(failure.message || "Could not add deliverable.");
    }
  }

  async function updateDeliverableStatus(deliverableId, status) {
    try {
      const { data, error } = await supabase
        .from("project_deliverables")
        .update({ status })
        .eq("id", deliverableId)
        .select("*")
        .single();

      if (error) throw error;

      setDeliverableRows((current) =>
        current.map((item) => (item.id === deliverableId ? data : item))
      );
    } catch (failure) {
      console.error("Deliverable status update failed", failure);
      setProjectError("Could not update deliverable status.");
    }
  }

  async function addCheckpoint(event) {
    event.preventDefault();
    if (!selectedProject) return;

    try {
      if (!checkpointForm.checkpoint.trim()) {
        throw new Error("Checkpoint title is required.");
      }

      const { data, error } = await supabase
        .from("project_approval_checkpoints")
        .insert({
          project_id: selectedProject.id,
          checkpoint: checkpointForm.checkpoint.trim(),
          owner: checkpointForm.owner.trim() || null,
          notes: checkpointForm.notes.trim() || null,
        })
        .select("*")
        .single();

      if (error) throw error;

      setCheckpointRows((current) => [data, ...current]);
      setCheckpointForm({ checkpoint: "", owner: "", notes: "" });
    } catch (failure) {
      console.error("Checkpoint add failed", failure);
      setProjectError(failure.message || "Could not add checkpoint.");
    }
  }

  async function updateCheckpointStatus(checkpointId, status) {
    try {
      const payload = {
        status,
        approved_at: status === "approved" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("project_approval_checkpoints")
        .update(payload)
        .eq("id", checkpointId)
        .select("*")
        .single();

      if (error) throw error;

      setCheckpointRows((current) =>
        current.map((item) => (item.id === checkpointId ? data : item))
      );
    } catch (failure) {
      console.error("Checkpoint status update failed", failure);
      setProjectError("Could not update checkpoint status.");
    }
  }

  async function handleCopyExecutionBrief() {
    if (!selectedProject) return;

    const lines = [
      `Project: ${selectedProject.name}`,
      `Checklist completion: ${checklistProgress}%`,
      `Start priority: ${aiGuide.firstPriority}`,
      "",
      "Checklist:",
      ...clientChecklist.map((item) =>
        `- ${item.done ? "[Done]" : "[Pending]"} ${item.title}: ${item.details}`
      ),
      "",
      "AI guidance:",
      ...aiGuide.steps.map(
        (step) => `- ${step.phase}: ${step.hint} | VS Code tip: ${step.vscodeTip}`
      ),
      ...(aiGuide.serviceHints.length ? ["", "Service hints:", ...aiGuide.serviceHints.map((hint) => `- ${hint}`)] : []),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setBriefCopyStatus("Copied");
    } catch {
      setBriefCopyStatus("Copy failed");
    }
  }

  function handleExportProjectInvoicesPdf() {
    if (!selectedProject) return;
    if (!invoiceRows.length) {
      setProjectError("No invoices available to export yet.");
      return;
    }

    const sortedRows = [...invoiceRows].sort((a, b) => {
      const aDue = a.due_date || "9999-12-31";
      const bDue = b.due_date || "9999-12-31";
      return aDue.localeCompare(bDue);
    });

    const currency = sortedRows[0]?.currency || "USD";
    const total = sortedRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice Schedule - ${escapeHtml(selectedProject.name)}</title>
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
    <h1>Invoice Schedule</h1>
    <p><strong>Project:</strong> ${escapeHtml(selectedProject.name)}</p>
    <p><strong>Customer:</strong> ${escapeHtml(selectedProject.customer_name || selectedProject.customer_email || "N/A")}</p>
    <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Invoice</th>
          <th>Status</th>
          <th>Due Date</th>
          <th class="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${sortedRows
          .map(
            (row, index) => `<tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(row.label)}</td>
              <td>${escapeHtml(labelize(row.status))}</td>
              <td>${escapeHtml(row.due_date || "Not set")}</td>
              <td class="right">${escapeHtml(formatMoney(row.amount, row.currency || currency))}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <p class="summary">Total planned: ${escapeHtml(formatMoney(total, currency))}</p>
    <p class="muted">Use Print and choose Save as PDF to export.</p>
  </body>
</html>`;

    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!printWindow) {
      setProjectError("Popup blocked. Allow popups to export PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  return (
    <section className="admin-projects-root">
      <section className="admin-project-create">
        <header>
          <span className="admin-eyebrow">Customer Projects</span>
          <h2>Create and manage project workspaces</h2>
        </header>

        <form className="admin-project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project name"
            value={createForm.name}
            onChange={(event) =>
              setCreateForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Customer name"
            value={createForm.customer_name}
            onChange={(event) =>
              setCreateForm((current) => ({ ...current, customer_name: event.target.value }))
            }
          />
          <input
            type="email"
            placeholder="Customer email"
            value={createForm.customer_email}
            onChange={(event) =>
              setCreateForm((current) => ({ ...current, customer_email: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Service type"
            value={createForm.service_type}
            onChange={(event) =>
              setCreateForm((current) => ({ ...current, service_type: event.target.value }))
            }
          />
          <textarea
            placeholder="Project summary"
            value={createForm.summary}
            onChange={(event) =>
              setCreateForm((current) => ({ ...current, summary: event.target.value }))
            }
          />
          <button type="submit" disabled={creatingProject}>
            {creatingProject ? "Creating..." : "Create Project Workspace"}
          </button>
        </form>
      </section>

      {projectError ? <p className="admin-error">{projectError}</p> : null}

      <section className="admin-project-layout">
        <aside className="admin-list">
          <div className="admin-list-head">
            <strong>Projects</strong>
            <span>{projects.length} total</span>
          </div>

          {projectLoading ? <div className="admin-empty">Loading projects...</div> : null}

          {!projectLoading && projects.length === 0 ? (
            <div className="admin-empty">No projects yet. Create one to start the workspace.</div>
          ) : null}

          {!projectLoading &&
            projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`admin-row ${selectedProject?.id === project.id ? "active" : ""}`}
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div className="admin-row-top">
                  <strong>{project.name}</strong>
                  <span className={statusClass(project.status)}>
                    {labelize(project.status)}
                  </span>
                </div>
                <span className="admin-row-type">{labelize(project.service_type)}</span>
                <span className="admin-row-meta">
                  {project.customer_name || project.customer_email || "No customer"}
                </span>
                <span className="admin-row-date">{formatDate(project.created_at)}</span>
              </button>
            ))}
        </aside>

        <section className="admin-detail">
          {!selectedProject ? (
            <div className="admin-empty">Select a project workspace to manage updates.</div>
          ) : (
            <>
              <div className="admin-detail-head">
                <div>
                  <span className="admin-eyebrow">Project workspace</span>
                  <h2>{selectedProject.name}</h2>
                  <p>
                    Manage timeline events, customer notifications, invoices,
                    deliverables, and approval checkpoints.
                  </p>
                </div>

                <div className="admin-detail-status">
                  <label htmlFor="project-status-select">Project status</label>
                  <select
                    id="project-status-select"
                    value={selectedProject.status || "active"}
                    onChange={(event) => handleProjectStatus(event.target.value)}
                  >
                    {PROJECT_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {labelize(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-detail-grid">
                <div className="admin-detail-field">
                  <span>Customer</span>
                  <strong>{selectedProject.customer_name || "Not provided"}</strong>
                </div>
                <div className="admin-detail-field">
                  <span>Email</span>
                  <strong>{selectedProject.customer_email || "Not provided"}</strong>
                </div>
                <div className="admin-detail-field">
                  <span>Service Type</span>
                  <strong>{labelize(selectedProject.service_type)}</strong>
                </div>
              </div>

              <section className="admin-accounting-card">
                <div className="admin-accounting-head">
                  <span className="admin-panel-label">Accounting Summary</span>
                  <strong>
                    {accountingSummary.paidCount}/{accountingSummary.invoiceCount} invoices paid
                  </strong>
                </div>

                <div className="admin-accounting-grid">
                  <div className="admin-accounting-item">
                    <span>Agreed Total</span>
                    <strong>
                      {formatMoney(
                        accountingSummary.agreedTotal,
                        accountingSummary.currency
                      )}
                    </strong>
                  </div>
                  <div className="admin-accounting-item">
                    <span>Paid</span>
                    <strong>
                      {formatMoney(
                        accountingSummary.paidTotal,
                        accountingSummary.currency
                      )}
                    </strong>
                  </div>
                  <div className={`admin-accounting-item admin-accounting-${balanceState}`}>
                    <span>Remaining Balance</span>
                    <strong>
                      {formatMoney(
                        accountingSummary.remainingTotal,
                        accountingSummary.currency
                      )}
                    </strong>
                  </div>
                </div>

                {balanceState === "overpaid" ? (
                  <p className="admin-accounting-note admin-accounting-note-overpaid">
                    Overpayment detected: {formatMoney(
                      Math.abs(accountingSummary.remainingTotal),
                      accountingSummary.currency
                    )}
                  </p>
                ) : null}

                {balanceState === "settled" ? (
                  <p className="admin-accounting-note admin-accounting-note-settled">
                    Balance settled. This project has no remaining amount due.
                  </p>
                ) : null}
              </section>

              <section className="admin-enterprise-card">
                <div className="admin-enterprise-head">
                  <div>
                    <span className="admin-panel-label">Execution Command Center</span>
                    <h3>Enterprise project readiness and AI guidance</h3>
                  </div>
                  <button
                    type="button"
                    className="admin-panel-action"
                    onClick={handleCopyExecutionBrief}
                  >
                    Copy AI Brief
                  </button>
                </div>

                <div className="admin-enterprise-progress">
                  <strong>Client request checklist completion</strong>
                  <span>{checklistProgress}%</span>
                </div>
                <div className="admin-progress-track">
                  <div className="admin-progress-fill" style={{ width: `${checklistProgress}%` }} />
                </div>

                <p className="admin-enterprise-priority">
                  <strong>Start Here:</strong> {aiGuide.firstPriority}
                </p>

                <div className="admin-enterprise-grid">
                  <article className="admin-enterprise-panel">
                    <span className="admin-panel-label">Client requested checklist</span>
                    <ul className="admin-enterprise-list">
                      {clientChecklist.map((item) => (
                        <li key={item.key} className={item.done ? "is-done" : "is-pending"}>
                          <strong>{item.title}</strong>
                          <p>{item.details}</p>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="admin-enterprise-panel">
                    <span className="admin-panel-label">AI next-step guidance</span>
                    <ul className="admin-enterprise-list">
                      {aiGuide.steps.map((step) => (
                        <li key={step.phase}>
                          <strong>{step.phase}</strong>
                          <p>{step.hint}</p>
                          <em>{step.vscodeTip}</em>
                        </li>
                      ))}
                    </ul>

                    {aiGuide.serviceHints.length ? (
                      <div className="admin-enterprise-hints">
                        {aiGuide.serviceHints.map((hint) => (
                          <span key={hint}>{hint}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                </div>

                {briefCopyStatus ? <p className="admin-note">{briefCopyStatus}</p> : null}
              </section>

              {workspaceLoading ? (
                <div className="admin-empty">Loading workspace details...</div>
              ) : (
                <div className="admin-workspace-grid">
                  <article className="admin-panel">
                    <span className="admin-panel-label">Timeline Events</span>
                    <form className="admin-mini-form" onSubmit={addTimelineEvent}>
                      <select
                        value={timelineForm.event_type}
                        onChange={(event) =>
                          setTimelineForm((current) => ({
                            ...current,
                            event_type: event.target.value,
                          }))
                        }
                      >
                        <option value="update">Update</option>
                        <option value="milestone">Milestone</option>
                        <option value="meeting">Meeting</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Event title"
                        value={timelineForm.title}
                        onChange={(event) =>
                          setTimelineForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <textarea
                        placeholder="Details"
                        value={timelineForm.details}
                        onChange={(event) =>
                          setTimelineForm((current) => ({ ...current, details: event.target.value }))
                        }
                      />
                      <button type="submit">Add Event</button>
                    </form>

                    <div className="admin-mini-list">
                      {timelineRows.map((item) => (
                        <div key={item.id} className="admin-mini-item">
                          <strong>{item.title}</strong>
                          <span>{labelize(item.event_type)}</span>
                          <p>{item.details || "No details"}</p>
                          <em>{formatDate(item.event_at)}</em>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-panel">
                    <span className="admin-panel-label">Customer Notifications</span>
                    <form className="admin-mini-form" onSubmit={addNotification}>
                      <select
                        value={notificationForm.channel}
                        onChange={(event) =>
                          setNotificationForm((current) => ({
                            ...current,
                            channel: event.target.value,
                          }))
                        }
                      >
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="portal">Portal</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Recipient"
                        value={notificationForm.recipient}
                        onChange={(event) =>
                          setNotificationForm((current) => ({
                            ...current,
                            recipient: event.target.value,
                          }))
                        }
                      />
                      <textarea
                        placeholder="Message"
                        value={notificationForm.message}
                        onChange={(event) =>
                          setNotificationForm((current) => ({
                            ...current,
                            message: event.target.value,
                          }))
                        }
                      />
                      <button type="submit">Queue Notification</button>
                    </form>

                    <div className="admin-mini-list">
                      {notificationRows.map((item) => (
                        <div key={item.id} className="admin-mini-item">
                          <strong>{labelize(item.channel)}</strong>
                          <span>{labelize(item.status)}</span>
                          <p>{item.message}</p>
                          <em>{item.recipient || "No recipient"}</em>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-panel">
                    <div className="admin-panel-headline">
                      <span className="admin-panel-label">Invoices</span>
                      <button
                        type="button"
                        className="admin-panel-action"
                        onClick={handleExportProjectInvoicesPdf}
                        disabled={!invoiceRows.length}
                      >
                        Export PDF
                      </button>
                    </div>
                    <form className="admin-mini-form" onSubmit={addInvoice}>
                      <input
                        type="text"
                        placeholder="Invoice label"
                        value={invoiceForm.label}
                        onChange={(event) =>
                          setInvoiceForm((current) => ({ ...current, label: event.target.value }))
                        }
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={invoiceForm.amount}
                        onChange={(event) =>
                          setInvoiceForm((current) => ({ ...current, amount: event.target.value }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Currency"
                        value={invoiceForm.currency}
                        onChange={(event) =>
                          setInvoiceForm((current) => ({ ...current, currency: event.target.value }))
                        }
                      />
                      <input
                        type="date"
                        value={invoiceForm.due_date}
                        onChange={(event) =>
                          setInvoiceForm((current) => ({ ...current, due_date: event.target.value }))
                        }
                      />
                      <button type="submit">Add Invoice</button>
                    </form>

                    <div className="admin-mini-list">
                      {invoiceRows.map((item) => (
                        <div key={item.id} className="admin-mini-item">
                          <strong>{item.label}</strong>
                          <p>
                            {item.currency} {Number(item.amount || 0).toFixed(2)}
                          </p>
                          <em>Due: {item.due_date || "Not set"}</em>
                          <select
                            value={item.status}
                            onChange={(event) => updateInvoiceStatus(item.id, event.target.value)}
                          >
                            {INVOICE_STATUS.map((status) => (
                              <option key={status} value={status}>
                                {labelize(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-panel">
                    <span className="admin-panel-label">Deliverables</span>
                    <form className="admin-mini-form" onSubmit={addDeliverable}>
                      <input
                        type="text"
                        placeholder="Deliverable title"
                        value={deliverableForm.title}
                        onChange={(event) =>
                          setDeliverableForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <textarea
                        placeholder="Description"
                        value={deliverableForm.description}
                        onChange={(event) =>
                          setDeliverableForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        value={deliverableForm.due_date}
                        onChange={(event) =>
                          setDeliverableForm((current) => ({ ...current, due_date: event.target.value }))
                        }
                      />
                      <button type="submit">Add Deliverable</button>
                    </form>

                    <div className="admin-mini-list">
                      {deliverableRows.map((item) => (
                        <div key={item.id} className="admin-mini-item">
                          <strong>{item.title}</strong>
                          <p>{item.description || "No description"}</p>
                          <em>Due: {item.due_date || "Not set"}</em>
                          <select
                            value={item.status}
                            onChange={(event) =>
                              updateDeliverableStatus(item.id, event.target.value)
                            }
                          >
                            {DELIVERABLE_STATUS.map((status) => (
                              <option key={status} value={status}>
                                {labelize(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="admin-panel">
                    <span className="admin-panel-label">Approval Checkpoints</span>
                    <form className="admin-mini-form" onSubmit={addCheckpoint}>
                      <input
                        type="text"
                        placeholder="Checkpoint"
                        value={checkpointForm.checkpoint}
                        onChange={(event) =>
                          setCheckpointForm((current) => ({
                            ...current,
                            checkpoint: event.target.value,
                          }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="Owner"
                        value={checkpointForm.owner}
                        onChange={(event) =>
                          setCheckpointForm((current) => ({ ...current, owner: event.target.value }))
                        }
                      />
                      <textarea
                        placeholder="Notes"
                        value={checkpointForm.notes}
                        onChange={(event) =>
                          setCheckpointForm((current) => ({ ...current, notes: event.target.value }))
                        }
                      />
                      <button type="submit">Add Checkpoint</button>
                    </form>

                    <div className="admin-mini-list">
                      {checkpointRows.map((item) => (
                        <div key={item.id} className="admin-mini-item">
                          <strong>{item.checkpoint}</strong>
                          <p>{item.notes || "No notes"}</p>
                          <em>{item.owner || "No owner assigned"}</em>
                          <select
                            value={item.status}
                            onChange={(event) =>
                              updateCheckpointStatus(item.id, event.target.value)
                            }
                          >
                            {CHECKPOINT_STATUS.map((status) => (
                              <option key={status} value={status}>
                                {labelize(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </section>
  );
}
