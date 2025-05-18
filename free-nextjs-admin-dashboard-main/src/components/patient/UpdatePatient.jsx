// src/components/patients/UpdatePatient.jsx (or adjust path as needed)
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard"; // Adjust path if needed
import Label from "../form/Label"; // Adjust path if needed
import Input from "../form/input/InputField"; // Adjust path if needed
// Removed Select import as it's not needed for patients
import Radio from "../form/input/Radio"; // Adjust path if needed
import { updatePatient, fetchPatientById } from "@/services/PatientService"; // Adjust path - Use Patient services

// Props: patientId (the ID of the patient to update)
export default function UpdatePatient({ patientId }) { // Renamed prop
  const router = useRouter();

  // --- State Variables Adjusted for Patient ---
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [tel, setTel] = useState("");
  const [sexe, setSexe] = useState(""); // Expect "M" or "F" from API
  const [imageart, setImageart] = useState(""); // URL for the image
  const [numDossier, setNumDossier] = useState(""); // Changed from reference

  // Removed specialites state

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit button state

  // --- Data Fetching Effect for Patient ---
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) { // Check patientId
        setErrors({ general: "ID Patient manquant." }); // Updated error message
        setIsLoading(false);
        return;
      }

      console.log(`--- useEffect triggered with patientId: ${patientId} ---`); // Log patientId
      setIsLoading(true);
      setErrors({}); // Clear previous errors

      try {
        // Fetch only patient data
        const patientData = await fetchPatientById(patientId); // Use fetchPatientById

        console.log("--- RAW PATIENT DATA FROM API ---", JSON.stringify(patientData, null, 2));

        // Set Patient Form State (ensure patientData and nested utilisateur are valid)
        if (patientData && typeof patientData === 'object' && patientData.utilisateur) {
          console.log('--- Setting form state from fetched patient data (accessing utilisateur) ---');

          const user = patientData.utilisateur; // Convenience variable

          setNom(user.nom || "");
          setPrenom(user.prenom || "");
          setEmail(user.email || "");
          setLogin(user.login || "");
          setTel(user.tel || "");
          setSexe(user.sexe || "");
          setImageart(user.imageart || "");

          // Set patient-specific field directly from patientData
          setNumDossier(patientData.numDossier || "");
          console.log(`--- Set numDossier state to: '${patientData.numDossier || ""}' ---`);

        } else {
          console.error('SKIPPED state setting - patientData or patientData.utilisateur is missing/falsy.', patientData);
          throw new Error("Données du patient ou de l'utilisateur reçues dans un format inattendu ou vides."); // Updated error context
        }

      } catch (err) {
        console.error("Erreur de chargement ou de traitement (patient):", err); // Updated error context
        setErrors({ general: err.message || "Erreur de chargement des données du patient." }); // Updated error message
      } finally {
        setIsLoading(false);
        console.log("--- useEffect finished (patient), isLoading set to false ---");
      }
    };

    fetchData();
  }, [patientId]); // Re-run effect if patientId changes

  // --- Removed options for Select dropdowns ---

  // --- Input Change Handlers (Generic one covers most fields) ---
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  // Specific handler for Sexe Radio buttons
  const handleSexeChange = (value) => {
      console.log("Sexe selected:", value);
      setSexe(value); // Expecting "M" or "F"
      if (errors.sexe) {
          setErrors(prev => ({ ...prev, sexe: null }));
      }
  };

  // --- Form Validation for Patient ---
  const validateForm = () => {
    const newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Format d'email invalide";
    if (!login.trim()) newErrors.login = "Login requis";
    if (!tel.trim()) newErrors.tel = "Téléphone requis";
    if (!sexe || !["M", "F"].includes(sexe)) newErrors.sexe = "Sexe requis (Homme ou Femme)";
    if (!numDossier.trim()) newErrors.numDossier = "Numéro de Dossier requis"; // Changed from reference

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form Submission for Patient ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    console.log("--- Submitting Patient Form ---"); // Log context
    // Log state values before submission
    console.log("State Nom:", nom);
    console.log("State Prenom:", prenom);
    console.log("State Email:", email);
    console.log("State Login:", login);
    console.log("State Tel:", tel);
    console.log("State Sexe:", sexe);
    console.log("State Imageart:", imageart);
    console.log("State NumDossier:", numDossier); // Log patient-specific field

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Construct data object matching backend expectations for patient update
        const dataToUpdate = {
          nom,
          prenom,
          email,
          login,
          tel,
          sexe,
          imageart: imageart || null, // Send null if empty, adjust if API needs ""
          numDossier, // Include patient-specific field
          // NOTE: Password is NOT included here. Add if your backend allows/expects it.
          // password: newPassword // Example if handling password change
        };

        console.log("--- Data being sent to updatePatient:", JSON.stringify(dataToUpdate, null, 2));

        await updatePatient(patientId, dataToUpdate); // Use updatePatient service

        alert("Patient mis à jour avec succès !"); // Success message for patient
        router.push("/admin/patients"); // Redirect to patient list
        router.refresh(); // Refresh server components

      } catch (error) {
        console.error("Erreur lors de la mise à jour (patient):", error); // Update log context
        const apiErrorMessage = error.response?.data?.message || error.message || "Échec de la mise à jour du patient."; // Update error message
        setErrors(prev => ({ ...prev, general: apiErrorMessage }));
        alert("Erreur lors de la mise à jour du patient: " + apiErrorMessage); // Update alert context
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Validation failed (patient)", errors);
      setErrors(prev => ({...prev, general: "Veuillez corriger les erreurs dans le formulaire."}))
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <ComponentCard title="Modifier Patient"><p>Chargement des données du patient...</p></ComponentCard>; // Update title/text
  }

  if (errors.general && !nom && !isSubmitting) { // Basic check if initial load failed
      return (
          <ComponentCard title="Modifier Patient">
              <p className="text-red-500 p-3 bg-red-100 border border-red-400 rounded">Erreur critique: {errors.general}</p>
              <p className="mt-2 text-sm text-gray-600">Impossible de charger les données initiales du patient.</p> {/* Update text */}
          </ComponentCard>
      );
  }

  // Render the form
  return (
    <ComponentCard title="Modifier Patient"> {/* Update title */}
      <form onSubmit={handleSubmit}>
        {/* Display general errors */}
        {errors.general && <p className="text-red-500 mb-4 p-3 bg-red-100 border border-red-400 rounded">Erreur: {errors.general}</p>}

        <div className="space-y-6">

          {/* Nom */}
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              name="nom"
              type="text"
              value={nom}
              onChange={handleInputChange(setNom)}
              placeholder="Nom de famille"
              className={errors.nom ? 'border-red-500' : ''}
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Prénom */}
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              name="prenom"
              type="text"
              value={prenom}
              onChange={handleInputChange(setPrenom)}
              placeholder="Prénom"
              className={errors.prenom ? 'border-red-500' : ''}
            />
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="adresse@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

            {/* Login */}
            <div>
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                name="login"
                type="text"
                value={login}
                onChange={handleInputChange(setLogin)}
                placeholder="Nom d'utilisateur"
                className={errors.login ? 'border-red-500' : ''}
              />
              {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                name="tel"
                type="tel"
                value={tel}
                onChange={handleInputChange(setTel)}
                placeholder="Numéro de téléphone"
                className={errors.tel ? 'border-red-500' : ''}
              />
                {errors.tel && <p className="text-red-500 text-sm mt-1">{errors.tel}</p>}
            </div>

            {/* Sexe */}
            <div>
              <Label>Sexe</Label>
              <div className="flex gap-8">
                <Radio
                  name="sexe"
                  value="M"
                  checked={sexe === "M"}
                  onChange={() => handleSexeChange("M")}
                  label="Homme"
                />
                <Radio
                  name="sexe"
                  value="F"
                  checked={sexe === "F"}
                  onChange={() => handleSexeChange("F")}
                  label="Femme"
                />
              </div>
              {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageart">URL de l'image (Avatar)</Label>
              <Input
                id="imageart"
                name="imageart"
                type="text"
                value={imageart}
                onChange={handleInputChange(setImageart)}
                placeholder="http://example.com/image.jpg"
              />
            </div>

            {/* Numéro de Dossier (Changed from Référence) */}
            <div>
              <Label htmlFor="numDossier">Numéro de Dossier</Label>
              <Input
                id="numDossier"
                name="numDossier" // Use name for potential simpler handlers
                type="text"
                value={numDossier} // Controlled by numDossier state
                onChange={handleInputChange(setNumDossier)} // Use generic handler
                placeholder="Numéro unique du dossier patient"
                className={errors.numDossier ? 'border-red-500' : ''} // Check specific error
              />
                {errors.numDossier && <p className="text-red-500 text-sm mt-1">{errors.numDossier}</p>}
            </div>

          {/* Removed Spécialité Select */}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le Patient"} {/* Updated text */}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}