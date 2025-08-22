const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const predictButton = document.getElementById("predictButton");
const loader = document.getElementById("loader");
const chartContainer = document.getElementById("chartContainer");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set drawing properties
ctx.lineWidth = 15;
ctx.lineCap = "round";
ctx.strokeStyle = "#ffffff";

// Function to display the probability distribution as a bar chart
function displayProbabilities(
  probabilities = Array(10).fill(0),
  predictedDigit = -1
) {
  chartContainer.innerHTML = ""; // Clear previous chart
  probabilities.forEach((prob, index) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const label = document.createElement("div");
    label.className = `bar-label ${
      index === predictedDigit && prob > 0 ? "predicted-label" : ""
    }`;
    label.textContent = index;
    barContainer.appendChild(label);

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const barProgress = document.createElement("div");
    const percentage = (prob * 100).toFixed(1); // Still used for bar width
    const floatValue = prob.toFixed(2); // For hover text

    let progressClasses = "bar-progress";
    if (prob > 0) {
      if (index === predictedDigit) {
        progressClasses += " predicted";
      } else {
        progressClasses += " active";
      }
    }
    barProgress.className = progressClasses;
    barProgress.style.width = `${percentage}%`;
    barWrapper.appendChild(barProgress);

    // Add the hover-value element inside barWrapper
    const hoverValue = document.createElement("div");
    hoverValue.className = "hover-value";
    hoverValue.textContent = floatValue;
    barWrapper.appendChild(hoverValue);

    barContainer.appendChild(barWrapper);
    // The percentage value on the right is now removed from here
    chartContainer.appendChild(barContainer);
  });
}

// Function to clear the canvas and reset the chart
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  displayProbabilities(); // Reset chart to all 0.00 scores
}

// Event listeners for drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  draw(e);
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// Touch event listeners for mobile devices
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
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

// Clear button functionality
clearButton.addEventListener("click", clearCanvas);

// Predict button functionality
predictButton.addEventListener("click", async () => {
  loader.style.display = "block";
  predictButton.disabled = true;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 28;
  tempCanvas.height = 28;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  const imageData = tempCtx.getImageData(
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );
  const data = imageData.data;
  const pixels = [];

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = data[i];
    pixels.push(grayscale / 255);
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: pixels }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const predictedDigit = result.prediction;
    const probabilities = result.probabilities;

    if (probabilities) {
      displayProbabilities(probabilities, predictedDigit);
    }
  } catch (error) {
    console.error("Error during prediction:", error);
    displayProbabilities(); // Reset chart to 0.00 on error
  } finally {
    loader.style.display = "none";
    predictButton.disabled = false;
  }
});

// Initialize canvas by clearing it (which also sets up the 0.00 chart)
clearCanvas();
