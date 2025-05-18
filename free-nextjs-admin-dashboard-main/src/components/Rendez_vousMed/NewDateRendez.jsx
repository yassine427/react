"use client"
import React, { useEffect, useState } from "react"
import ComponentCard from "../common/ComponentCard"
import Label from "../form/Label"
import Input from "../form/input/InputField"
import Select from "../form/Select"
import Radio from "../form/input/Radio";

import {
  ChevronDownIcon,
  EyeCloseIcon,
  EyeIcon,
  TimeIcon
} from "../../icons"
import DatePicker from "@/components/form/date-picker"
import { addRendezVous } from "@/services/RendezVousService"
import { useRouter } from "next/navigation"

export default function NewRendezVous({patients,abscences,medecins,specialites}) {
    const router = useRouter();

    const [listeHeure, setListeHeure] = useState([]);
    const [errors, setErrors] = useState({});

    const [medecinSpec, setMedecinSpec] = useState([]);
    const [type, setType] = useState("RDV");
    const [dateRDV, setDateRDV] = useState("");
    const [heureRDV, setHeureRDV] = useState("");

    const [idMed, setIdMed] = useState(0);
    const [idPatient, setIdPatient] = useState(0);
    const [assur, setAssur] = useState(false);
const [idSpec, setIdSpec] = useState();
    const handleRadioChange = value => {
        setType(value)
        const today = new Date();
        if (type=="URG"){
        setDateRDV(today.toISOString().split('T')[0]);
        setHeureRDV(today.toTimeString().slice(0,5))
    
    }
        else     {    setDateRDV("");
            setHeureRDV("")
        }

      }
      const handleAssurChange = value => {
        setAssur(value)
      }
  const [showPassword, setShowPassword] = useState(false)

  const optionSpec = specialites.map((spec) => {
    return { value: spec.specid, label: spec.designation };
  });

  useEffect(() => {
    const mede = medecins.filter((med)=> med.specid==idSpec)
    setMedecinSpec(mede);
    const mede1 = medecins.find((med)=> med.specid==idSpec)
    if (mede1) {
        setIdMed(mede1.id);
      }
  }, [idSpec]);
  const optionMed = medecinSpec.map((med) => {
    return { value: med.id, label: med.utilisateur.nom };
  });
  const optionHeur = [
    { value: "10:15", label: "10:15"},
    { value: "12:15", label: "12:15"},
    { value: "14:15", label: "14:15"},
  ]
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
  const validateForm = () => {
    const newErrors = {};
    if (!idPatient) newErrors.idPatient = "Patient est requis";
    if (!type) newErrors.type = "Type est requis";
    if (!idSpec) newErrors.idSpec = "Spécialité est requise";
    if (!idMed) newErrors.idMed = "Médecin est requis";
    if (assur === null) newErrors.assur = "Assurance est requise";
    if (!dateRDV) newErrors.dateRDV = "Date est requise";
    if (!heureRDV) newErrors.heureRDV = "Heure est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
     
      // Ici tu peux envoyer les données au serveur
      try {
        await addRendezVous({
            idPat:Number(idPatient),
            type,
            idMed:Number(idMed),
            assurance:assur,
            dateRendez:dateRDV+"T"+heureRDV
        });
        
        router.push('/rendez_vous');
        router.refresh();
      } catch (error) {
        alert("Erreur lors de l'ajout du redenz vous : " + error.message);
      } 
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <ComponentCard title="Default Inputs">
         <form onSubmit={handleSubmit}>
      <div className="space-y-6">

        <div>
          <Label>Patient</Label>
          <Input type="text" onChange={(e) => setIdPatient(e.target.value)} />
          {errors.idPatient && <p className="text-red-500">{errors.idPatient}</p>}
        </div>

        <div>
          <Label>Type</Label>
          <div className="flex flex-wrap items-center gap-8">
            <Radio
              id="radio1"
              name="group1"
              value="RDV"
              checked={type === "RDV"}
              onChange={handleRadioChange}
              label="RDV"
            />
            <Radio
              id="radio2"
              name="group1"
              value="URG"
              checked={type === "URG"}
              onChange={handleRadioChange}
              label="URG"
            />
          </div>
          {errors.type && <p className="text-red-500">{errors.type}</p>}
        </div>

                {/* Sélection de la spécialité */}
        <div>
        <Label>Spécialité</Label>
        <Select
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
            options={optionMed}
            onChange={handleSelectChange1}
            placeholder="Choisir un médecin"
            className="dark:bg-dark-900"

        />
        {errors.idMed && <p className="text-red-500">{errors.idMed}</p>}
        </div>

        {/* Sélection de l'heure */}
     
        <div>
          <Label>Assurance</Label>
          <div className="flex flex-wrap items-center gap-8">
            <Radio
              id="radio3"
              name="group2"
              value={true}
              checked={assur === true}
              onChange={handleAssurChange}
              label="Oui"
            />
            <Radio
              id="radio4"
              name="group2"
              value={false}
              checked={assur === false}
              onChange={handleAssurChange}
              label="Non"
            />
          </div>
          {errors.assur && <p className="text-red-500">{errors.assur}</p>}
        </div>

        <div>
          <DatePicker
            disabled={type=="URG"}
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              setDateRDV(currentDateString);
              setListeHeure(optionHeur);
            }}
          />
          {errors.dateRDV && <p className="text-red-500">{errors.dateRDV}</p>}
        </div>

        <div>
          <Label>Heure :</Label>
          <div>
        <Select
            options={listeHeure}
            onChange={handleSelectChangeHeure}
            placeholder="Choisir une heure"
            disabled={type === "URG"}
        />
        </div>
          {errors.heureRDV && <p className="text-red-500">{errors.heureRDV}</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Envoyer
        </button>

      </div>
    </form>
  
    </ComponentCard>
  )
}
