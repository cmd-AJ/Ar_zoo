import React, { createContext, useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { DINO_IDS, DINO_ASSETS } from '../config';
import { registerUser, updateDinoOnServer, getDinosFromServer } from '../api';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Replaces localStorage 'dataId' logic mostly
  const [foundDinos, setFoundDinos] = useState([]); // Replaces 'found' array
  const [loading, setLoading] = useState(true);

  // Check LocalStorage on boot
  useEffect(() => {
    const checkUser = async () => {
      const storedId = localStorage.getItem('dataId');
      if (storedId) {
        setUser({ _id: storedId });
        // Sync with server
        try {
          const data = await getDinosFromServer(storedId);
          if (data.success) {
            // Convert server object {dino_1: true} to array ['dino_1']
            const foundList = Object.keys(data.dinos).filter(key => data.dinos[key]);
            setFoundDinos(foundList);
          }
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // --- ACTIONS ---

  const handleRegister = async (formData) => {
    try {
      Swal.fire({ title: 'Cargando...', didOpen: () => Swal.showLoading() });
      const data = await registerUser(formData);

      if (data.success) {
        localStorage.setItem('dataId', data.usuario._id);
        setUser(data.usuario);
        Swal.fire('¡ÉXITO!', 'Usuario registrado', 'success');
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleDinoFound = async (index) => {
    const dinoId = DINO_IDS[index];

    // 1. If already found, ignore
    if (foundDinos.includes(dinoId)) return;

    // 2. Update Local State
    const newFoundList = [...foundDinos, dinoId];
    setFoundDinos(newFoundList);

    // 3. Alert UI
    Swal.fire({
      title: 'Animal Encontrado!',
      imageUrl: DINO_ASSETS[dinoId] || 'https://via.placeholder.com/150',
      imageWidth: 200,
      confirmButtonText: 'Recolectar'
    });

    // 4. Update Server
    if (user?._id) {
      await updateDinoOnServer(user._id, dinoId);
    }

    // 5. Check Win Condition
    if (newFoundList.length === 10) {
      setTimeout(() => {
        Swal.fire({
          title: '¡FELICIDADES!',
          text: 'Has completado la Expedición Silvestre.',
          icon: 'success'
        });
      }, 4000);
    }
  };

  return (
    <GameContext.Provider value={{
      user,
      foundDinos,
      handleRegister,
      handleDinoFound,
      loading
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);