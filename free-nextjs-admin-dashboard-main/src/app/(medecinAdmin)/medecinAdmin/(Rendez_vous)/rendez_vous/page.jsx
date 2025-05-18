"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useState, useEffect } from "react";
import RendezVous from "../../../../../components/Rendez_vousMed/TableRendez";
import DateRendez from "../../../../../components/Rendez_vousMed/DateRendez";
import { fetchRendezVousNonEff, fetchRendezVousEff } from '@/services/RendezVousService';
import { fetchMedecins } from "@/services/MedecinService";



const RendezVous1 = () => {
  const [dateRendezVous, setDateRendezVous] = useState(0);
  const [RDVNonEff, setRDVNonEff] = useState([]);
  const [RDVEff, setRDVEff] = useState([]);

  const handleDateChange = (date) => {
    setDateRendezVous(date);
    console.log("Date sélectionnée :", date);
  };

  // Fetch data whenever dateRendezVous changes
  useEffect(() => {
      const fetchData = async () => {
      const medecin = await fetchMedecins(
        (med) => med.utilisateur.email === localStorage.getItem("medecin")
      );
      console.log("ddd"+medecin);
        const nonEffData = await fetchRendezVousNonEff(dateRendezVous,(red)=>red.idMed===medecin.id);
        const effData = await fetchRendezVousEff(dateRendezVous,(red)=>red.idMed===medecin.id);
        setRDVNonEff(nonEffData);
        setRDVEff(effData);
      };

      fetchData();
    
  }, [dateRendezVous]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Rendez Vous" />
      <div className="space-y-6">
        <ComponentCard title="Rendez Vous">
          <DateRendez onDateChange={handleDateChange} />
          <RendezVous RDVNonEff={RDVNonEff} RDVEff={RDVEff} />
        </ComponentCard>
      </div>
    </div>
  );
}

export default RendezVous1;
