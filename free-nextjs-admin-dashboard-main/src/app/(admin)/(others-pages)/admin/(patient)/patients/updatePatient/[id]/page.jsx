// app/patients/updatePatient/[id]/page.jsx (or your chosen route structure)
"use client"; // This page needs to be a Client Component to use hooks like useParams

import React from "react";
// Adjust the import path to where your UpdatePatient component is located
import UpdatePatient from "../../../../../../../../components/patient/updatePatient";
import { useParams } from 'next/navigation'; // Keep using useParams

export default function PatientUpdatePage() { // Renamed component
  const { id } = useParams(); // Get the dynamic 'id' segment from the URL

  // Basic check if the ID was retrieved from the URL parameters
  if (!id) {
    // Update the error message for patient context
    return <div>Erreur: ID du patient non trouvé dans l'URL.</div>;
  }

  return (
    <div>
      {/* Update the heading for the patient update page */}
      <h1>Modifier les informations du Patient</h1>

      {/* Render the UpdatePatient component, passing the id as patientId */}
      <UpdatePatient patientId={id} />
    </div>
  );
}