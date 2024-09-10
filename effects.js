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

// Function to apply laser effect to columns
function applyLaserEffect(column) {
    const scene = column.getScene();

    const laserMaterial = new BABYLON.StandardMaterial("laserMaterial", scene);
    laserMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Initial color (green)
    laserMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0); // Initial color (green)
    column.originalMaterial = column.material; // Save original material
    column.material = laserMaterial;

    const laserBeam = BABYLON.MeshBuilder.CreateCylinder("laserBeam", { height: 10, diameter: 0.1 }, scene);
    laserBeam.position = column.position.add(new BABYLON.Vector3(0, 5, 0)); // Adjust position as needed
    laserBeam.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0); // Rotate to vertical
    laserBeam.material = laserMaterial;
    laserBeam.isPickable = false;

    const laserParticleSystem = new BABYLON.ParticleSystem("laser", 500, scene);
    laserParticleSystem.particleTexture = new BABYLON.Texture("models/textures/columns/laser.png", scene); // Ensure this path is correct
    laserParticleSystem.emitter = column;
    laserParticleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
    laserParticleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 4, 0.5);
    laserParticleSystem.color1 = new BABYLON.Color4(0, 1, 0, 1);
    laserParticleSystem.color2 = new BABYLON.Color4(0, 0.8, 0.2, 1);
    laserParticleSystem.minSize = 0.2;
    laserParticleSystem.maxSize = 0.7;
    laserParticleSystem.emitRate = 500;
    laserParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    laserParticleSystem.start();

    column.laserSystem = laserParticleSystem;
    column.laserBeam = laserBeam;

    // Animate the laser color
    let colorShift = 0;
    const laserColorAnimation = () => {
        colorShift += 0.02; // Adjust the speed of the color animation
        const r = Math.sin(colorShift) * 0.5 + 0.5;
        const g = Math.cos(colorShift) * 0.5 + 0.5;
        const b = (Math.sin(colorShift * 0.5) * 0.5 + 0.5); // Adding some blue to vary the color
        laserMaterial.diffuseColor = new BABYLON.Color3(r, g, b);
        laserMaterial.emissiveColor = new BABYLON.Color3(r, g, b);
    };
    scene.onBeforeRenderObservable.add(laserColorAnimation);
    window.laserColorAnimation = laserColorAnimation; // Save reference for removal

    // Add additional lights
    const pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(0, 10, 0), scene);
    pointLight1.intensity = 1.5;
    pointLight1.diffuse = new BABYLON.Color3(1, 1, 1); // White light
    column.laserLight1 = pointLight1;

    const pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(5, 10, 5), scene);
    pointLight2.intensity = 1.2;
    pointLight2.diffuse = new BABYLON.Color3(1, 0, 0); // Red light
    column.laserLight2 = pointLight2;

    const directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-1, -1, -1), scene);
    directionalLight.intensity = 0.8;
    directionalLight.diffuse = new BABYLON.Color3(1, 1, 1); // White light
    column.laserLight3 = directionalLight;
}

// Function to remove laser effects from columns
function removeLaserEffects() {
    window.columns.forEach(column => {
        // Remove laser particle system
        if (column.laserSystem) {
            column.laserSystem.stop();
            column.laserSystem.dispose();
            delete column.laserSystem;
        }

        // Remove laser beam
        if (column.laserBeam) {
            column.laserBeam.dispose();
            delete column.laserBeam;
        }

        // Restore original material
        if (column.originalMaterial) {
            column.material = column.originalMaterial;
            delete column.originalMaterial;
        } else if (column.material) {
            column.material.dispose();
        }

        // Cleanup additional lights
        if (column.laserLight1) {
            column.laserLight1.dispose();
            delete column.laserLight1;
        }
        if (column.laserLight2) {
            column.laserLight2.dispose();
            delete column.laserLight2;
        }
        if (column.laserLight3) {
            column.laserLight3.dispose();
            delete column.laserLight3;
        }
    });

    // Clear any ongoing animations related to laser effects
    if (window.laserColorAnimation) {
        scene.onBeforeRenderObservable.remove(window.laserColorAnimation);
        delete window.laserColorAnimation;
    }
}

// Function to apply fire effect to columns
function applyFireEffect(column) {
    const scene = column.getScene();

    // Create and apply the fire material
    const fireMaterial = new BABYLON.StandardMaterial("fireMaterial", scene);
    fireMaterial.diffuseTexture = new BABYLON.Texture("models/textures/columns/fire.png", scene);
    column.originalMaterial = column.material; // Save original material
    column.material = fireMaterial;

    // Create and start the fire particle system
    const fireParticleSystem = new BABYLON.ParticleSystem("fire", 1000, scene);
    fireParticleSystem.particleTexture = new BABYLON.Texture("models/textures/columns/fire.png", scene);
    fireParticleSystem.emitter = column;
    fireParticleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
    fireParticleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 4, 0.5);
    fireParticleSystem.minSize = 0.5;
    fireParticleSystem.maxSize = 1.0;
    fireParticleSystem.emitRate = 1000;
    fireParticleSystem.start();

    column.fireSystem = fireParticleSystem;
}

// Function to remove fire effects from columns
function removeFireEffects() {
    window.columns.forEach(column => {
        if (column.fireSystem) {
            column.fireSystem.stop();
            column.fireSystem.dispose();
            delete column.fireSystem;
        }
        if (column.material && column.material.name === "fireMaterial") {
            column.material.dispose();
            column.material = column.originalMaterial || null; // Restore original material if available
        }
    });
}

// Function to apply smoke effect to columns
function applySmokeEffect(column) {
    const scene = column.getScene();

    const smokeParticleSystem = new BABYLON.ParticleSystem("smoke", 1000, scene);
    smokeParticleSystem.particleTexture = new BABYLON.Texture("models/textures/columns/smoke.png", scene);
    smokeParticleSystem.emitter = column;
    smokeParticleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
    smokeParticleSystem.maxEmitBox = new BABYLON.Vector3(1, 2, 1);
    smokeParticleSystem.minSize = 0.5;
    smokeParticleSystem.maxSize = 2.0;
    smokeParticleSystem.emitRate = 500;
    smokeParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE; // For a more smoke-like appearance
    smokeParticleSystem.start();

    column.smokeSystem = smokeParticleSystem;
}

// Function to remove smoke effects from columns
function removeSmokeEffects() {
    window.columns.forEach(column => {
        if (column.smokeSystem) {
            column.smokeSystem.stop();
            column.smokeSystem.dispose();
            delete column.smokeSystem;
        }
        if (column.material && column.material.name === "smokeMaterial") {
            column.material.dispose();
            column.material = column.originalMaterial || null; // Restore original material if available
        }
    });
}

// Function to remove all effects from columns
function removeAllEffects() {
    window.columns.forEach(column => {
        // Remove laser effects
        if (column.laserSystem) {
            column.laserSystem.stop();
            column.laserSystem.dispose();
            delete column.laserSystem;
        }
        if (column.laserBeam) {
            column.laserBeam.dispose();
            delete column.laserBeam;
        }
        if (column.laserLight1) {
            column.laserLight1.dispose();
            delete column.laserLight1;
        }
        if (column.laserLight2) {
            column.laserLight2.dispose();
            delete column.laserLight2;
        }
        if (column.laserLight3) {
            column.laserLight3.dispose();
            delete column.laserLight3;
        }

        // Remove fire effects
        if (column.fireSystem) {
            column.fireSystem.stop();
            column.fireSystem.dispose();
            delete column.fireSystem;
        }

        // Remove smoke effects
        if (column.smokeSystem) {
            column.smokeSystem.stop();
            column.smokeSystem.dispose();
            delete column.smokeSystem;
        }

        // Restore original material if available
        if (column.originalMaterial) {
            column.material = column.originalMaterial;
            delete column.originalMaterial;
        } else if (column.material) {
            column.material.dispose();
        }
    });

    // Clear any ongoing animations related to effects
    if (window.laserColorAnimation) {
        scene.onBeforeRenderObservable.remove(window.laserColorAnimation);
        delete window.laserColorAnimation;
    }

    // Optionally clear other global animations or effects
    // if (window.fireEffectAnimation) {
    //     scene.onBeforeRenderObservable.remove(window.fireEffectAnimation);
    //     delete window.fireEffectAnimation;
    // }
}

// Example button to trigger turning off all effects
document.getElementById('turnOffAllEffects').addEventListener('click', () => {
    removeAllEffects();
});
