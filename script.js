class Toast {
  constructor() {
    this.container = null;
    this.createContainer();
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = "toast-container";
    document.body.appendChild(this.container);
  }

  show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = ` 
            <div class="toast-content">
            ${
              type === "success"
                ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`
                : ""
            }
                <span ${
                  type === "success" ? `style="margin-left:4px;` : `style=""`
                } class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
       `;

    this.container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  // Shortcut methods
  success(message, duration = 3000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "success", duration);
  }

  error(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "error", duration);
  }

  info(message, duration = 3000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "info", duration);
  }

  warning(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "warning", duration);
  }
  success(message, duration = 3000) {
    // Check if message contains countdown pattern
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "success", duration);
  }

  // Do the same for other types if you want
  error(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "error", duration);
    }
    return this.show(message, "error", duration);
  }

  // PRIVATE METHOD: Handle countdown replacement
  _showWithCountdown(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} countdown-toast`;
    let time = duration / 1000;
    let count = time; // Default 5-second countdown

    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message.replace(
                  "{countdown}",
                  count
                )}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    this.container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    const messageElement = toast.querySelector(".toast-message");
    let currentCount = count;

    const countdownInterval = setInterval(() => {
      currentCount--;

      if (currentCount > 0) {
        // Update just the countdown number in the message
        messageElement.innerHTML = message.replace("{countdown}", currentCount);
      } else {
        clearInterval(countdownInterval);
        if (message.includes("in {countdown}")) {
          messageElement.innerHTML = message.replace("in {countdown}", "now");
        } else {
          messageElement.innerHTML = message.replace("{countdown}", "0");
        }
        // Remove toast
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
        }, 1000);
      }
    }, 1000);

    return toast;
  }
}

const toast = new Toast();
// Get all sections
const sections = {
  generate: document.getElementById("generateSection"),
  camera: document.getElementById("cameraSection"),
  image: document.getElementById("imageSection"),
};

// Get nav items
const navItems = document.querySelectorAll(".nav-item");

// Function to switch

function showSection(sectionName) {
  const currentActive = document.querySelector(
    '.section[style*="display: flex"]'
  );
  const targetSection = sections[sectionName];

  // Determine slide direction based on section order
  const sectionOrder = ["generate", "camera", "image"];
  const currentIndex = currentActive
    ? sectionOrder.indexOf(
        Object.keys(sections).find((key) => sections[key] === currentActive)
      )
    : 0;
  const targetIndex = sectionOrder.indexOf(sectionName);

  // Animate out current section
  if (currentActive) {
    currentActive.classList.add(
      targetIndex > currentIndex ? "slide-out-left" : "slide-out-right"
    );
    setTimeout(() => {
      currentActive.style.display = "none";
      currentActive.classList.remove("slide-out-left", "slide-out-right");
    }, 400);
  }

  // Animate in target section
  setTimeout(
    () => {
      if (targetSection) {
        targetSection.style.display = "flex";
        // Force reflow
        targetSection.offsetHeight;
        targetSection.classList.add("slide-in");

        // Remove animation class after it completes
        setTimeout(() => {
          targetSection.classList.remove("slide-in");
        }, 600);
      }
    },
    currentActive ? 100 : 0
  );

  // Update active nav (your existing code)
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.index === sectionName) {
      item.classList.add("active");
      // Add a subtle pulse to the active icon
      item.style.animation = "iconPulse 0.3s ease";
      setTimeout(() => (item.style.animation = ""), 300);
    }
  });

  history.pushState(null, "", "#" + sectionName);
  trackQRX("section_change", {
    category: "navigation",
    label: sectionName,
  });

  // Track screen view
  trackQRX("screen_view", {
    category: "app",
    label: sectionName,
    non_interaction: true,
  });
}

// Add the pulse animation
const style = document.createElement("style");
style.textContent = `
    @keyframes iconPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
function checkState() {
  const hash = window.location.hash;
  if (hash.includes("#image")) {
    // toast.success("hey bitch")
    showSection("image");
  } else if (hash.includes("#camera")) {
    showSection("camera");
  } else {
    showSection("generate");
  }
}
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

document.addEventListener("DOMContentLoaded", () => {
  checkState();
  setTimeout(() => {
    toast.success(`${getTimeBasedGreeting()} Welcome to QRX`);
  }, 1000);
});
document.addEventListener("copy", (e) => {
  toast.success("Copied to clipboard!");
});

document.addEventListener("paste", (e) => {
  toast.success("Pasted text!");
});
// Nav click handlers
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const target = item.dataset.index; // e.g. "generate", "camera", "image"
    showSection(target);
  });
});

const qr = new QRCodeStyling({
  width: 320,
  height: 320,
  data: "https://github.com/desmond845",
  dotsOptions: { color: "#00f0ff", type: "extra-rounded" },
  cornersSquareOptions: { color: "#00f0ff", type: "extra-rounded" },
  backgroundOptions: { color: "#0a0a0f" },
  imageOptions: { crossOrigin: "anonymous", margin: 15 },
  qrOptions: {
    errorCorrectionLevel: "H",
  },
});
// Track QR generation with smart debounce
// Real-time update as user types

let qrGenerationCount = 0;
let lastGeneratedText = "";
let typingTimeout;

document.getElementById("input").addEventListener("input", (e) => {
  const text = e.target.value.trim() || "QRX";

  // Update QR immediately (for user)
  qr.update({ data: text });
  document.getElementById("qr").innerHTML = "";
  qr.append(document.getElementById("qr"));

  // Clear any previous timeout
  if (typingTimeout) clearTimeout(typingTimeout);

  // Only track if user stops typing for 1 second AND text actually changed
  typingTimeout = setTimeout(() => {
    if (text !== lastGeneratedText && text.length > 0) {
      qrGenerationCount++;
      lastGeneratedText = text;

      // Track this generation
      if (window.trackQRX) {
        trackQRX("qr_generated", {
          category: "generator",
          label: "real_time_input",
          value: qrGenerationCount,
          text_length: text.length,
          is_url: text.includes("http") ? "yes" : "no",
        });
      }

      // console.log(`📊 QR Generated #${qrGenerationCount}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    }
  }, 1000); // Wait 1 second after typing stops
});

// Track QR downloads
let downloadCount = 0;

// Download as PNG
async function download() {
  const id = Math.random().toString(36).slice(2, 6);

  // Track BEFORE downloading
  downloadCount++;

  if (window.trackQRX) {
    trackQRX("qr_downloaded", {
      category: "generator",
      label: "png_download",
      value: downloadCount,
      current_qr_text:
        document.getElementById("input").value.trim().substring(0, 50) || "QRX",
    });
  }

  // Then download
  await qr.download({
    name: `qr-ghost-${new Date().toISOString().split("T")[0]}-${id}`,
    extension: "png",
  });

  await toast.success(`QR Download`);
}
// Copy to clipboard
function copy() {
  qr.getRawData("png").then((blob) => {
    navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    alert("Copied to clipboard!");
  });
}
document.getElementById("logo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => qr.update({ image: ev.target.result });
    reader.readAsDataURL(file);
    toast.success("Added Image");

    // Track logo upload
    if (window.trackQRX) {
      trackQRX("logo_uploaded", {
        category: "customization",
        label: "image_upload",
        value: 1,
        file_size: file.size,
        file_type: file.type,
      });
    }
  }
});
// Remove logo button
document.getElementById("removeLogo").addEventListener("click", () => {
  qr.update({ image: "" }); // removes logo
  document.getElementById("logo").value = ""; // clears file input
  toast.success("Logo removed");

  // Track logo removal
  if (window.trackQRX) {
    trackQRX("logo_removed", {
      category: "customization",
      label: "remove_logo",
      value: 1,
    });
  }
});
// First render
qr.append(document.getElementById("qr"));

QrScanner.WORKER_PATH = "qr/qr-scanner-worker.min.js";

const video = document.getElementById("video");
const outputCam = document.getElementById("outputCam");

const scanner = new QrScanner(
  video,
  (result) => {
    outputCam.textContent = "Decoded: " + result.data;
    outputCam.classList.add("success");
    outputCam.classList.remove("trying");
    outputCam.classList.remove("failed");
    openModal(result.data);
    toast.success("QR Decoded From Camera Stream");
    vibrate();
    sound();

    // TRACK THIS SCAN
    if (window.trackQRX) {
      window.trackQRX("scan_success", {
        category: "cam-scanner",
        label: "camera",
        value: result.data.length,
      });
    }

    scanner.stop();
  },
  {
    highlightScanRegion: true,
    highlightCodeOutline: true,
    maxScansPerSecond: 60,
    returnDetailedScanResult: true,
    // FIXED: Scan region that works for both front/back cameras
    scanRegion: {
      x: 0.15, // Slightly larger area
      y: 0.15,
      width: 0.7,
      height: 0.7,
    },
  }
);
const canvasCam = document.getElementById("canvasCam");
const ctxCam = canvasCam.getContext("2d");
let shouldFlip = false;
let camStream = null;
// --- SMART CAMERA HANDLER ---
navigator.mediaDevices
  .getUserMedia({
    video: {
      // Request the rear camera, but be ready for fallback
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  })
  .then((stream) => {
    video.srcObject = stream;
    video.play();

    // CHECK THE GRANTED CAMERA TYPE
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    const actualFacingMode = settings.facingMode || "unknown";

    // If the browser granted the 'user' (front) camera, we assume it's mirrored
    // and set the flag to flip the canvas drawing.
    if (actualFacingMode === "user") {
      shouldFlip = true;
    } else if (actualFacingMode === "environment") {
      shouldFlip = false;
    } else {
      // Otherwise (environment/rear), assume it's not mirrored.
      shouldFlip = true;
    }

    video.onloadedmetadata = () => {
      canvasCam.width = video.videoWidth;
      canvasCam.height = video.videoHeight;

      // Set the container's aspect ratio to prevent jumpiness
      const aspectRatio = video.videoHeight / video.videoWidth;
      document.querySelector(".video-container").style.paddingTop = `${
        aspectRatio * 100
      }%`;
      scanner.start();

      requestAnimationFrame(scan);
    };
  })
  .catch((err) => {
    // outputCam.innerHTML = "Camera access denied or blocked\nPlease refresh";
    console.error("Camera Error:", err);
    outputCam.classList.remove("success");
    outputCam.classList.remove("trying");
    outputCam.classList.add("failed");
    showCameraError(err);
  });

let camFrame = 0;

// --- 2. The Visual Effect Loop with Conditional Flip ---
function scan() {
  if (camFrame === 0 && window.trackQRX) {
    window.trackQRX("scan_attempt", {
      category: "cam-scanner",
      label: "camera",
      value: 1,
    });
  }
  if (video.videoWidth > 0) {
    const w = video.videoWidth;
    const h = video.videoHeight;
    // 1. Reset and apply conditional flip transformation
    ctxCam.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    if (shouldFlip) {
      // Flip horizontally: Shift by width, then scale by -1
      ctxCam.translate(w, 0);
      ctxCam.scale(-1, 1);
    }

    // --- A. Draw Blurred Background (Applies to the entire canvas, which is now potentially flipped) ---
    ctxCam.save();
    ctxCam.filter = "blur(15px) brightness(0.5) contrast(1)";
    ctxCam.drawImage(video, 0, 0, w, h);
    ctxCam.restore();

    // --- B. Calculate Clear Center Region ---
    const minDim = Math.min(w, h);
    const clearSize = minDim * 0.7;
    const clearBoxX = (w - clearSize) / 2;
    const clearBoxY = (h - clearSize) / 2;

    // --- C. Draw Clear Foreground (This draw is also affected by the flip) ---

    // --- D. Draw Guide Border ---

    let camTime = camFrame * 0.04;

    const waveY = clearBoxY + clearSize * (0.5 + Math.sin(camTime * 1.5) * 0.5);
    const trail = 60;

    ctxCam.drawImage(
      video,
      clearBoxX,
      clearBoxY,
      clearSize,
      clearSize, // Source (unaffected by flip)
      clearBoxX,
      clearBoxY,
      clearSize,
      clearSize // Destination (affected by flip)
    );

    const gradient = ctxCam.createLinearGradient(
      0,
      waveY - trail,
      0,
      waveY + trail
    );
    gradient.addColorStop(0, "rgba(0, 255, 200, 0)");
    gradient.addColorStop(0.5, "rgba(0, 255, 200, 0.9)");
    gradient.addColorStop(1, "rgba(0, 255, 200, 0)");
    ctxCam.strokeStyle = gradient;
    ctxCam.lineWidth = 4;
    ctxCam.shadowBlur = 30;
    ctxCam.shadowColor = "#00ffcc";
    ctxCam.beginPath();
    ctxCam.moveTo(clearBoxX, waveY);
    ctxCam.lineTo(clearBoxX + clearSize, waveY);
    ctxCam.stroke();
    ctxCam.shadowBlur = 0;

    // 4. Rising particles
    ctxCam.fillStyle = "#00ffcc";
    for (let i = 0; i < 9; i++) {
      const phase = (camFrame * 0.05 + i * 0.8) % (Math.PI * 2);
      const py = waveY + Math.sin(phase) * 40 - 40;
      if (py < waveY + 20) {
        ctxCam.globalAlpha = 1 - (waveY - py) / 60;
        ctxCam.fillRect(clearBoxX + ((i + 1) * clearSize) / 9, py, 2, 10);
      }
    }
    ctxCam.globalAlpha = 1;

    // 5. Your perfect pulsing border
    const pulse = (Math.sin(camFrame * 0.05) + 1) / 2;
    ctxCam.strokeStyle = `rgba(0, 240, 255, ${0.5 + pulse * 0.5})`;

    ctxCam.lineWidth = 4 + pulse * 2;
    ctxCam.shadowBlur = 20;
    ctxCam.shadowColor = "#00f0ff";
    ctxCam.strokeRect(clearBoxX, clearBoxY, clearSize, clearSize);
    ctxCam.shadowBlur = 0;

    camFrame++;
  }
  // IMPORTANT: Reset transformation for the next frame
  ctxCam.setTransform(1, 0, 0, 1, 0, 0);

  requestAnimationFrame(scan);
}

// --- SHOW USER-FRIENDLY ERROR ---
function showCameraError(error) {
  let errorMessage = "";

  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    errorMessage = "No camera found<br>Try on a phone or device with camera";
  } else if (
    error.name === "NotAllowedError" ||
    error.name === "PermissionDeniedError"
  ) {
    errorMessage =
      "Camera access denied<br>Please allow camera permission and refresh";
  } else if (
    error.name === "NotReadableError" ||
    err.name === "TrackStartError"
  ) {
    errorMessage = "Camera in use<br>Close other apps using camera";
  } else if (error.name === "OverconstrainedError") {
    errorMessage = "Camera not supported<br>Try different camera settings";
  } else {
    errorMessage = "Camera error<br>Please refresh the page";
  }

  outputCam.innerHTML = errorMessage;
  outputCam.classList.remove("trying");
  outputCam.classList.add("failed");

  // Show retry button
  const retryBtn = document.querySelector('button[onclick="retryCamScan()"]');
  if (retryBtn) {
    retryBtn.textContent = "Retry Camera";
    retryBtn.style.background = "#ff3366";
  }
  const helpDiv = document.getElementById("cameraHelp");
  if (helpDiv) {
    helpDiv.style.display = "block";
  }
}

// --- SETUP CAMERA AFTER GETTING STREAM ---

// --- INITIALIZE CAMERA ON LOAD ---
// --- CAMERA PERMISSION HELPER ---
function showCameraPermissionsGuide() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="header">
        <h3>🔧 Fix Camera Access</h3>
        <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <div style="padding: 20px;">
          <h4 style="color: #00ff88; margin-bottom: 15px;">Step-by-Step Fix:</h4>
          
          <div style="background: rgba(0,240,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <b>📍 Step 1: Check address bar</b><br>
            Look for this icon in your browser: <span style="color:#ff9966">📷🚫🔒</span><br>
            Click it and select "Allow" camera access
          </div>
          
          <div style="background: rgba(0,255,136,0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <b>📱 Step 2: Close other camera apps</b><br>
            • Close Zoom, Teams, Meet<br>
            • Close Instagram, Snapchat<br>
            • Close any video recording apps
          </div>
          
          <div style="background: rgba(185,103,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <b>🔄 Step 3: Refresh & Retry</b><br>
            After fixing permissions, refresh this page:<br>
            <button class="btn" onclick="location.reload()" style="margin-top:10px; background:var(--cyber-cyan);">
              🔄 Refresh Page Now
            </button>
          </div>
          
          <p style="color: #a0a0ff; font-size: 0.9rem;">
            <i>Still having issues? Try:</i><br>
            • Different browser (Chrome, Firefox, Edge)<br>
            • Update your browser to latest version<br>
            • Restart your phone/computer
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// --- UPDATE RETRY FUNCTION ---
scanner.start();
function retryCamScan() {
  scanner.start();
  outputCam.textContent = "Scanning..";
  requestAnimationFrame(scan);
  toast.success("Scanning Again");
  vibrate();
}

// Vibration feedback
function vibrate() {
  navigator.vibrate?.([100, 50, 100]);
}
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const canvasImg = document.getElementById("canvasImg");
const ctxImg = canvasImg.getContext("2d", { willReadFrequently: true });
const outputImg = document.getElementById("outputImg");
const text = document.getElementById("text");
let imgFrame = 0;
let startTime = null;
let warnTime = null;
let maxTime = null;
let clear = null;
let infoText = null;
let tapSpan = null;
let codeData = null;
// Click or drag & drop
dropZone.addEventListener("click", () =>
  document.getElementById("fileInput").click()
);
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
  text.classList.remove("success");
  text.classList.remove("trying");
  text.classList.remove("failed");
  dropZone.classList.remove("success");
  dropZone.classList.remove("failed");
  dropZone.classList.remove("trying");

  text.textContent = "Release to drop";
});
dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragover");
  text.classList.remove("success");
  text.classList.remove("trying");
  text.classList.remove("failed");
  dropZone.classList.remove("success");
  dropZone.classList.remove("failed");
  dropZone.classList.remove("trying");

  if (infoText === `Failed`) {
    text.classList.remove("success");
    text.classList.remove("trying");
    dropZone.classList.remove("success");
    dropZone.classList.remove("trying");
    dropZone.classList.add("failed");

    text.classList.add("failed");
    outputImg.textContent = "NO QR FOUND\nTry a clearer image";
    text.innerHTML = "NO QR FOUND";
    tapSpan = document.createElement("span");
    tapSpan.className = "clickable-text retry";
    tapSpan.textContent = "Try Again";

    tapSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      retryImgScan();
    });

    text.appendChild(tapSpan);
    outputImg.classList.remove("trying");
    outputImg.classList.remove("success");
    outputImg.classList.add("failed");
  } else if (infoText === "Trying") {
    text.classList.remove("success");
    text.classList.remove("failed");
    dropZone.classList.remove("success");
    dropZone.classList.remove("failed");
    dropZone.classList.add("trying");
    text.classList.add("trying");
    text.textContent = "NO QR FOUND\nTRYING HARDER";
    outputImg.textContent = "NO QR FOUND\nTRYING HARDER";

    outputImg.classList.add("trying");
    outputImg.classList.remove("success");
    outputImg.classList.remove("failed");
  } else if (infoText === "Success") {
    text.classList.remove("trying");
    text.classList.remove("failed");
    dropZone.classList.remove("trying");
    dropZone.classList.remove("failed");
    text.classList.add("success");
    dropZone.classList.add("success");
    outputImg.classList.remove("trying");
    outputImg.classList.add("success");
    outputImg.classList.remove("failed");
    if (codeData) {
      text.innerHTML = "";
      tapSpan = document.createElement("span");
      tapSpan.className = "clickable-text success";
      tapSpan.textContent = "Tap To View Message";

      tapSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        openModal(codeData);
      });

      // text.appendChild(messageDiv);
      text.appendChild(tapSpan);
      openModal(codeData);
      outputImg.textContent = `DECODED → ${codeData}`;
    }
  } else {
    outputImg.textContent = `Waiting for image...`;
    text.textContent = `DROP IMAGE HERE/TAP TO BROWSE FILES`;
  }
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  text.textContent = "";
  dropZone.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

// Hidden file input
const input = document.createElement("input");
input.type = "file";
input.accept = "image/*";
input.id = "fileInput";
input.style.display = "none";
input.onchange = (e) => handleFile(e.target.files[0]);
document.body.appendChild(input);

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = "block";
    preview.onload = () => {
      text.classList.remove("success");
      text.classList.remove("trying");
      text.classList.remove("failed");
      dropZone.classList.remove("success");
      dropZone.classList.remove("failed");
      dropZone.classList.remove("trying");
      canvasImg.width = preview.naturalWidth;
      canvasImg.height = preview.naturalHeight;
      toast.success("Scanning");
      outputImg.textContent = "Scanning...";
      text.textContent = "";
      startTime = Date.now();
      if (warnTime) clearTimeout(warnTime);
      if (maxTime) clearTimeout(maxTime);
      if (clear) clearTimeout(clear);

      warnTime = setTimeout(() => {
        ctxImg.filter = "brightness(1.1) contrast(1.1)";
        text.textContent = "NO QR FOUND\nTRYING HARDER";
        infoText = "Trying";
        outputImg.textContent = "NO QR FOUND\nTRYING HARDER";
        text.classList.remove("success");
        text.classList.remove("failed");
        dropZone.classList.remove("success");
        dropZone.classList.remove("failed");
        dropZone.classList.add("trying");
        vibrate();
        toast.success("No Code Detected");

        text.classList.add("trying");
        outputImg.classList.add("trying");
        outputImg.classList.remove("success");
        outputImg.classList.remove("failed");
      }, 30000);
      maxTime = setTimeout(() => {
        infoText = "Failed";
        text.classList.remove("success");
        text.classList.remove("trying");
        dropZone.classList.remove("success");
        dropZone.classList.remove("trying");
        dropZone.classList.add("failed");
        toast.success("Scan failed");
        sound("error");

        text.classList.add("failed");
        vibrate();
        outputImg.classList.remove("trying");
        outputImg.classList.remove("success");
        outputImg.classList.add("failed");
        outputImg.textContent = "NO QR FOUND\nTry a clearer image";
        text.innerHTML = "NO QR FOUND";
        tapSpan = document.createElement("span");
        tapSpan.className = "clickable-text retry";
        tapSpan.textContent = "Try Again";

        tapSpan.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          retryImgScan();
        });

        text.appendChild(tapSpan);
        if (window.trackQRX) {
          trackQRX("scan_failed", {
            category: "img-scanner",
            label: "timeout",
            value: Date.now() - startTime,
          });
        }
      }, 45000);
      imgFrame = 0;
      requestAnimationFrame(animateAndScan);
    };
  };
  reader.readAsDataURL(file);
}
function retryImgScan() {
  toast.success("Scanning again");
  // Reset everything
  text.classList.remove("trying");
  text.classList.remove("failed");
  dropZone.classList.remove("trying");
  dropZone.classList.remove("failed");
  text.classList.remove("success");
  dropZone.classList.remove("success");
  outputImg.classList.remove("trying");
  outputImg.classList.remove("success");
  outputImg.classList.remove("failed");
  outputImg.textContent = "Scanning";
  text.textContent = "";
  startTime = Date.now();
  if (warnTime) clearTimeout(warnTime);
  if (maxTime) clearTimeout(maxTime);
  if (clear) clearTimeout(clear);
  warnTime = setTimeout(() => {
    ctxImg.filter = "brightness(1.1) contrast(1.1)";
    text.textContent = "NO QR FOUND\nTRYING HARDER";
    infoText = "Trying";
    toast.success("No Code Detected");

    outputImg.textContent = "NO QR FOUND\nTRYING HARDER";
    text.classList.remove("success");
    text.classList.remove("failed");
    dropZone.classList.remove("success");
    dropZone.classList.remove("failed");
    dropZone.classList.add("trying");
    vibrate();
    text.classList.add("trying");
    outputImg.classList.add("trying");
    outputImg.classList.remove("success");
    outputImg.classList.remove("failed");
  }, 30000);
  maxTime = setTimeout(() => {
    infoText = "Failed";
    text.classList.remove("success");
    text.classList.remove("trying");
    dropZone.classList.remove("success");
    dropZone.classList.remove("trying");
    dropZone.classList.add("failed");

    text.classList.add("failed");
    vibrate();
    toast.success("Scan failed");
    sound("error");

    outputImg.classList.remove("trying");
    outputImg.classList.remove("success");
    outputImg.classList.add("failed");
    outputImg.textContent = "NO QR FOUND\nTry a clearer image";

    text.innerHTML = "NO QR FOUND";
    tapSpan = document.createElement("span");
    tapSpan.className = "clickable-text retry";
    tapSpan.textContent = "Try Again";

    tapSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      retryImgScan();
    });

    text.appendChild(tapSpan);
    if (window.trackQRX) {
      trackQRX("scan_failed", {
        category: "img-scanner",
        label: "timeout",
        value: Date.now() - startTime,
      });
    }
  }, 45000);
  imgFrame = 0;
  requestAnimationFrame(animateAndScan);
  ctxImg.filter = "brightness(1) blur(0px) contrast(1)";
}
function animateAndScan() {
  if (imgFrame === 0 && window.trackQRX) {
    trackQRX("scan_attempt", {
      category: "img-scanner",
      label: "image",
      value: 1,
    });
  }
  ctxImg.drawImage(preview, 0, 0);
  // Same sick animation
  const imgTime = imgFrame++ * 0.05;
  const waveY = canvasImg.height * (0.5 + Math.sin(imgTime * 1.5) * 0.45);
  const grad = ctxImg.createLinearGradient(0, waveY - 60, 0, waveY + 60);
  grad.addColorStop(0, "rgba(0,255,200,0)");
  grad.addColorStop(0.5, "rgb(0,240,255)");
  grad.addColorStop(1, "rgba(0,255,200,0)");
  ctxImg.strokeStyle = grad;
  ctxImg.shadowBlur = 40;
  ctxImg.shadowColor = "#00f0ff";
  ctxImg.beginPath();
  ctxImg.moveTo(0, waveY);
  ctxImg.lineTo(canvasImg.width, waveY);
  ctxImg.stroke();

  ctxImg.shadowBlur = 0;
  const imageData = ctxImg.getImageData(
    0,
    0,
    canvasImg.width,
    canvasImg.height
  );
  let code = jsQR(imageData.data, imageData.width, imageData.height);

  // SUPERCHARGED SCANNING — tries multiple ways
  if (camFrame) {
    // Try normal
    code = jsQR(imageData.data, imageData.width, imageData.height);

    // If failed → try with aggressive contrast (this saves 90% of messy images)
    if (!code || code.data.trim() === "") {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasImg.width;
      tempCanvas.height = canvasImg.height;
      const tctx = tempCanvas.getContext("2d");
      tctx.drawImage(preview, 0, 0);
      tctx.globalCompositeOperation = "color-burn";
      tctx.fillStyle = "#000";
      tctx.fillRect(0, 0, canvasImg.width, canvasImg.height);
      tctx.globalCompositeOperation = "source-over";
      const enhanced = tctx.getImageData(
        0,
        0,
        canvasImg.width,
        canvasImg.height
      );
      code = jsQR(enhanced.data, enhanced.width, enhanced.height);
    }

    if (code && code.data.trim() !== "") {
      clearTimeout(warnTime);
      clearTimeout(maxTime);
      clearTimeout(clear);
      vibrate();
      sound();
      // window.trackScanSuccess = function(type, dataLength) {
      if (window.trackQRX) {
        trackQRX("scan_success", {
          category: "img-scanner",
          label: "image",
          value: code.data.length,
        });
      }
      // };
      // const audio = new Audio("fav.mp3")
      // audio.play();
      text.classList.remove("trying");
      text.classList.remove("failed");
      dropZone.classList.remove("trying");
      dropZone.classList.remove("failed");
      text.classList.add("success");
      dropZone.classList.add("success");
      outputImg.classList.remove("trying");
      outputImg.classList.add("success");
      outputImg.classList.remove("failed");
      codeData = code.data.trim();
      outputImg.textContent = `DECODED → ${codeData}`;
      infoText = `Success`;
      toast.success("Scanned QR Code");

      // Draw the found corners for ultimate flex
      ctxImg.strokeStyle = "#00ff00";
      ctxImg.filter = "blur(3px) brightness(0.5)";
      ctxImg.drawImage(preview, 0, 0);
      ctxImg.lineWidth = 3;
      code.location.topLeftCorner &&
        ctxImg.strokeRect(
          code.location.topLeftCorner.x - 10,
          code.location.topLeftCorner.y - 10,
          20,
          20
        );
      code.location.topRightCorner &&
        ctxImg.strokeRect(
          code.location.topRightCorner.x - 10,
          code.location.topRightCorner.y - 10,
          20,
          20
        );
      code.location.bottomLeftCorner &&
        ctxImg.strokeRect(
          code.location.bottomLeftCorner.x - 10,
          code.location.bottomLeftCorner.y - 10,
          20,
          20
        );
      const overlay = document.getElementById("successOverlay"); // we'll add this in HTML
      text.innerHTML = "";
      tapSpan = document.createElement("span");
      tapSpan.className = "clickable-text success";
      tapSpan.textContent = "Tap To View Message";

      tapSpan.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        openModal(codeData);
      });

      text.appendChild(tapSpan);
      openModal(codeData);

      return;
    }
  }
  if (Date.now() - startTime < 44000 && !code) {
    clearTimeout(clear);
    clear = setTimeout(() => {
      ctxImg.filter = "blur(5px) brightness(0.5)";
      ctxImg.clearRect(0, 0, canvasImg.width, canvasImg.height);
      ctxImg.drawImage(preview, 0, 0);
      setTimeout(() => {}, 1000);
    }, 1000);
    requestAnimationFrame(animateAndScan);
  }
}

function openModal(message) {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
        <div class="header">
            <button class="cpy-icon" onclick='copyToClipboard("${message}")'>   
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="17" width="17">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
            </button>
            <h3>Decoded QR message</h3>
            <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
    </div>
    `;

  document.body.appendChild(modal);

  // Add modal animation styles
  const modalStyles = document.createElement("style");
  modalStyles.textContent = `
        .modal-overlay {
            opacity: 0;
            animation: modalFadeIn 0.3s forwards;
        }
        
        .modal-content {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            animation: modalContentPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s forwards;
        }
        
        @keyframes modalFadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalContentPop {
            0% {
                transform: scale(0.8) translateY(20px);
                opacity: 0;
                box-shadow: 0 0 0 rgba(0, 240, 255, 0);
            }
            70% {
                transform: scale(1.02) translateY(0);
                box-shadow: 0 0 50px rgba(0, 240, 255, 0.4);
            }
            100% {
                transform: scale(1) translateY(0);
                opacity: 1;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            }
        }
        
        .modal-body {
            position: relative;
            overflow: hidden;
        }
        
        .modal-body::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00f0ff, transparent);
            animation: scanLine 1s ease 0.5s;
        }
        
        @keyframes scanLine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
    `;
  document.head.appendChild(modalStyles);

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.animation = "modalFadeOut 0.3s forwards";
      setTimeout(() => modal.remove(), 300);
    }
  });

  // Add fade out animation
  const fadeOutStyle = document.createElement("style");
  fadeOutStyle.textContent = `
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
   `;
  document.head.appendChild(fadeOutStyle);
}

function copyToClipboard(message) {
  try {
    navigator.clipboard.writeText(message).then(() => {});
  } catch (e) {}
}
function sound(mode) {
  const beep = new AudioContext();
  const o = beep.createOscillator();
  o.connect(beep.destination);
  o.start();
  o.frequency.value = mode === "error" ? 1000 : 3000;
  o.stop(beep.currentTime + 0.35); // 150ms beep
}
// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered: ", registration);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              toast.info("New update available! Refresh to update.");
            }
          });
        });
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}
// In your main script.js - Check for updates
if ("serviceWorker" in navigator) {
  // Register service worker
  navigator.serviceWorker.register("/sw.js");

  // Check for updates every hour
  setInterval(() => {
    navigator.serviceWorker.ready.then((reg) => reg.update());
  }, 60 * 60 * 1000);

  // Listen for new service worker
  let newSW;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Show update toast
    toast.info("🔄 Update available! Refreshing...", 3000);
    setTimeout(() => window.location.reload(), 3000);
  });

  // Optional: Manual update button
  function showUpdateButton() {
    const btn = document.createElement("button");
    btn.innerHTML = "🔄 Update App";
    btn.style.cssText = `
      position: fixed; bottom: 80px; right: 20px;
      background: #00f0ff; color: #000; padding: 10px 20px;
      border: none; border-radius: 20px; cursor: pointer;
      z-index: 9999; font-weight: bold;
    `;
    btn.onclick = () => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active.postMessage("skipWaiting");
      });
    };
    document.body.appendChild(btn);
  }
}
// PWA Install Prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show install button after 10 seconds
  setTimeout(() => {
    if (deferredPrompt) {
      const installBtn = document.createElement("button");
      installBtn.innerHTML = "📱 Install QRX App";
      installBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #00f0ff, #00ff88);
        color: #0a0a0f;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
      `;
      installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            toast.success("QRX installed! 🎉");
          }
          deferredPrompt = null;
          installBtn.remove();
        });
      };
      document.body.appendChild(installBtn);
    }
  }, 10000);
});
// Add to your existing script in app.html
document.addEventListener("DOMContentLoaded", () => {
  // Track section navigation
  document.querySelectorAll(".nav-item").forEach((nav) => {
    nav.addEventListener("click", (e) => {
      const section = e.currentTarget.dataset.index;
      trackQRX("section_switch", {
        category: "navigation",
        label: section,
        value: 1,
      });
    });
  });

  // QR Generation tracking
  const qrInput = document.getElementById("input");
  if (qrInput) {
    let lastGenerated = "";
    let generationCount = 0;

    qrInput.addEventListener("change", () => {
      if (qrInput.value && qrInput.value !== lastGenerated) {
        generationCount++;
        lastGenerated = qrInput.value;

        trackQRX("qr_generated", {
          category: "generator",
          label: "text_input",
          value: generationCount,
        });

        // Track content type
        const isURL =
          qrInput.value.includes("http") ||
          qrInput.value.includes("www.") ||
          qrInput.value.includes(".com");
        trackQRX("qr_content_type", {
          category: "generator",
          label: isURL ? "url" : "text",
          value: qrInput.value.length,
        });
      }
    });
  }

  // Download tracking
  document.querySelectorAll('[onclick*="download"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      trackQRX("qr_downloaded", {
        category: "generator",
        label: "png",
        value: 1,
      });
    });
  });

  // Logo upload tracking
  const logoInput = document.getElementById("logo");
  if (logoInput) {
    logoInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        trackQRX("logo_uploaded", {
          category: "customization",
          label: "image_upload",
          value: e.target.files[0].size,
        });
      }
    });
  }

  // Scan tracking functions (add to your existing code)

  // window.trackScanError = function(type, error) {
  //   trackQRX('scan_error', {
  //     'category': 'scanner',
  //     'label': type,
  //     'value': 1,
  //     'error_message': error.message
  //   });
  // };

  // Time tracking
  let pageLoadTime = new Date();
  setInterval(function () {
    const minutesOnSite = Math.floor((new Date() - pageLoadTime) / 60000);

    if (minutesOnSite > 0 && minutesOnSite <= 30) {
      // Track up to 10 minutes
      trackQRX("minutes_on_app", {
        category: "engagement",
        label: `${minutesOnSite}_minute${minutesOnSite > 1 ? "s" : ""}`,
        value: minutesOnSite,
        non_interaction: true,
      });
    }
  }, 60000);
  // Error tracking
  window.addEventListener("error", (e) => {
    trackQRX("app_error", {
      category: "errors",
      label: e.filename || "unknown",
      value: 1,
      error_message: e.message.substring(0, 100),
      line_number: e.lineno,
    });
  });
});
