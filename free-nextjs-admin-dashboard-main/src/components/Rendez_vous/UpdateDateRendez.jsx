"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Radio from "../form/input/Radio";
import { ChevronDownIcon } from "../../icons";
import DatePicker from "@/components/form/date-picker";
import { useRouter } from "next/navigation";
import { editRendezVous } from "../../services/RendezVousService";

export default function UpdateRendezVous({ patient, medecins, specialites }) {
  const router = useRouter();
  const addOneHour = (dateStr) => {
    const date = new Date(dateStr);
    
    // Ajoute une heure en tenant compte du fuseau horaire local
    date.setHours(date.getHours() );
  
    // Formatage manuel pour éviter les problèmes d'UTC
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`; // Format: "HH:mm"
  };
  const [datePart, timePart] = patient.dateRendez.split("T");
  const time=patient.dateRendez.split('T')[1].slice(0,5)
  const [listeHeure, setListeHeure] = useState([]);
  const [errors, setErrors] = useState({});
  const [medecinSpec, setMedecinSpec] = useState([]);
  const [type, setType] = useState("RDV");
  const [dateRDV, setDateRDV] = useState("");
  const [heureRDV, setHeureRDV] = useState(time);
  const [etat, setEtat] = useState("");
  const [idMed, setIdMed] = useState(0);
  const [idPatient, setIdPatient] = useState(patient.idPat);
  const [assur, setAssur] = useState(false);
  const [idSpec, setIdSpec] = useState(0);
  

  // Options statiques pour les heures
const optionHeur = [
  "08:00",
  "09:15",
  "10:15",
  "11:15",
  "12:15",
  "13:15",
  "14:15",
  "16:15",
].map(h => ({ value: h, label: h }));
  useEffect(() => {
    if (patient) {
        console.log(patient.idPat)
      setAssur(patient.assurance);
     
      console.log("auto !!"+heureRDV)
      setDateRDV(datePart);

      setIdMed(patient.idMed);
      setIdPatient(patient.idPat);
      setType(patient.type);
      setEtat(patient.etat);
      
      // Trouver la spécialité du médecin actuel
      const currentMedecin = medecins.find(med => med.id === patient.idMed);
      if (currentMedecin) setIdSpec(currentMedecin.specid);
      
      setListeHeure(optionHeur); // Initialiser les heures
    }
  }, [patient, medecins]);
 
  // Options pour les spécialités
  const optionSpec = specialites.map(spec => ({
    value: spec.specid,
    label: spec.designation
  }));

  // Filtre des médecins par spécialité
  useEffect(() => {
    if (idSpec) {
      const filtered = medecins.filter(med => med.specid === idSpec);
      setMedecinSpec(filtered);
    }
  }, [idSpec]);

  // Options pour les médecins filtrés
  const optionMed = medecinSpec.map(med => ({
    value: med.id,
    label: med.utilisateur.nom
  }));

  // Gestion des changements
  const handleRadioChange = (value) => {
    setType(value);
    if (value === "URG") {
      const now = new Date();
      setDateRDV(now.toISOString().split("T")[0]);
      setHeureRDV(now.toTimeString().slice(0, 5));
    }
  };

  // Validation et soumission
  const validateForm = () => {
    const errors = {};
    if (!idPatient) errors.idPatient = "Patient requis";
    if (!type) errors.type = "Type requis";
    if (!idSpec) errors.idSpec = "Spécialité requise";
    if (!idMed) errors.idMed = "Médecin requis";
    if (assur === null) errors.assur = "Assurance requise";
    if (!dateRDV) errors.dateRDV = "Date requise";
    if (!heureRDV) errors.heureRDV = "Heure requise";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await editRendezVous({
          id: patient.id,
          idPat: Number(idPatient),
          type,
          idMed: Number(idMed),
          assurance: assur,
          dateRendez: `${dateRDV}T${heureRDV}:00Z`,
          etat,
        });
        router.push("/admin/rendez_vous");
        router.refresh();
      } catch (error) {
        alert("Erreur lors de la mise à jour : " + error.message);
      }
    }
  };
  const handleSelectChangeHeure = value => {
    console.log("Selected value:", value)
    setHeureRDV(value)
    

  }
  
  const handleSelectChange = value => {
    console.log("Selected value:", value)
    setIdSpec(value)
    

  }
  const handleSelectChange1 = value => {
    console.log("Selected value:", value)
    setIdMed(value)
  }

  return (
    <ComponentCard title="Modifier Rendez-vous">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Patient (désactivé car non modifiable) */}
          <div>
            <Label>Patient</Label>
            <Input
              type="text"
              defaultValue={idPatient}
              disabled
              onChange={(e) => setIdPatient(e.target.value)}
            />
          </div>

          {/* Type de RDV */}
          <div>
            <Label>Type</Label>
            <div className="flex gap-8">
              <Radio
                name="type"
                value="RDV"
                checked={type === "RDV"}
                onChange={() => handleRadioChange("RDV")}
                label="RDV Standard"
              />
              <Radio
                name="type"
                value="URG"
                checked={type === "URG"}
                onChange={() => handleRadioChange("URG")}
                label="Urgence"
              />
            </div>
          </div>

          {/* État du RDV */}
          <div>
            <Label>État</Label>
            <div className="flex gap-8">
              <Radio
                name="etat"
                value="NONEFF"
                checked={etat === "NONEFF"}
                onChange={() => setEtat("NONEFF")}
                label="Non effectué"
              />
              <Radio
                name="etat"
                value="EFF"
                checked={etat === "EFF"}
                onChange={() => setEtat("EFF")}
                label="Effectué"
              />
            </div>
          </div>

          {/* Sélection de la spécialité */}
          <div>
        <Label>Spécialité</Label>
        <Select
            defaultValue={idSpec}
            options={optionSpec}
            onChange={handleSelectChange}
            placeholder="Choisir une spécialité"
            className="dark:bg-dark-900"

        />
        {errors.idSpec && <p className="text-red-500">{errors.idSpec}</p>}
        </div>

       
        <div>
        <Label>Médecin</Label>
        <Select
            defaultValue={idMed}
            options={optionMed}
            onChange={handleSelectChange1}
            placeholder="Choisir un médecin"
            className="dark:bg-dark-900"

        />
        {errors.idMed && <p className="text-red-500">{errors.idMed}</p>}
        </div>



          {/* Assurance */}
          <div>
            <Label>Assurance</Label>
            <div className="flex gap-8">
              <Radio
                name="assurance"
                value={true}
                checked={assur}
                onChange={() => setAssur(true)}
                label="Oui"
              />
              <Radio
                name="assurance"
                value={false}
                checked={!assur}
                onChange={() => setAssur(false)}
                label="Non"
              />
            </div>
          </div>

          {/* DatePicker avec gestion d'urgence */}
          <div>
            <DatePicker
              id="date-picker"
              label="Date Picker Input"
              placeholder="Select a date"
            value={dateRDV}
              disabled={type === "URG"}
              onChange={(date,currentDateString) => {
                setDateRDV(currentDateString);
                setListeHeure(optionHeur);
              }}
            />
             
          </div>

         {/* Sélection de l'heure */}
<div>
    
  <Label>Heure</Label>
  <Select
    defaultValue={type === "URG"?"":heureRDV} // Directement la valeur string

options={listeHeure}
    onChange={handleSelectChangeHeure}
    placeholder="Choisir une heure"
    disabled={type === "URG"}
  />
</div>

          <button type="submit" className="btn btn-primary w-full">
            Mettre à jour
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}  