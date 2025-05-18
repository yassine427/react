// app/newmedecin/[id]/page.jsx
"use client";
import React from "react";
import UpdateMedecin from "../../../../../../../../components/medecin/updateMed";

import { useParams } from 'next/navigation';
export default function MedecinUpdatePage() {
  const { id } = useParams();
  if (!id) {
    return <div>Erreur: ID du médecin non trouvé.</div>;
  }

  return (
    <div>
      <h1>Modifier les informations du Médecin</h1>
      <UpdateMedecin medecinId={id} />
    </div>
  );
}