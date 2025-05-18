// app/patients/newPatient/page.jsx (or your chosen route structure)

import React from "react";
// Adjust the import path to where your NewPatient component is located
import NewPatient from "../../../../../../../components/patient/NewPatient";
// This page component likely doesn't need to be async anymore
// unless you plan to add other server-side logic later.
// Using `async` is fine though.
async function NewPatientPage() {
  // No data fetching needed here for the NewPatient form itself

  return (
    <div>
      {/* Update the heading for the patient page */}
      <h1>Ajouter un Nouveau Patient</h1>

      {/* Render the NewPatient component without passing props */}
      <NewPatient />
    </div>
  );
}

export default NewPatientPage;