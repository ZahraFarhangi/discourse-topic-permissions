import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  console.log("Topic Permissions Plugin Initialized");

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "permission-button",
      group: "extras",
      icon: "user-lock",
      title: "Set Access Permissions",
      action: () => {
        openPermissionsModal();
      },
    });
  });

  function openPermissionsModal() {
    // داده‌های نمونه کاربران و گروه‌ها (این باید از سرور گرفته شود)
    const users = ["User1", "User2", "User3"];
    const groups = ["Group1", "Group2", "Group3"];

    // ساختن HTML برای لیست کشویی
    let userOptions = users.map((u) => `<option value="${u}">${u}</option>`).join("");
    let groupOptions = groups.map((g) => `<option value="${g}">${g}</option>`).join("");

    const bodyHTML = `
      <label for="user-select">Select Users:</label>
      <select id="user-select" multiple>${userOptions}</select>
      <br>
      <label for="group-select">Select Groups:</label>
      <select id="group-select" multiple>${groupOptions}</select>
    `;

    api.showModal("custom-modal", {
      title: "Set Access Permissions",
      body: bodyHTML,
      buttons: [
        { label: "Cancel", action: () => api.closeModal() },
        {
          label: "Save",
          action: () => {
            const selectedUsers = Array.from(
              document.getElementById("user-select").selectedOptions
            ).map((option) => option.value);

            const selectedGroups = Array.from(
              document.getElementById("group-select").selectedOptions
            ).map((option) => option.value);

            console.log("Selected Users:", selectedUsers);
            console.log("Selected Groups:", selectedGroups);

            // ارسال داده‌ها به سرور
            savePermissions(selectedUsers, selectedGroups);
            api.closeModal();
          },
        },
      ],
    });
  }

  function savePermissions(users, groups) {
    api.request("/topic-permissions", {
      method: "POST",
      data: { users, groups },
    }).then((response) => {
      console.log("Permissions saved:", response);
    });
  }
});
