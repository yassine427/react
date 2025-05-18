"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Radio from "../form/input/Radio";
import { addPatient } from "@/services/PatientService";
import { useRouter } from "next/navigation";

export default function NewPatient() {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    sexe: "M",
    numDossier: "",
    login: "",
    password: "",
    imageart: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["nom", "prenom", "email", "tel", "numDossier", "login", "password"];
    for (let key of requiredFields) {
      if (!form[key]) {
        newErrors[key] = `Le champ '${key.replace('numDossier', 'Numéro de Dossier')}' est requis`;
      }
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addPatient(form);
        alert("Patient ajouté avec succès !");
        router.push("/admin/patients");
        router.refresh();
      } catch (error) {
        console.error("Error adding patient:", error);
        alert("Erreur lors de l'ajout du patient : " + (error.message || "Une erreur inconnue est survenue"));
      }
    } else {
      console.log("Validation errors:", errors);
    }
  };

  return (
    <ComponentCard title="Ajouter un Patient">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 p-4">
          {[
            { label: "Nom", name: "nom" },
            { label: "Prénom", name: "prenom" },
            { label: "Email", name: "email", type: "email" },
            { label: "Numéro de téléphone", name: "tel", type: "tel" },
            { label: "Numéro de Dossier", name: "numDossier" },
            { label: "Login", name: "login" },
            { label: "Mot de passe", name: "password", type: "password" },
            { label: "Image (URL ou nom de fichier)", name: "imageart" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                type={type}
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full"
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
              />
              {errors[name] && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <Label>Sexe</Label>
            <div className="flex flex-wrap items-center gap-8 mt-2">
              {["M", "F"].map((val) => (
                <Radio
                  key={val}
                  id={`sexe-${val}`}
                  name="sexe"
                  value={val}
                  checked={form.sexe === val}
                  onChange={handleChange}
                  label={val === "M" ? "Homme" : "Femme"}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ajouter Patient
            </button>
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
