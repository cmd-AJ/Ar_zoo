import { useEffect, useRef } from "react";
import { useGame } from "./Gamecontext";

export default function ARScene({ path, animalPaths = [] }) {
  const sceneRef = useRef(null);
  const { handleDinoFound } = useGame();

  // We use this to keep track of listeners to remove them later
  const targetsRef = useRef([]);

  

useEffect(() => {
    // ---------------------------------------------------------
    // 1. REGISTER "MAKE-UNLIT" COMPONENT (NEW CODE)
    // ---------------------------------------------------------
    if (typeof window !== "undefined" && window.AFRAME) {
      if (!window.AFRAME.components["make-unlit"]) {
        window.AFRAME.registerComponent("make-unlit", {
          init: function () {
            this.el.addEventListener("model-loaded", () => {
              const obj = this.el.getObject3D("mesh");
              if (!obj) return;

              obj.traverse((node) => {
                if (node.isMesh && node.material) {
                  // 1. Grab original texture
                  const texture = node.material.map;
                  const color = node.material.color;

                  // 2. Create a cheap "Basic" material (no lights needed)
                  const newMat = new window.AFRAME.THREE.MeshBasicMaterial({
                    color: color, 
                    map: texture,
                    side: window.AFRAME.THREE.DoubleSide,
                    transparent: node.material.transparent,
                    alphaTest: 0.5 
                  });

                  // 3. Fix encoding if texture exists
                  if (texture) {
                    texture.encoding = window.AFRAME.THREE.sRGBEncoding;
                  }

                  node.material = newMat;
                }
              });
            });
          },
        });
      }
    }
    // ---------------------------------------------------------

    const sceneEl = sceneRef.current;
    const targetEntities = document.querySelectorAll(".dino-target");

    // FUNCTION TO HANDLE FOUND
    const onTargetFound = (event) => {
      // MindAR event target is the element itself
      const index = event.target.getAttribute("data-index");
      console.log("🔥 TARGET FOUND DIRECTLY:", index); 
      handleDinoFound(parseInt(index));
    };

    // FUNCTION TO HANDLE LOST (Optional)
    const onTargetLost = (event) => {
      const index = event.target.getAttribute("data-index");
      console.log("💨 Target Lost:", index);
    };

    // ATTACH LISTENERS
    // We wait a tiny bit to ensure A-Frame has initialized the DOM nodes
    const timer = setTimeout(() => {
        targetEntities.forEach((el) => {
            el.addEventListener("targetFound", onTargetFound);
            el.addEventListener("targetLost", onTargetLost);
        });
    }, 1000); // 1 second delay to be safe

    // CLEANUP
    return () => {
      clearTimeout(timer);
      targetEntities.forEach((el) => {
        el.removeEventListener("targetFound", onTargetFound);
        el.removeEventListener("targetLost", onTargetLost);
      });
    };
  }, [handleDinoFound, animalPaths]);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <a-scene
        ref={sceneRef}
        mindar-image={`imageTargetSrc: ${path}; filterMinCF:0.0001; filterBeta: 0.01`}
        color-space="sRGB"
        renderer="colorManagement: true; precision: mediump;"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {animalPaths.map((modelUrl, index) => (
          <a-entity
            key={index}
            // IMPORTANT: We add a class to select them easily in JS
            class="dino-target"
            // IMPORTANT: We store the index in a data attribute to read it in the event
            data-index={index} 
            mindar-image-target={`targetIndex: ${index}`}
          >
            <a-gltf-model
              src={modelUrl}
              scale="0.5 0.5 0.5"
              position="0 0.1 0.2"
              animation-mixer
              fix-visibility=""
            ></a-gltf-model>



            {/* SHARED PORTAL (Same for everyone) */}
            <a-gltf-model
              class="portal-model"
              src="/modelos/portal.glb"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
              position="0 0 0"
              fix-visibility=""
            ></a-gltf-model>

            {/* SHARED CARTEL (Same for everyone) */}
            <a-gltf-model
              class="cartel-model"
              src="/modelos/SoloCartel.glb"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
              position="0 0 0.15"
              fix-visibility=""
            ></a-gltf-model>



          </a-entity>
        ))}
      </a-scene>
    </div>
  );
}