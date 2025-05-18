const MEDECIN_API = process.env.API_URL + "/medecins";

export const fetchMedecins = async (filter = false) => {
  const res = await fetch(MEDECIN_API, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  if (filter) 
    return data.filter(filter); // `filter` doit être une fonction
  else 
    return data;
};


export const fetchArchivedMedecins = async () => {
  const res = await fetch(`${MEDECIN_API}/archived`);
  if (!res.ok) throw new Error('Failed to fetch archived medecins');
  return await res.json();
};

export const fetchMedecinById = async (id) => {
  const res = await fetch(`${MEDECIN_API}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch medecin');
  return await res.json();
};

export const addMedecin = async (data) => {
  const res = await fetch(MEDECIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur lors de l'ajout");
  }
  return await res.json();
};

export const updateMedecin = async (id, data) => {
  const res = await fetch(`${MEDECIN_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour');
  return await res.json();
};

export const deleteMedecin = async (id) => {
  const res = await fetch(`${MEDECIN_API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return await res.json();
};

export const restoreMedecin = async (id) => {
  const res = await fetch(`${MEDECIN_API}/restore/${id}`, { method: "PUT" });
  if (!res.ok) throw new Error('Erreur lors de la restauration');
  return await res.json();
};
