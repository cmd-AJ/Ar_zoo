declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-camera': any;
    'a-gltf-model': any;
    [key: string]: any; // This allows any a-frame element
  }
}