import { URL_SERVER } from './config';

export const registerUser = async (formData) => {
  const response = await fetch(`${URL_SERVER}/usuarios/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Error registering');
  return await response.json();
};

export const updateDinoOnServer = async (userId, dinoNombre) => {
  if (!userId) return;
  await fetch(`${URL_SERVER}/usuarios/dinos/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dinoNombre }),
  });
};

export const getDinosFromServer = async (userId) => {
  const response = await fetch(`${URL_SERVER}/usuarios/dinosObtener/${userId}`);
  if (!response.ok) throw new Error('Error fetching dinos');
  return await response.json();
};