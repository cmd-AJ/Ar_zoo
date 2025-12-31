// This is only the register form. THis register form doesnt affect anything of the AR just the UIs

import { useEffect, useRef, useState } from 'react';
import { useGame } from './Gamecontext';
import "./css/overlay.css"
import { FiLogOut } from 'react-icons/fi';
import { DINO_ASSETS } from '../config';

export default function UIOverlay() {
  const { user, handleRegister, foundDinos, handleLogout } = useGame();

  // Local form state
  const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '' });
  const [showProgress, setShowProgress] = useState(false);
  const [Introduced, isIntroduced] = useState(false);


  

  const prevCountRef = useRef(0);


  const handleClick = () => {
  isIntroduced(true); // This hides the overlay
};

  useEffect(() => {
    // Check if the number of found dinos has INCREASED

    // Update our reference for next time
    prevCountRef.current = foundDinos.length;

  }, [foundDinos]); // Runs whenever the foundDinos array changes

  const onSubmit = (e) => {
    e.preventDefault();
    handleRegister(formData);
  };

  // If user is NOT registered, show Register Form
  if (!user) {
    return (
      <>

      {Introduced ? (
          <div className={`overlay-container ${!Introduced ? 'hidden' : ''}`}>

            <div style={{ backgroundColor: "transparent", width: "100%", height: "35%", display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img src="/overlay/logo_explora_zoo.png" alt="Explora Zoo" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
            </div>

            <div style={{ backgroundColor: "transparent", width: "100%", height: "65%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <h2 className='titlehung'>REGISTRATE</h2>

              <form onSubmit={onSubmit} className='formulario'>
                <input
                  placeholder="Nombre"
                  className="input-field"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <input
                  placeholder="Correo"
                  type="email"
                  className="input-field"
                  value={formData.correo}
                  onChange={e => setFormData({ ...formData, correo: e.target.value })}
                  required
                />
                <input
                  placeholder="Teléfono"
                  type="tel"
                  className="input-field"
                  value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
                <button className='jugar' type="submit">¡JUGAR!</button>
              </form>
            </div>
          </div>
        ) : 
        
                  <div className='introduccion'>

            <button style={{backgroundColor:"#E68C00", border:"2px solid white", width:"30%" ,padding:10 ,color:'white', borderRadius:"10px", position:'absolute', bottom:"15%", left:"35%"}} onClick={handleClick} ><b>¡Empezar!</b></button>



          </div>
        
        }

        </>

    );
  }

  // If User IS registered, show Game UI buttons
  return (
    <div style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* HUD Header */}
      <div style={{ pointerEvents: 'auto', padding: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button className='HUDheader' onClick={() => setShowProgress(true)}>
          <img width={40} height={40} src='/overlay/logo.png'></img>
          <div style={{marginLeft:"10%" }}>EXPLORA ZOO</div>
        </button>
        
      </div>

        <div style={{ pointerEvents: 'auto', padding: 10, display: 'flex', justifyContent: 'space-between' }}>
        {[...Array(10)].map((_, i) => {
          const dinoId = `animal_${i}`;
          const isFound = foundDinos.includes(dinoId);
          const imageSrc = DINO_ASSETS[dinoId];

          return (
            <div id={dinoId} key={dinoId} >
              <img
                width={30}
                src={imageSrc}
                style={{
                  // If not found, make it gray and slightly transparent
                  filter: isFound ? "none" : "grayscale(100%)",
                  opacity: isFound ? 1 : 0.5,
                  transition: "filter 0.5s ease, opacity 0.5s ease" // Smooth transition when found!
                }}
                alt={dinoId}
              />
            </div>
          );
        })}

      </div>








      {/* Progress Modal */}
      {showProgress && (
        <div style={{
          pointerEvents: 'auto',
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.9)',
          color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>

            <button style={{position:'absolute', top:"1.9%", left:"4%"}} className='HUDheader' onClick={() => setShowProgress(true)}>
          <img width={40} height={40} src='/overlay/logo.png'></img>
        </button>

            <div style={{ pointerEvents: 'auto', padding: 10, display: 'flex', justifyContent: 'space-between' }}>
        {[...Array(10)].map((_, i) => {
          const dinoId = `animal_${i}`;
          const isFound = foundDinos.includes(dinoId);
          const imageSrc = DINO_ASSETS[dinoId];

          return (
            <div id={dinoId} key={dinoId} >
              <img
                width={30}
                src={imageSrc}
                style={{
                  // If not found, make it gray and slightly transparent
                  filter: isFound ? "none" : "grayscale(100%)",
                  opacity: isFound ? 1 : 0.5,
                  transition: "filter 0.5s ease, opacity 0.5s ease" // Smooth transition when found!
                }}
                alt={dinoId}
              />
            </div>
          );
        })}

      </div>


          <div style={{ backgroundImage: `url('/overlay/coleccion.png')`,backgroundSize: 'cover', padding: 20, borderRadius: "10px", paddingBottom: "15%" }}>
            <h2 className='titlecoleccion'><span style={{fontFamily:"Rowdies", color:"#FFCC00"}} >¡</span>MI COLECCIÓN<span style={{fontFamily:"Rowdies", color:"#FFCC00"}} >!</span></h2>

            
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 10, 
                justifyContent: 'center', // Centers the items horizontally
                maxWidth: '260px',       // Limits width so it still looks like a grid (~4 items wide)
                margin: '0 auto'         // Centers the whole container
              }}>
              {[...Array(10)].map((_, i) => {
                // UPDATE 1: Match the ID to your config (animal_0, animal_1...)
                // We use 'i' instead of 'i+1' because your config starts at 0
                const dinoId = `animal_${i}`;

                const isFound = foundDinos.includes(dinoId);

                // UPDATE 2: Get the specific image for this animal
                const imageSrc = DINO_ASSETS[dinoId];

                return (
                  <div key={i} style={{
                    width: 50, height: 50,
                    // Change background: White if found (to show image clearly), Grey if not
                    background: isFound ? 'white' : '#ddd',
                    border: isFound ? '2px solid #4CAF50' : '2px solid white', // Green border if found
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden' // Keeps the image inside the rounded corners
                  }}>
                    {isFound ? (
                      // SHOW IMAGE IF FOUND
                      <img
                        src={imageSrc}
                        alt="Found"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      // SHOW '?' IF NOT FOUND
                      <span style={{ fontSize: '20px', color: '#666' }}></span>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
          <button className='closer' style={{ marginTop: 20, fontFamily:"Rowdies" }} onClick={() => setShowProgress(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}