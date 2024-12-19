import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n"; // Adding I18n for translations

export default apiInitializer("0.11.1", (api) => {
  console.log("Topic Permissions Plugin Initialized");

  // Ensure the correct API version is available
  if (!api) {
    console.error("Discourse API not available");
    return;
  }

  // Add an action to open the permissions modal
  api.modifyClass("controller:composer", {
    pluginId: "topic-permissions",
    actions: {
      openPermissionsModal() {
        this.send("openModal", "topic-permissions-modal");
      },
    },
  });

  // Add a button to the toolbar
  api.addToolbarPopupMenuOptionsCallback(() => {
    return [
      {
        id: "set-permissions",
        icon: "user-lock",
        label: I18n.t("js.topic_permissions.set_access"), // Using translation for the label
        action: () => {
          api.showModal("topic-permissions-modal");
        },
      },
    ];
  });

  // Check if the plugin is enabled in the site settings
  const siteSettings = api.container.lookup("service:site-settings");
  if (!siteSettings.topic_permissions_enabled) {
    console.warn("Topic Permissions Plugin is disabled in site settings.");
    return;
  }
});
