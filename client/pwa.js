(() => {
  let deferredInstallPrompt = null;

  function getInstallButton() {
    return document.getElementById("anishmartInstallBtn");
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;

    const button = getInstallButton();
    if (button) {
      button.style.display = "block";
    }
  });

  window.installAnishMart = async function () {
    if (!deferredInstallPrompt) {
      alert("Install option is not ready yet. Open this page in Chrome or Edge using http://localhost:5000 and try again.");
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;

    const button = getInstallButton();
    if (button) {
      button.style.display = "none";
    }
  };

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    const button = getInstallButton();
    if (button) {
      button.style.display = "none";
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch(error => console.error("AnishMart service worker error:", error));
    });
  }
})();
