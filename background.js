/*
 * Copyright [2024] [Anrionx]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



// Georgian letters for matrix animation
const letters = "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ".split(""); 
const fontSize = 16;
const columns = Math.floor(window.innerWidth / fontSize);  // Number of columns based on canvas width
const drops = Array(columns).fill(1);  // Store the drop position for each column

// Background canvas for matrix effect
const backgroundCanvas = document.createElement("canvas");
document.body.appendChild(backgroundCanvas);
backgroundCanvas.id = "backgroundCanvas";
backgroundCanvas.style.position = "absolute";
backgroundCanvas.style.top = "0";
backgroundCanvas.style.left = "0";
backgroundCanvas.style.zIndex = "-1";  // Keep background behind the scene
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

const bgCtx = backgroundCanvas.getContext("2d");

// Function to draw the Matrix-style letters
function drawMatrix() {
    // Black background with slight transparency for the matrix fading effect
    bgCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
    bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // Green text color for matrix effect
    bgCtx.fillStyle = "#00FF00";
    bgCtx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        bgCtx.fillText(letter, i * fontSize, drops[i] * fontSize);

        // Reset drop position randomly when the bottom is reached
        if (drops[i] * fontSize > backgroundCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Draw matrix animation repeatedly
setInterval(function () {
    drawMatrix();
}, 50);

// Resize the background canvas on window resize
window.addEventListener("resize", function () {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    const newColumns = Math.floor(backgroundCanvas.width / fontSize);
    drops.length = newColumns;
    drops.fill(1);
});
