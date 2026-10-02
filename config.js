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
