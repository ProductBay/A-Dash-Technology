import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/client-portal.css";

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-JM", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value, currency = "JMD") {
  if (value == null) return "Scope in progress";

  return new Intl.NumberFormat("en-JM", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getStatusLabel(status) {
  return status
    .replaceAll("_", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function groupByProject(items) {
  return items.reduce((acc, item) => {
    const key = item.project_id;
    acc[key] = [...(acc[key] || []), item];
    return acc;
  }, {});
}

function AuthPanel({
  mode,
  setMode,
  authLoading,
  authError,
  authMessage,
  onLogin,
  onSignup,
}) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    company: "",
    email: "",
    password: "",
  });

  return (
    <main className="client-shell">
      <div className="client-bg client-bg-left" />
      <div className="client-bg client-bg-right" />

      <section className="client-auth-layout">
        <div className="client-auth-copy">
          <span className="client-eyebrow">A&apos;Dash Client Workspace</span>
          <h1>Track project momentum, scope signals, and delivery progress in one place.</h1>
          <p>
            This workspace is designed for high-trust client delivery. Customers can review request intake,
            active project status, milestones, and recent progress without chasing updates over email.
          </p>

          <div className="client-value-grid">
            <div className="client-value-card">
              <strong>Progress visibility</strong>
              <span>See live project stage, completion progress, and next actions.</span>
            </div>
            <div className="client-value-card">
              <strong>Enterprise feel</strong>
              <span>Structured updates and a polished client-facing experience that matches premium delivery.</span>
            </div>
            <div className="client-value-card">
              <strong>Request continuity</strong>
              <span>New requests can connect directly to the same customer workspace account.</span>
            </div>
          </div>
        </div>

        <div className="client-auth-card">
          <div className="client-auth-toggle">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Create Account
            </button>
          </div>

          {mode === "login" ? (
            <form
              className="client-auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onLogin(loginData);
              }}
            >
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@company.com"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                />
              </label>

              <button type="submit" className="client-button client-button-primary" disabled={authLoading}>
                {authLoading ? "Signing in..." : "Access Workspace"}
              </button>
            </form>
          ) : (
            <form
              className="client-auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onSignup(signupData);
              }}
            >
              <label>
                <span>Full name</span>
                <input
                  value={signupData.fullName}
                  onChange={(event) =>
                    setSignupData((current) => ({ ...current, fullName: event.target.value }))
                  }
                  placeholder="Primary contact"
                />
              </label>

              <label>
                <span>Company</span>
                <input
                  value={signupData.company}
                  onChange={(event) =>
                    setSignupData((current) => ({ ...current, company: event.target.value }))
                  }
                  placeholder="Optional"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(event) =>
                    setSignupData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@company.com"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(event) =>
                    setSignupData((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Create a secure password"
                />
              </label>

              <button type="submit" className="client-button client-button-primary" disabled={authLoading}>
                {authLoading ? "Creating account..." : "Create Workspace Account"}
              </button>
            </form>
          )}

          {authError ? <p className="client-auth-error">{authError}</p> : null}
          {authMessage ? <p className="client-auth-message">{authMessage}</p> : null}

          <div className="client-auth-note">
            <strong>Best practice:</strong> clients should use the same email they use when requesting work so
            submissions and projects connect cleanly.
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ClientPortal() {
  usePageMeta({
    title: "Client Workspace",
    description:
      "Access your A'Dash client workspace to review requests, project progress, milestones, and delivery updates.",
    canonicalPath: "/client",
    image: "/logos/adash.png",
  });

  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      setProjects([]);
      setRequests([]);
      setMilestones([]);
      setUpdates([]);
      setSelectedProjectId(null);
      return;
    }

    let active = true;

    async function loadWorkspace() {
      setLoading(true);
      setLoadError("");

      const userEmail = session.user.email;
      setProfile(session.user.user_metadata || {});

      const [projectResult, requestResult] = await Promise.all([
        supabase.from("customer_projects").select("*").eq("customer_email", userEmail).order("updated_at", { ascending: false }),
        supabase.from("service_requests").select("*").eq("email", userEmail).order("created_at", { ascending: false }),
      ]);

      if (!active) return;

      const firstError = [projectResult.error, requestResult.error].find(Boolean);
      if (firstError) {
        setLoadError(firstError.message || "Could not load the client workspace.");
        setLoading(false);
        return;
      }

      const loadedProjects = projectResult.data || [];
      setProjects(loadedProjects);
      setRequests(requestResult.data || []);
      setSelectedProjectId((current) => current || loadedProjects[0]?.id || null);

      if (loadedProjects.length) {
        const projectIds = loadedProjects.map((p) => p.id);
        const [deliverableResult, timelineResult] = await Promise.all([
          supabase.from("project_deliverables").select("*").in("project_id", projectIds).order("due_date", { ascending: true }),
          supabase.from("project_timeline_events").select("*").in("project_id", projectIds).eq("is_customer_visible", true).order("event_at", { ascending: false }),
        ]);

        if (!active) return;

        setMilestones(deliverableResult.data || []);
        setUpdates(timelineResult.data || []);
      } else {
        setMilestones([]);
        setUpdates([]);
      }

      setLoading(false);
    }

    loadWorkspace();
    return () => {
      active = false;
    };
  }, [session]);

  const milestoneMap = useMemo(() => groupByProject(milestones), [milestones]);
  const updateMap = useMemo(() => groupByProject(updates), [updates]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0] || null;

  const workspaceStats = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status === "active");
    const averageProgress = activeProjects.length
      ? Math.round(activeProjects.reduce((sum, project) => sum + (project.progress || 0), 0) / activeProjects.length)
      : 0;
    const openRequests = requests.filter((request) => request.status !== "closed").length;

    return {
      activeProjects: activeProjects.length,
      averageProgress,
      openRequests,
      visibleUpdates: updates.length,
    };
  }, [projects, requests, updates]);

  async function handleLogin({ email, password }) {
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError(error.message || "Could not sign into the client workspace.");
    }

    setAuthLoading(false);
  }

  async function handleSignup({ fullName, company, email, password }) {
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company,
        },
      },
    });

    if (error) {
      setAuthError(error.message || "Could not create the client workspace account.");
    } else if (!data.session) {
      setAuthMessage("Account created. Check your inbox if email confirmation is enabled, then sign in.");
      setAuthMode("login");
    } else {
      setAuthMessage("");
    }

    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!authReady) {
    return (
      <main className="client-shell client-loading-shell">
        <div className="client-loading-pill">Loading client workspace</div>
      </main>
    );
  }

  if (!session) {
    return (
      <AuthPanel
        mode={authMode}
        setMode={setAuthMode}
        authLoading={authLoading}
        authError={authError}
        authMessage={authMessage}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <main className="client-shell">
      <div className="client-bg client-bg-left" />
      <div className="client-bg client-bg-right" />

      <section className="client-workspace">
        <header className="client-topbar">
          <div>
            <span className="client-eyebrow">A&apos;Dash Customer Workspace</span>
            <h1>
              Welcome back, {profile?.full_name || session.user.user_metadata?.full_name || session.user.email}
            </h1>
            <p>
              Track request intake, project progress, milestones, and recent delivery updates without waiting on a status email.
            </p>
          </div>

          <div className="client-topbar-actions">
            <Link to="/request/discovery" className="client-button client-button-secondary">
              Start New Request
            </Link>
            <button type="button" className="client-button client-button-ghost" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {loadError ? <p className="client-error">{loadError}</p> : null}

        <section className="client-stat-grid">
          <div className="client-stat-card">
            <span>Active projects</span>
            <strong>{workspaceStats.activeProjects}</strong>
          </div>
          <div className="client-stat-card">
            <span>Average progress</span>
            <strong>{workspaceStats.averageProgress}%</strong>
          </div>
          <div className="client-stat-card">
            <span>Open requests</span>
            <strong>{workspaceStats.openRequests}</strong>
          </div>
          <div className="client-stat-card">
            <span>Visible updates</span>
            <strong>{workspaceStats.visibleUpdates}</strong>
          </div>
        </section>

        <section className="client-main-grid">
          <aside className="client-project-list">
            <div className="client-panel-head">
              <div>
                <span className="client-panel-label">Projects</span>
                <h2>Tracked engagements</h2>
              </div>
              <span className="client-panel-count">{projects.length}</span>
            </div>

            {loading ? <div className="client-empty">Loading your projects...</div> : null}
            {!loading && !projects.length ? (
              <div className="client-empty">
                No active project has been assigned to this workspace yet. Your submitted requests will appear below while scoping is in progress.
              </div>
            ) : null}

            {projects.map((project) => (
              <button
                type="button"
                key={project.id}
                className={`client-project-card ${selectedProject?.id === project.id ? "active" : ""}`}
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div className="client-project-top">
                  <strong>{project.name}</strong>
                  <span className={`client-status client-status-${project.status}`}>{getStatusLabel(project.status)}</span>
                </div>
                <span className="client-project-phase">{project.service_type ? getStatusLabel(project.service_type) : "Project"}</span>
                <div className="client-progress-track">
                  <div className="client-progress-fill" style={{ width: `${project.progress || 0}%` }} />
                </div>
                <div className="client-project-meta">
                  <span>{project.progress || 0}% complete</span>
                  <span>{project.target_launch_date ? formatDate(project.target_launch_date) : "Timeline being scoped"}</span>
                </div>
              </button>
            ))}
          </aside>

          <section className="client-project-detail">
            {!selectedProject ? (
              <div className="client-detail-empty">
                <span className="client-panel-label">Workspace status</span>
                <h2>No live project assigned yet</h2>
                <p>
                  As your request moves from intake to active delivery, this space can show project health, milestones,
                  approved scope, and customer-visible delivery updates.
                </p>
              </div>
            ) : (
              <>
                <div className="client-detail-hero">
                  <div>
                    <span className="client-panel-label">Selected project</span>
                    <h2>{selectedProject.name}</h2>
                    <p>{selectedProject.summary || "Project scope is being prepared with business and technical alignment."}</p>
                  </div>

                  <div className="client-detail-meta">
                    <div>
                      <span>Status</span>
                      <strong>{getStatusLabel(selectedProject.status)}</strong>
                    </div>
                    <div>
                      <span>Current phase</span>
                      <strong>{selectedProject.current_phase || "Scoping in progress"}</strong>
                    </div>
                    <div>
                      <span>Investment</span>
                      <strong>{formatMoney(selectedProject.contract_value, selectedProject.currency)}</strong>
                    </div>
                    <div>
                      <span>Target launch</span>
                      <strong>{formatDate(selectedProject.target_launch_date)}</strong>
                    </div>
                  </div>
                </div>

                <div className="client-highlight-strip">
                  <div className="client-highlight-card">
                    <span>Progress</span>
                    <strong>{selectedProject.progress || 0}%</strong>
                    <div className="client-progress-track large">
                      <div className="client-progress-fill" style={{ width: `${selectedProject.progress || 0}%` }} />
                    </div>
                  </div>
                  <div className="client-highlight-card">
                    <span>Next action</span>
                    <strong>{selectedProject.next_action || "Awaiting next scoped milestone"}</strong>
                  </div>
                </div>

                <div className="client-detail-grid">
                  <section className="client-panel">
                    <div className="client-panel-head">
                      <div>
                        <span className="client-panel-label">Milestones</span>
                        <h3>Delivery roadmap</h3>
                      </div>
                    </div>

                    <div className="client-milestone-list">
                      {(milestoneMap[selectedProject.id] || []).length ? (
                        (milestoneMap[selectedProject.id] || []).map((milestone) => (
                          <article className="client-milestone-item" key={milestone.id}>
                            <span className={`client-milestone-state ${milestone.status}`}>
                              {getStatusLabel(milestone.status)}
                            </span>
                            <div>
                              <strong>{milestone.title}</strong>
                              <p>{milestone.description || "Milestone details will appear here as the project advances."}</p>
                            </div>
                            <span className="client-milestone-date">{formatDate(milestone.due_date || milestone.completed_at)}</span>
                          </article>
                        ))
                      ) : (
                        <div className="client-empty small">
                          Milestones have not been published to the customer workspace yet.
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="client-panel">
                    <div className="client-panel-head">
                      <div>
                        <span className="client-panel-label">Updates</span>
                        <h3>Recent activity</h3>
                      </div>
                    </div>

                    <div className="client-update-list">
                      {(updateMap[selectedProject.id] || []).length ? (
                        (updateMap[selectedProject.id] || []).map((update) => (
                          <article className="client-update-item" key={update.id}>
                            <div className="client-update-top">
                              <strong>{update.title}</strong>
                              <span>{formatDate(update.event_at || update.created_at)}</span>
                            </div>
                            <span className="client-update-kind">{getStatusLabel(update.event_type)}</span>
                            <p>{update.details}</p>
                          </article>
                        ))
                      ) : (
                        <div className="client-empty small">
                          Customer-facing updates will appear here as work progresses.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </>
            )}
          </section>
        </section>

        <section className="client-request-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-panel-label">Requests</span>
              <h2>Tracked submissions</h2>
            </div>
            <Link to="/request/discovery" className="client-inline-link">
              Start another request
            </Link>
          </div>

          <div className="client-request-grid">
            {requests.length ? (
              requests.map((request) => (
                <article className="client-request-card" key={request.id}>
                  <span className={`client-status client-status-${request.status}`}>{getStatusLabel(request.status)}</span>
                  <strong>{getStatusLabel(request.service_type)} request</strong>
                  <p>
                    Submitted {formatDate(request.created_at)} from {request.region || "your workspace"}.
                  </p>
                </article>
              ))
            ) : (
              <div className="client-empty wide">
                No customer-linked requests yet. Sign in before submitting future requests to connect them directly to this workspace.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
