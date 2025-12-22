import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function InfoButton() {
  const showInstructions = () => {
    Swal.fire({
      imageUrl:  '/overlay/Instrucciones.png',
        imageWidth: 250,
      confirmButtonText: '¡Entendido!',
      confirmButtonColor: '#744a25',
      customClass: {
        container: 'my-swal-override'
        
      }
    });
  };

  useEffect(() => {
    // Small delay (500ms) ensures the AR and UI are ready 
    // before the popup hits the screen
    const timer = setTimeout(() => {
      showInstructions();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={showInstructions}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '10px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        border: '3px solid white',
        fontSize: '30px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 99999, // Ensure it is above the AR and the Register Form
        transition: 'transform 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      ?
    </button>
  );
}