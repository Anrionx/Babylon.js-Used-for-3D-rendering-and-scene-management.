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


// Get canvas element
const canvas = document.getElementById("renderCanvas");

// Create Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Set scene background to transparent
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);  // RGBA(0, 0, 0, 0) makes the background transparent

    // Create an ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 15, new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);

    // Add light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Load the GLB model
    BABYLON.SceneLoader.Append("./models/", "model.glb", scene, function () {
        console.log("Model loaded!");
    });

    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 15, height: 15 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("./models/textures/ground.png", scene);
    ground.material = groundMaterial;

    // Create columns
    window.columns = createColumns(scene);

    return scene;
};

// Function to create columns at the corners
function createColumns(scene) {
    const positions = [
        new BABYLON.Vector3(-5, 1, -5),
        new BABYLON.Vector3(5, 1, -5),
        new BABYLON.Vector3(-5, 1, 5),
        new BABYLON.Vector3(5, 1, 5)
    ];

    const columns = [];

    positions.forEach((position, index) => {
        const column = BABYLON.MeshBuilder.CreateCylinder(`column${index}`, { height: 4, diameter: 0.5 }, scene);
        column.position = position;

        const columnMaterial = new BABYLON.StandardMaterial(`columnMaterial${index}`, scene);
        columnMaterial.diffuseTexture = new BABYLON.Texture("./models/textures/columns/column.png", scene);  // Using column texture
        column.material = columnMaterial;

        columns.push(column);
    });

    return columns;
}

// Create the scene
const scene = createScene();

// Run the render loop
engine.runRenderLoop(function () {
    scene.render();
});

// Resize the engine on window resize
window.addEventListener("resize", function () {
    engine.resize();
});
