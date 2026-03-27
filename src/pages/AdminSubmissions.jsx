import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
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

  useEffect(() => {
    if (!filteredRows.length) {
      setSelectedId(null);
      return;
    }

    if (!filteredRows.some((row) => row.id === selectedId)) {
      setSelectedId(filteredRows[0].id);
    }
  }, [filteredRows, selectedId]);

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
            <h1>Service request submissions</h1>
            <p>
              Review incoming leads, filter by request type, and move each item
              through your pipeline.
            </p>
          </div>

          <div className="admin-topbar-actions">
            <button type="button" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button type="button" className="admin-ghost" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

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
      </section>
    </main>
  );
}
