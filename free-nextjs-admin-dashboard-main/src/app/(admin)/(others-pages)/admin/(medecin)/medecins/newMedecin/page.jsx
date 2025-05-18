
import React from "react";
import NewMedecin from "../../../../../../../components/medecin/NewMedecin";
import { fetchSpecialites } from "@/services/SpecialiteService"; // Adjust the import path

async function NewMedecinPage() {
  // Fetch specialites on the server-side
  const specialitesData = await fetchSpecialites();

  return (
    <div>
      <h1>Ajouter un Nouveau Médecin</h1>
      <NewMedecin specialites={specialitesData} />
    </div>
  );
}

export default NewMedecinPage;