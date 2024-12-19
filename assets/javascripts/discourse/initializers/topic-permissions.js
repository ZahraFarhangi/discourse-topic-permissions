import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  console.log("Topic Permissions Plugin Initialized");

  api.modifyClass("controller:composer", {
    pluginId: "topic-permissions",
    actions: {
      openPermissionsModal() {
        this.send("openModal", "topic-permissions-modal");
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return [
      {
        id: "set-permissions",
        icon: "user-lock",
        label: "Set Access Permissions",
        action: () => {
          api.showModal("topic-permissions-modal");
        },
      },
    ];
  });
});
