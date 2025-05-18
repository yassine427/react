"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Radio from "../form/input/Radio";
import { addMedecin } from "@/services/MedecinService";
import { useRouter } from "next/navigation";

export default function NewMedecin({ specialites }) {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    sexe: "M",
    specid: "",
    reference: "",
    password: "",
    imageart: "",
    
  });

  const [errors, setErrors] = useState({});

  const optionSpec = specialites.map(spec => ({
    value: spec.specid,
    label: spec.designation,
  }));

  const validateForm = () => {
    const newErrors = {};
    for (let key of ["nom", "prenom", "email", "tel", "specid", "reference","password"]) {
      if (!form[key]) newErrors[key] = `${key} est requis`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addMedecin(form);
        router.push("/admin/medecins");
        router.refresh();
      } catch (error) {
        alert("Erreur : " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <ComponentCard title="Ajouter un Médecin">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {[
            { label: "Nom", name: "nom" },
            { label: "Prénom", name: "prenom" },
            { label: "Email", name: "email", type: "email" },
            { label: "Numéro de téléphone", name: "tel" },
            { label: "Référence", name: "reference" },
            { label: "Mot de passe", name: "password", type: "password" },
            { label: "Image (URL ou nom de fichier)", name: "imageart" }, // ✅ New field
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <Label>{label}</Label>
              <Input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <p className="text-red-500">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <Label>Sexe</Label>
            <div className="flex flex-wrap items-center gap-8">
              {["M", "F"].map((val) => (
                <Radio
                  key={val}
                  id={`sexe-${val}`}
                  name="sexe"
                  value={val}
                  checked={form.sexe === val}
                  onChange={() => setForm(prev => ({ ...prev, sexe: val }))}
                  label={val === "M" ? "Homme" : "Femme"}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Spécialité</Label>
            <Select
              options={optionSpec}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, specid: parseInt(value) }))
              }
              value={form.specid}
              placeholder="Choisir une spécialité"
              className="dark:bg-dark-900"
            />
            {errors.specid && <p className="text-red-500">{errors.specid}</p>}
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
