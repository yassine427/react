"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

import DateRendez from "@/components/Rendez_vousMed/DateRendez";
import RendezVous from "@/components/Rendez_vousMed/TableRendez";
import { Ecommercee } from "@/components/Rendez_vousMed/Ecommercee";
import Monthly from "@/components/Rendez_vousMed/Monthly";
import Statistics from "@/components/Rendez_vousMed/statistics";

import { fetchMedecins } from "@/services/MedecinService";
import { fetchRendezVousNonEff, fetchRendezVousEff } from '@/services/RendezVousService';

export default function Ecommerce() {
  const [dateRendezVous, setDateRendezVous] = useState(0);
  const [RDVNonEff, setRDVNonEff] = useState([]);
  const [RDVEff, setRDVEff] = useState([]);
  const [RDVEffCons, setRDVEffCons] = useState([]);
  const [RDVNonEffCons, setRDVNonEffCons] = useState([]);

  const handleDateChange = (date) => {
    setDateRendezVous(date);
    console.log("Date sélectionnée :", date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const nonEffData = await fetchRendezVousNonEff(dateRendezVous, (rdv) => rdv.idMed === medecin.id);
        const effData = await fetchRendezVousEff(dateRendezVous, (rdv) => rdv.idMed === medecin.id);
        


        setRDVNonEff(nonEffData);
        setRDVEff(effData);
      } catch (error) {
        console.error("Erreur lors du chargement des données du médecin :", error);
      }
    };

    fetchData();
  }, [dateRendezVous]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        const effData = await fetchRendezVousEff(0, (rdv) => rdv.idMed === medecin.id);
        

        setRDVNonEffCons(nonEffData);
        setRDVEffCons(effData);
      } catch (error) {
        console.error("Erreur lors du chargement des données globales :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <Ecommercee RDVNonEff={RDVNonEffCons} RDVEff={RDVEffCons} />
        <Monthly RDVEff={RDVEffCons} />
      </div>

      <div className="col-span-12">
        <Statistics RDVEff={RDVEffCons} />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <PageBreadcrumb />
        <div className="space-y-6">
          <ComponentCard title="Rendez Vous">
            <DateRendez onDateChange={handleDateChange} />
            <RendezVous RDVNonEff={RDVNonEff} RDVEff={RDVEff} />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
