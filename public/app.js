const aliases = {
  underwriting: ["underwriting", "underwriter", "quote", "submission", "risk"],
  claims: ["claim", "claims", "fnol", "loss", "adjuster"],
  distribution: ["distribution", "broker", "agent portal", "producer", "partner"],
  sales: ["sales", "lead", "pipeline", "proposal", "customer"],
  actuarial: ["actuarial", "pricing", "loss trend", "portfolio", "model"],
  "policy-servicing": ["policy", "servicing", "service", "endorsement", "renewal", "billing"],
  compliance: ["compliance", "regulatory", "audit", "control", "risk policy"],
  operations: ["operations", "ops", "queue", "handoff", "service level"]
};

const state = {
  systems: [],
  activeSystem: null
};

const chatLog = document.querySelector("#chatLog");
const commandForm = document.querySelector("#commandForm");
const commandInput = document.querySelector("#commandInput");
const systemDock = document.querySelector("#systemDock");
const activeSystemName = document.querySelector("#activeSystemName");
const endpointLink = document.querySelector("#endpointLink");
const systemFrame = document.querySelector("#systemFrame");
const stage = document.querySelector("#stage");

initialize();

async function initialize() {
  try {
    const response = await fetch("/config");
    const config = await response.json();
    state.systems = config.systems;
    renderSystemDock();
    activateSystem("underwriting", { silent: true });
  } catch (error) {
    addMessage("assistant", "I could not load system endpoints. Check the server and .env configuration.");
  }
}

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const command = commandInput.value.trim();

  if (!command) {
    return;
  }

  addMessage("user", command);
  commandInput.value = "";

  const match = findSystem(command);

  if (!match) {
    addMessage("assistant", "I could not match that to a system. Try underwriting, claims, distribution, sales, actuarial, policy servicing, compliance, or operations.");
    return;
  }

  activateSystem(match.id);
});

function renderSystemDock() {
  systemDock.innerHTML = "";

  state.systems.forEach((system) => {
    const button = document.createElement("button");
    button.className = "system-button";
    button.type = "button";
    button.dataset.systemId = system.id;
    button.style.setProperty("--system-color", system.accent);
    button.innerHTML = `<span>${system.name}</span>`;
    button.addEventListener("click", () => {
      addMessage("user", `Take me to ${system.name}`);
      activateSystem(system.id);
    });
    systemDock.appendChild(button);
  });
}

function activateSystem(systemId, options = {}) {
  const system = state.systems.find((item) => item.id === systemId);

  if (!system) {
    return;
  }

  state.activeSystem = system;
  document.documentElement.style.setProperty("--accent", system.accent);
  document.documentElement.style.setProperty("--accent-soft", mixSystemColor(system.accent));
  activeSystemName.textContent = system.name;
  endpointLink.href = system.endpoint;
  endpointLink.textContent = endpointLabel(system.endpoint);

  systemDock.querySelectorAll(".system-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.systemId === system.id);
  });

  stage.classList.remove("is-moving");
  window.requestAnimationFrame(() => {
    stage.classList.add("is-moving");
    window.setTimeout(() => {
      systemFrame.src = system.endpoint;
    }, 190);
    window.setTimeout(() => {
      stage.classList.remove("is-moving");
    }, 720);
  });

  if (!options.silent) {
    addMessage("assistant", `Opening ${system.name}.`, true);
  }
}

function findSystem(command) {
  const normalizedCommand = normalize(command);

  return state.systems.find((system) => {
    const terms = aliases[system.id] || [system.name];
    return terms.some((term) => normalizedCommand.includes(normalize(term)));
  });
}

function addMessage(role, text, isSystem = false) {
  const message = document.createElement("article");
  message.className = `message ${role}${isSystem ? " is-system" : ""}`;
  message.innerHTML = `<span>${role === "user" ? "You" : "Assistant"}</span><p>${escapeHtml(text)}</p>`;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function endpointLabel(endpoint) {
  if (endpoint.startsWith("/")) {
    return "Local endpoint";
  }

  try {
    return new URL(endpoint).host;
  } catch {
    return "Open endpoint";
  }
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function mixSystemColor(hex) {
  const color = hex.replace("#", "");
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);

  return `rgb(${Math.round(red * 0.12 + 255 * 0.88)}, ${Math.round(green * 0.12 + 255 * 0.88)}, ${Math.round(blue * 0.12 + 255 * 0.88)})`;
}
