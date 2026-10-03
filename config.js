(function () {
  "use strict";

  function isDisplayValue(value) {
    return (typeof value === "string" && value.trim() !== "") ||
      (typeof value === "number" && Number.isFinite(value));
  }

  fetch("data/config.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Configuration request failed with status " + response.status);
      }
      return response.json();
    })
    .then(function (config) {
      if (!config || typeof config !== "object" || Array.isArray(config)) {
        throw new TypeError("Configuration must be a JSON object");
      }

      document.querySelectorAll("[data-config-href]").forEach(function (element) {
        var value = config[element.dataset.configHref];
        try {
          var url = new URL(value);
          if (url.protocol !== "https:" || url.hostname !== "planbangling.net" ||
              !["/documents/rules.pdf", "/documents/privacy.pdf"].includes(url.pathname)) {
            return;
          }
          element.href = url.href;
          element.hidden = false;
        } catch (_) {
          // Keep unavailable or invalid document links hidden.
        }
      });

      document.querySelectorAll("[data-config-key]").forEach(function (element) {
        var key = element.dataset.configKey;
        var value = config[key];

        if (isDisplayValue(value)) {
          element.textContent = String(value);
        }
      });
    })
    .catch(function (error) {
      console.warn("Plan B website configuration could not be loaded; fallback content remains visible.", error);
    });
})();
