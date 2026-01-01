const BACKEND_URL = "https://firecom-app-backend.onrender.com";

const iconInput = document.getElementById("iconInput");
const iconPreview = document.getElementById("iconPreview");
const chooseIconBtn = document.getElementById("chooseIconBtn"); // new button id

// Use a proper button instead of inline onclick
chooseIconBtn.addEventListener("click", () => {
  iconInput.click();
});

// Preview icon and store in localStorage
iconInput.addEventListener("change", () => {
  const file = iconInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    iconPreview.src = reader.result;
    iconPreview.style.display = "block";
    localStorage.setItem("firecom_project_icon", reader.result);
  };
  reader.readAsDataURL(file);
});

function saveProject() {
  const appName = document.getElementById("appName").value.trim();
  const packageName = document.getElementById("packageName").value.trim();
  const version = document.getElementById("version").value.trim();
  const targetUrl = document.getElementById("targetUrl").value.trim();

  if (!appName || !packageName || !version || !targetUrl) {
    alert("❌ Please fill all fields");
    return;
  }

  const projectData = {
    appName,
    packageName,
    version,
    targetUrl,
    icon: localStorage.getItem("firecom_project_icon") || null
  };

  localStorage.setItem("firecom_project", JSON.stringify(projectData));

  const formData = new FormData();
  formData.append("appName", appName);
  formData.append("packageName", packageName);
  formData.append("version", version);
  formData.append("targetUrl", targetUrl);

  if (iconInput.files.length > 0) {
    formData.append("icon", iconInput.files[0]);
  }

  fetch(`${BACKEND_URL}/upload_project`, { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Project saved! APK build started");
        // Redirect to app.html
        window.location.href = "app.html";
      } else {
        alert("❌ Error: " + data.message);
      }
    })
    .catch(err => alert("❌ Network error: " + err));
}
