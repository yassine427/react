"use client";

import Calendar from "../../../../components/medecin/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";

import {fetchAbscence} from "@/services/AbscenceService"
import { fetchMedecins } from "@/services/MedecinService";
import { fetchRendezVousNonEff } from "@/services/RendezVousService";

  


export default function page() {
  const [abscence, setAbscence] = useState([]);
    const [medecin, setMedecin] = useState([ ]);
  const [RDVNonEff, setRDVNonEff] = useState([]);

 
  const handleDateChange = (date) => {
    setDateRendezVous(date);
    console.log("Date sélectionnée :", date);
  };

  // Fetch data whenever dateRendezVous changes
  useEffect(() => {
      const fetchData = async () => {
      const medecinList = await fetchMedecins(
                (med) => med.utilisateur.email === localStorage.getItem("medecin")
              );
      
              const medecin = Array.isArray(medecinList) ? medecinList[0] : medecinList;
      
              if (!medecin) {
                console.error("Médecin non trouvé");
                return;
              }
              else{
                console.log("existe "+ medecin.id)
              }
              const nonEffData = await fetchRendezVousNonEff(0, (rdv) => rdv.idMed === medecin.id);

        const abscence = await fetchAbscence((red)=>red.idMed===medecin.id);
                setRDVNonEff(nonEffData);

        setAbscence(abscence);
        setMedecin(medecin)
      };

      fetchData();
    
  }, []);
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar abscence={abscence} medecin={medecin} NonEff={RDVNonEff} />
    </div>
  );
}
