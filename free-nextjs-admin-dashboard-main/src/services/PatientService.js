const PATIENT_API = process.env.API_URL + "/patients";

export const fetchPatients = async () => {
  const res = await fetch(PATIENT_API, { cache: 'no-store' });
  if (!res.ok) {
    console.error("Failed fetchPatients:", res.status, await res.text());
    throw new Error('Erreur lors de la récupération des patients');
  }
  return await res.json();
};

export const fetchArchivedPatients = async () => {
  const res = await fetch(`${PATIENT_API}/archived`);
  if (!res.ok) {
    console.error("Failed fetchArchivedPatients:", res.status, await res.text());
    throw new Error('Erreur lors de la récupération des patients archivés');
  }
  return await res.json();
};

export const fetchPatientById = async (id) => {
  if (!id) throw new Error('Patient ID is required');

  const res = await fetch(`${PATIENT_API}/${id}`);
  if (!res.ok) {
    console.error(`Failed fetchPatientById (ID: ${id}):`, res.status, await res.text());
    throw new Error('Erreur lors de la récupération du patient');
  }
  return await res.json();
};

export const addPatient = async (data) => {
  const res = await fetch(PATIENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMessage = "Erreur lors de l'ajout du patient";
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (parseError) {
      console.error("Failed addPatient - Non-JSON error response:", await res.text());
    }
    console.error(`Failed addPatient:`, res.status, errorMessage);
    throw new Error(errorMessage);
  }
  return await res.json();
};

export const updatePatient = async (id, data) => {
  if (!id) throw new Error('Patient ID is required for update');

  const res = await fetch(`${PATIENT_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Failed updatePatient (ID: ${id}):`, res.status, await res.text());
    throw new Error('Erreur lors de la mise à jour du patient');
  }
  return await res.json();
};

export const deletePatient = async (id) => {
  if (!id) throw new Error('Patient ID is required for deletion');

  const res = await fetch(`${PATIENT_API}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    console.error(`Failed deletePatient (ID: ${id}):`, res.status, await res.text());
    throw new Error('Erreur lors de la suppression du patient');
  }
  return await res.json();
};

export const restorePatient = async (id) => {
  if (!id) throw new Error('Patient ID is required for restoration');

  const res = await fetch(`${PATIENT_API}/restore/${id}`, { method: "PUT" });
  if (!res.ok) {
    console.error(`Failed restorePatient (ID: ${id}):`, res.status, await res.text());
    throw new Error('Erreur lors de la restauration du patient');
  }
  return await res.json();
};
