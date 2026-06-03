const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const publicDir = path.join(rootDir, "public");
const env = loadEnv(path.join(rootDir, ".env"));
const port = Number(env.PORT || 3000);

const systems = [
  {
    id: "underwriting",
    name: "Underwriting",
    envKey: "UNDERWRITING_SYSTEM_ENDPOINT",
    accent: "#0f766e",
    summary: "Submission triage, appetite review, quote preparation, and decision support."
  },
  {
    id: "claims",
    name: "Claims",
    envKey: "CLAIMS_SYSTEM_ENDPOINT",
    accent: "#b45309",
    summary: "FNOL intake, coverage checks, claim summaries, reserves, and adjuster support."
  },
  {
    id: "distribution",
    name: "Distribution",
    envKey: "DISTRIBUTION_SYSTEM_ENDPOINT",
    accent: "#2563eb",
    summary: "Broker enablement, submission support, partner updates, and channel insights."
  },
  {
    id: "sales",
    name: "Sales",
    envKey: "SALES_SYSTEM_ENDPOINT",
    accent: "#be123c",
    summary: "Lead qualification, product fit, proposal support, and pipeline workflows."
  },
  {
    id: "actuarial",
    name: "Actuarial",
    envKey: "ACTUARIAL_SYSTEM_ENDPOINT",
    accent: "#7c3aed",
    summary: "Pricing support, portfolio monitoring, loss trends, and model-assisted research."
  },
  {
    id: "policy-servicing",
    name: "Policy Servicing",
    envKey: "POLICY_SERVICING_SYSTEM_ENDPOINT",
    accent: "#15803d",
    summary: "Endorsements, renewals, cancellations, billing, and document retrieval."
  },
  {
    id: "compliance",
    name: "Compliance",
    envKey: "COMPLIANCE_SYSTEM_ENDPOINT",
    accent: "#525252",
    summary: "Regulatory checks, audit trails, controlled escalation, and policy validation."
  },
  {
    id: "operations",
    name: "Operations",
    envKey: "OPERATIONS_SYSTEM_ENDPOINT",
    accent: "#0891b2",
    summary: "Work queues, handoffs, service levels, exceptions, and operational oversight."
  }
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/config") {
    sendJson(res, {
      systems: systems.map((system) => ({
        id: system.id,
        name: system.name,
        endpoint: env[system.envKey] || `/systems/${system.id}`,
        accent: system.accent,
        summary: system.summary
      }))
    });
    return;
  }

  if (url.pathname.startsWith("/systems/")) {
    const id = url.pathname.replace("/systems/", "");
    const system = systems.find((item) => item.id === id);

    if (!system) {
      sendText(res, "System not found", "text/plain", 404);
      return;
    }

    sendText(res, renderSystem(system), "text/html");
    return;
  }

  const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  serveStatic(path.join(publicDir, filePath), res);
});

server.listen(port, () => {
  console.log(`Insurance Agentic Layer running at http://localhost:${port}`);
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((values, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return values;
      }

      const equalsIndex = trimmed.indexOf("=");

      if (equalsIndex === -1) {
        return values;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
      values[key] = value;
      return values;
    }, {});
}

function serveStatic(filePath, res) {
  const normalizedPath = path.normalize(filePath);

  if (!normalizedPath.startsWith(publicDir)) {
    sendText(res, "Forbidden", "text/plain", 403);
    return;
  }

  fs.readFile(normalizedPath, (error, data) => {
    if (error) {
      sendText(res, "Not found", "text/plain", 404);
      return;
    }

    const extension = path.extname(normalizedPath);
    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript"
    };

    sendBuffer(res, data, contentTypes[extension] || "application/octet-stream");
  });
}

function sendJson(res, payload) {
  sendText(res, JSON.stringify(payload), "application/json");
}

function sendBuffer(res, data, contentType, status = 200) {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(data);
}

function sendText(res, body, contentType, status = 200) {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(body);
}

function renderSystem(system) {
  const tiles = [
    ["Queue", "18"],
    ["Reviews", "7"],
    ["SLA", "96%"],
    ["Escalations", "3"]
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(system.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #172033;
      background: #f7f6f0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 22px;
      border-bottom: 1px solid #dedbd0;
      background: #fffdf8;
    }
    h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0;
    }
    main { padding: 22px; }
    .badge {
      border: 1px solid ${system.accent};
      color: ${system.accent};
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
    }
    .summary {
      max-width: 760px;
      margin: 0 0 22px;
      color: #465268;
      line-height: 1.5;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }
    .tile, .panel {
      border: 1px solid #dedbd0;
      background: #fffdf8;
      border-radius: 8px;
      padding: 16px;
    }
    .tile strong {
      display: block;
      font-size: 26px;
      color: ${system.accent};
      margin-bottom: 4px;
    }
    .tile span, .panel p {
      color: #5f6675;
      font-size: 13px;
    }
    .panel {
      display: grid;
      gap: 12px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: center;
      border-bottom: 1px solid #ece8dc;
      padding-bottom: 12px;
    }
    .row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .row b { font-size: 14px; }
    .row span { color: #697184; font-size: 13px; }
    @media (max-width: 720px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      header { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(system.name)} System</h1>
    <span class="badge">Connected endpoint</span>
  </header>
  <main>
    <p class="summary">${escapeHtml(system.summary)}</p>
    <section class="grid">
      ${tiles.map(([label, value]) => `<div class="tile"><strong>${value}</strong><span>${label}</span></div>`).join("")}
    </section>
    <section class="panel" aria-label="${escapeHtml(system.name)} work items">
      <div class="row"><b>Priority work queue</b><span>Ready</span></div>
      <div class="row"><b>Agent assistance</b><span>Available</span></div>
      <div class="row"><b>Human approval checkpoint</b><span>Enabled</span></div>
      <div class="row"><b>Audit logging</b><span>Active</span></div>
    </section>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
