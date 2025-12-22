import { useEffect, useRef, useMemo } from "react";
import { useGame } from "./Gamecontext";

export default function ARScene({ path, animalPaths = [] }) {
  const sceneRef = useRef(null);
  const { handleDinoFound } = useGame();
  
  // 1. Keep track of which dinos have played sound to prevent repeats
  const playedDinos = useRef(new Set());

  useEffect(() => {
    // REGISTER MAKE-UNLIT (Shortened for clarity, keep your existing logic here)
    if (typeof window !== "undefined" && window.AFRAME && !window.AFRAME.components["make-unlit"]) {
        window.AFRAME.registerComponent("make-unlit", { /* ... your logic ... */ });
    }

    const onTargetFound = (event) => {
      const index = parseInt(event.target.getAttribute("data-index"));
      
      // 2. TRIGGER ONLY ONCE: Check if already played
      if (!playedDinos.current.has(index)) {
        console.log("🔊 Playing sound for index:", index);
        
        // Use standard HTML5 Audio
        const audio = new Audio(`/audio/animal_${index}.mp3`);
        audio.play().catch(e => console.log("Audio play blocked:", e));

        // Mark as played and update game state
        playedDinos.current.add(index);
        handleDinoFound(index);
      }
    };

    const timer = setTimeout(() => {
      const targetEntities = document.querySelectorAll(".dino-target");
      targetEntities.forEach((el) => {
        el.addEventListener("targetFound", onTargetFound);
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      const targetEntities = document.querySelectorAll(".dino-target");
      targetEntities.forEach((el) => {
        el.removeEventListener("targetFound", onTargetFound);
      });
    };
  }, [handleDinoFound]);

  // 3. MEMOIZE THE SCENE: This prevents the "Freeze"
  // This tells React: "Do not re-render the 3D scene even if the parent state changes."
  const memoizedScene = useMemo(() => (
    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <a-scene
        ref={sceneRef}
        mindar-image={`imageTargetSrc: ${path}; filterMinCF:0.0001; filterBeta: 0.01`}
        color-space="sRGB"
        renderer="colorManagement: true; precision: mediump;"
        vr-mode-ui="enabled: false"
        embedded
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {animalPaths.map((modelUrl, index) => (
          <a-entity
            key={index}
            className="dino-target"
            data-index={index} 
            mindar-image-target={`targetIndex: ${index}`}
          >
            <a-gltf-model
              src={modelUrl}
              scale="0.5 0.5 0.5"
              position="0 0.1 0.2"
              animation-mixer
              make-unlit
            ></a-gltf-model>

            <a-gltf-model src="/modelos/portal.glb" scale="0.5 0.5 0.5" />
            <a-gltf-model src="/modelos/SoloCartel.glb" scale="0.5 0.5 0.5" position="0 0 0.15" />
          </a-entity>
        ))}
      </a-scene>
    </div>
  ), [path, animalPaths]);

  return memoizedScene;
}