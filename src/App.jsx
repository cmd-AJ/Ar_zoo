import './App.css'
import ARScene from './components/ARScene'
import { GameProvider } from './components/Gamecontext'
import UIOverlay from './components/Overlay'
import InfoButton from './components/Infobutton'

function App() {


  const mindFilePath = "/Animals.mind";

  // 2. THE ARRAY OF MODELS
  // The order here MUST match the order inside the .mind file
  const animalModels = [
    "/modelos/Capibara.glb",    // Index 0
    "/modelos/Cocodrilo.glb",   // Index 1
    "/modelos/Elefante.glb",    // Index 2
    "/modelos/Guacamayo.glb",   // Index 3
    "/modelos/Leopardo.glb",     // Index 5
    "/modelos/Jirafa.glb",      // Index 4
    "/modelos/Leon.glb",        // Index 4
    "/modelos/Pinguino.glb",    // Index 6
    "/modelos/Rinoceronte.glb", // Index 7
    "/modelos/Tigre.glb"        // Index 8
  ];

  return (





    <div className="App">
      <InfoButton></InfoButton>
      <GameProvider>
        <div className="App" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
          <ARScene path={mindFilePath} animalPaths={animalModels} />
          <UIOverlay />
        </div>
      </GameProvider>
    </div>
  )
}

export default App
