
const BACKEND_URL = "https://firecom-app-backend.onrender.com";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const statusBox = document.getElementById("status");

chooseBtn.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.classList.add("hover"); });
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("hover"));

dropzone.addEventListener("drop", e => {
  e.preventDefault();
  dropzone.classList.remove("hover");
  handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

function handleFile(file) {
  if (!file) return;

  if (!file.name.endsWith(".zip")) {
    status("❌ Only ZIP files are allowed");
    return;
  }

  status(`📦 "${file.name}" selected`);

  const formData = new FormData();
  formData.append("file", file);

  // Append saved project settings
  const project = JSON.parse(localStorage.getItem("firecom_project") || "{}");
  if (project.appName) formData.append("appName", project.appName);
  if (project.packageName) formData.append("packageName", project.packageName);
  if (project.version) formData.append("version", project.version);
  if (project.targetUrl) formData.append("targetUrl", project.targetUrl);
  if (project.icon) formData.append("icon", dataURLtoBlob(project.icon), "icon.png");

  fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData })
    .then(res => res.text())
    .then(msg => status(msg, true))
    .catch(err => status("❌ " + err));
}

function status(msg, success = false) {
  statusBox.style.color = success ? "#b6ffb6" : "#ffd6d6";
  statusBox.innerText = msg;
}

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], {type:mime});
}

/*************************************************
 * SOCKET.IO
 *************************************************/
try {
  const socket = io(BACKEND_URL);

  socket.on("apk_ready", data => {
    alert("✅ APK is ready!");
    window.location.href = data.url;
  });
} catch (e) {
  console.warn("Socket.IO backend not connected");
}
