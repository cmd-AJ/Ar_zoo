// This is only the register form. THis register form doesnt affect anything of the AR just the UIs

import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './Gamecontext';
import "./css/overlay.css"

export default function UIOverlay() {
  const { user, handleRegister, foundDinos } = useGame();
  
  // Local form state
  const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '' });
  const [showProgress, setShowProgress] = useState(false);

  const prevCountRef = useRef(0);

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
      <div style={{ position: 'absolute', zIndex: 10, background: 'white', padding: 20, top: '20%', left: '10%', right: '10%' }}>
        
        <img className='mainpage' src='/overlay/backgroundZoo.png'></img>
        
        <h2 className='titlehung'>REGISTRO ANIMAL HUNT</h2>
        <form onSubmit={onSubmit} className='formulario'>
          <input 
            placeholder="Nombre" 
            className="input-field"
            value={formData.nombre}
            onChange={e => setFormData({...formData, nombre: e.target.value})}
            required
          />
          <input 
            placeholder="Correo" 
            type="email"
            className="input-field"
            value={formData.correo}
            onChange={e => setFormData({...formData, correo: e.target.value})}
            required
          />
          <input 
            placeholder="Teléfono" 
            type="tel"
            className="input-field"
            value={formData.telefono}
            onChange={e => setFormData({...formData, telefono: e.target.value})}
            required
          />
          <button className='jugar' type="submit">JUGAR</button>
        </form>
      </div>
    );
  }

  // If User IS registered, show Game UI buttons
  return (
    <div style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      
      {/* HUD Header */}
      <div  style={{ pointerEvents: 'auto', padding: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button className='HUDheader' onClick={() => setShowProgress(true)}>
           Ver Progreso ({foundDinos.length}/10)
        </button>
      </div>

      {/* Progress Modal */}
      {showProgress && (
        <div style={{ 
            pointerEvents: 'auto', 
            position: 'absolute', inset: 0, 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
        }}>

            <div style={{backgroundColor:"#744a25", padding:20, borderRadius:"10px", paddingBottom:"15%"}}>
            <h2 className='titlecoleccion'>TU COLECCIÓN</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[...Array(10)].map((_, i) => {
                    const dinoId = `animal_${i+1}`;
                    const isFound = foundDinos.includes(dinoId);
                    return (
                        <div key={i} style={{ 
                            width: 50, height: 50, 
                            background: isFound ? '#4CAF50' : '#ddd',
                            border: '2px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {isFound ? '✓' : '?'}
                        </div>
                    )
                })}
            </div>

            </div>
            <button className='closer' style={{marginTop: 20}} onClick={() => setShowProgress(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}