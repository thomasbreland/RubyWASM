async function registerServiceWorker() {
  const oldRegistrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of oldRegistrations) {
    if (registration.installing.state === "installing") {
      return;
    }
  }

  // allow base URL to be set by environment, e.g., during pipeline, for deploying to GitHub Pages subdirectory
  const BASE_URL = import.meta.env.BASE_URL;

  const workerUrl =
    import.meta.env.MODE === "production"
      ? BASE_URL + "rails.sw.js"
      : BASE_URL + "dev-sw.js?dev-sw";

  await navigator.serviceWorker.register(workerUrl, {
    scope: BASE_URL,
    type: "module",
  });
}

async function boot({ bootMessage, bootProgress, bootConsoleOutput }) {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Worker is not supported in this browser.");
    return;
  }

  if (!navigator.serviceWorker.controller) {
    await registerServiceWorker();

    bootMessage.textContent = "Waiting for Service Worker to activate...";
  } else {
    console.log("Service Worker already active.");
  }

  navigator.serviceWorker.addEventListener("message", function (event) {
    switch (event.data.type) {
      case "progress": {
        bootMessage.textContent = event.data.step;
        bootProgress.value = event.data.value;
        break;
      }
      case "console": {
        bootConsoleOutput.textContent += event.data.message + "\n";
        break;
      }
      default: {
        console.log("Unknown message type:", event.data.type);
      }
    }
  });

  return await navigator.serviceWorker.ready;
}

async function init() {
  const bootMessage = document.getElementById("boot-message");
  const bootProgress = document.getElementById("boot-progress");
  const bootConsoleOutput = document.getElementById("boot-console-output");
  const registration = await boot({
    bootMessage,
    bootProgress,
    bootConsoleOutput,
  });
  if (!registration) {
    return;
  }
  bootMessage.textContent = "Service Worker Ready";
  bootProgress.value = 100;

  const launchButton = document.getElementById("launch-button");
  launchButton.disabled = false;
  launchButton.addEventListener("click", async function () {
    // Open in a new window
    window.open("/", "_blank");
  });

  const rebootButton = document.getElementById("reboot-button");
  rebootButton.disabled = false;
  rebootButton.addEventListener("click", async function () {
    await registration.unregister();
    window.location.reload();
  });

  const reloadButton = document.getElementById("reload-button");
  reloadButton.disabled = false;
  reloadButton.addEventListener("click", async function () {
    registration.active.postMessage({ type: "reload-rails" });
  });

  const reloadDebugButton = document.getElementById("reload-debug-button");
  reloadDebugButton.disabled = false;
  reloadDebugButton.addEventListener("click", async function () {
    registration.active.postMessage({ type: "reload-rails", debug: true });
  });
}

init();
