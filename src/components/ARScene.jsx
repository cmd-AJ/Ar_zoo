import { useEffect, useRef, useMemo } from "react";
import { useGame } from "./Gamecontext";

export default function ARScene({ path, animalPaths = [] }) {
  const sceneRef = useRef(null);
  const { handleDinoFound } = useGame();

  // 1. Keep track of which dinos have played sound to prevent repeats
  const playedDinos = useRef(new Set());

  const targetEntities = document.querySelectorAll(".dino-target");
  const btn = document.getElementById('interact-btn');


  useEffect(() => {
    // REGISTER MAKE-UNLIT (Shortened for clarity, keep your existing logic here)
    if (typeof window !== "undefined" && window.AFRAME && !window.AFRAME.components["make-unlit"]) {
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

    const onTargetFound = (event) => {
      const index = parseInt(event.target.getAttribute("data-index"));
      const audio = new Audio(`/audio/animal_${index}.mp3`);

      // const audio = new Audio(`/audio/animal_${index}.mp3`);

      // Show the interact button (was hidden by default)
      try {
        if (btn) {
          btn.classList.remove("hidden");
          // ensure it's focusable / visible
          btn.focus && btn.focus();
          btn.onclick = () => {
            audio.play().catch(e => console.log("Audio play blocked:", e));
          }
        }
      } catch (e) {
        console.warn('Could not show interact button', e);
      }

      targetEntities.forEach((el) => {
        el.addEventListener("targetLost", () => {
          btn.classList.add("hidden");
          audio.pause();
        });
      });

      // 2. TRIGGER ONLY ONCE: Check if already played
      if (!playedDinos.current.has(index)) {
        console.log("🔊 Playing sound for index:", index);

        // Use standard HTML5 Audio
        // const audio = new Audio(`/audio/animal_${index}.mp3`);
        audio.play().catch(e => console.log("Audio play blocked:", e));

        // Mark as played and update game state
        playedDinos.current.add(index);
        handleDinoFound(index);


      }
    };

    const timer = setTimeout(() => {
      targetEntities.forEach((el) => {
        el.addEventListener("targetFound", onTargetFound);
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      targetEntities.forEach((el) => {
        el.removeEventListener("targetFound", onTargetFound);
      });
    };
  }, [handleDinoFound, btn, targetEntities]);



  // 3. MEMOIZE THE SCENE: This prevents the "Freeze"
  // This tells React: "Do not re-render the 3D scene even if the parent state changes."
  const memoizedScene = useMemo(() => (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <a-scene
        ref={sceneRef}
        mindar-image={`imageTargetSrc: ${path}; filterMinCF:0.0001; filterBeta: 0.0001`}
        color-space="sRGB"
        renderer="colorManagement: true; precision: mediump; sortTransparentObjects: true;physicallyCorrectLights: false; logarithmicDepthBuffer: true"
        shadow="type: pcfsoft"
        xr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Lighting: ambient base + hemisphere for sky/ground + directional for main sun + subtle point for fill */}
        <a-entity light="type: ambient; color: #ffffff; intensity: 1"></a-entity>
        {/* Directional "sun" light to cast shadows and provide highlights */}
        <a-entity
          light="type: directional; color: #ffffff; intensity: 1; castShadow: true; target: #ModeloAnimal"
          position="0 4 2"
          rotation="-45 0 0"
        ></a-entity>


        {animalPaths.map((modelUrl, index) => (
          <a-entity
            id="ModeloAnimal"
            key={index}
            className="dino-target"
            data-index={index}
            mindar-image-target={`targetIndex: ${index}`}
          >
            {/* <a-box color="tomato" depth="0.5" height="0.5" width="0.5"></a-box> */}
            <a-gltf-model animation-mixer position="0 -0.7 0" src="/modelos/portal.glb" scale="0.8 0.8 0.8" />
            <a-gltf-model src="/modelos/SoloCartel.glb" scale="0.4 0.4 0.4" position="0 -0.43 0.13" />


            <a-gltf-model
              src={modelUrl}
              scale="0.8 0.8 0.8"
              position="0 -0.7 0.1"
              animation-mixer
              make-unlit
            ></a-gltf-model>


          </a-entity>
        ))}
      </a-scene>


      <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'auto' }}>
        <button
          id="interact-btn"
          className="interact-button hidden"
          aria-label="Interactua"
        >
          ¿Interactuar?
        </button>
      </div>
    </div>
  ), [path, animalPaths]);

  return memoizedScene;
}