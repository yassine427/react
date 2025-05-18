"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useState, useEffect } from "react";
import RendezVous from "../../../../../../components/Rendez_vous/TableRendez";
import DateRendez from "../../../../../../components/Rendez_vous/DateRendez";
import { fetchRendezVousNonEff, fetchRendezVousEff } from '@/services/RendezVousService';
import { fetchAbscence } from "@/services/AbscenceService";



const RendezVous1 = () => {
  const [dateRendezVous, setDateRendezVous] = useState(0);
  const [RDVNonEff, setRDVNonEff] = useState([]);
  const [RDVEff, setRDVEff] = useState([]);
  const [abscences,setAbsences]=useState([])
  const handleDateChange = (date) => {
    setDateRendezVous(date);
    console.log("Date sélectionnée :", date);
  };

  // Fetch data whenever dateRendezVous changes
  useEffect(() => {
      const fetchData = async () => {
        
        const nonEffData = await fetchRendezVousNonEff(dateRendezVous);
        const effData = await fetchRendezVousEff(dateRendezVous);
        const abscence = await fetchAbscence();
        setAbsences(abscence)
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
          <RendezVous RDVNonEff={RDVNonEff} abscence={abscences} RDVEff={RDVEff} />
        </ComponentCard>
      </div>
    </div>
  );
}

export default RendezVous1;
