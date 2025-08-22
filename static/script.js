const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const predictButton = document.getElementById("predictButton");
const predictionResult = document.getElementById("predictionResult");
const loader = document.getElementById("loader");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

ctx.lineWidth = 15;
ctx.lineCap = "round";
ctx.strokeStyle = "#FFFFFF";

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  predictionResult.textContent = "";
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  draw(e);
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  [lastX, lastY] = [touch.offsetX, touch.offsetY];
  drawTouch(e);
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  drawTouch(e);
});

canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("touchcancel", () => (isDrawing = false));

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawTouch(e) {
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const currentX = touch.clientX - rect.left;
  const currentY = touch.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
  [lastX, lastY] = [currentX, currentY];
}

clearButton.addEventListener("click", clearCanvas);
predictButton.addEventListener("click", async () => {
  loader.style.display = "block";
  predictionResult.textContent = "";
  predictButton.disabled = true;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 28;
  tempCanvas.height = 28;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  const pixelData = new Float32Array(784);
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    pixelData[i / 4] = avg / 255; // Normalize to [0, 1]
  }

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: Array.from(pixelData) })
    });

    if (!response.ok) {
      throw new Error("HTTP error! " + response.status);
    }

    const result = await response.json();
    predictionResult.textContent = `Predicted Digit: ${result.prediction}`;
  } catch (error) {
    predictionResult.textContent = "Error predicting digit.";
    console.error("Error:", error);
  } finally {
    loader.style.display = "none";
    predictButton.disabled = false;
  }
  
});

clearCanvas(); // Clear canvas on initial load
