import { useEffect } from "react";

export default function ARScene() {
  useEffect(() => {
    // 1. REGISTER COMPONENT
    if (typeof window !== "undefined" && window.AFRAME) {
      if (!window.AFRAME.components["fix-visibility"]) {
        window.AFRAME.registerComponent("fix-visibility", {
          init: function () {
            this.el.addEventListener("model-loaded", () => {
              const obj = this.el.getObject3D("mesh");
              if (!obj) return;

              obj.traverse((node) => {
                if (node.isMesh) {
                  node.material.side = window.AFRAME.THREE.DoubleSide;
                  node.frustumCulled = false;
                }
              });
            });
          },
        });
      }
    }

    // 2. RENDER ORDER LOGIC
    // Note: This needs the elements to exist in the DOM. 
    // If this fails, we might need a small setTimeout or the improved component approach.
    const portal = document.querySelector('[src="/modelos/SoloPortal.glb"]');
    const cartel = document.querySelector('[src="/modelos/SoloCartel.glb"]');

    if (portal) {
      portal.addEventListener("model-loaded", () => {
        portal.object3D.renderOrder = 1;
      });
    }
    if (cartel) {
      cartel.addEventListener("model-loaded", () => {
        cartel.object3D.renderOrder = 2;
      });
    }
  }, []);

  return (
    <a-scene 
    embedded 
    arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;'
    vr-mode-ui="enabled: false"
    renderer="logarithmicDepthBuffer: true;">


      <a-marker 
        type="pattern" url="https://192.168.134.89:5173/capibara.patt"
        smooth="true"
        smoothCount="10"
        smoothTolerance="0.01"
        smoothThreshold="5"
      >
        
        {/* LEON */}
        <a-gltf-model
          src="/modelos/Leon.glb"
          scale="1 1 1"
          rotation="-60 -90 90"
          position="0 0 0.8"
          fix-visibility=""
        />

        {/* PORTAL */}
        <a-gltf-model
          src="/modelos/SoloPortal.glb"
          scale="1 1 1"
          rotation="-90 -90 90"
          position="0 0 1"
          fix-visibility=""
        />

        {/* CARTEL */}
        <a-gltf-model
          src="/modelos/SoloCartel.glb"
          scale="1 1 1"
          rotation="-90 -90 90"
          position="0 0.001 1.001"
          fix-visibility=""
        />

      </a-marker>

      <a-entity camera fov="80"></a-entity>
    </a-scene>
  );
}