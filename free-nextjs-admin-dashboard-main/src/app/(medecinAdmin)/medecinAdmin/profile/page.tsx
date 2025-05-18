"use client"
import React, { useEffect, useState } from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { fetchMedecins } from "@/services/MedecinService";
import { Metadata } from "next";

// Définis ici le type de ton objet utilisateur selon ce que tu as
interface Utilisateur {
  email: string;
  // autres champs si besoin
}

interface Medecin {
  id: number | string;
  utilisateur: Utilisateur;
  // autres champs si besoin
}

export default function Profile(): JSX.Element {
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const email = localStorage.getItem("medecin");
    if (!email) {
      console.error("Email du médecin non trouvé dans localStorage");
      setLoading(false);
      return;
    }

    async function loadMedecin() {
      try {
        const medecinList: Medecin[] = await fetchMedecins();
        const found = medecinList.find((med) => med.utilisateur.email === email);

        if (!found) {
          console.error("Médecin non trouvé");
        } else {
          console.log("Médecin trouvé, id:", found.id);
          setMedecin(found);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des médecins:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMedecin();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!medecin) {
    return <div>Médecin non trouvé</div>;
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard medecin={medecin} />
          <UserInfoCard medecin={medecin} />
        </div>
      </div>
    </div>
  );
}
