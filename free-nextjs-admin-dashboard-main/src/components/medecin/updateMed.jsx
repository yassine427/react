// src/components/medecins/UpdateMedecin.jsx (or adjust path as needed)
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard"; // Adjust path if needed
import Label from "../form/Label"; // Adjust path if needed
import Input from "../form/input/InputField"; // Adjust path if needed
import Select from "../form/Select"; // Adjust path if needed
import Radio from "../form/input/Radio"; // Adjust path if needed
import { updateMedecin, fetchMedecinById } from "../../services/MedecinService"; // Adjust path
import { fetchSpecialites } from "../../services/SpecialiteService"; // Adjust path, create if needed

// Props: medecinId (the ID of the doctor to update)
export default function UpdateMedecin({ medecinId }) {
  const router = useRouter();

  // --- State Variables ---
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const [tel, setTel] = useState("");
  const [sexe, setSexe] = useState(""); // Expect "M" or "F" from API
  const [imageart, setImageart] = useState(""); // URL for the image
  const [reference, setReference] = useState("");
  const [specid, setSpecid] = useState(""); // Store the ID of the specialty (as string for Select)

  const [specialites, setSpecialites] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit button state

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      if (!medecinId) {
        setErrors({ general: "ID Médecin manquant." });
        setIsLoading(false);
        return;
      }

      console.log(`--- useEffect triggered with medecinId: ${medecinId} ---`);
      setIsLoading(true);
      setErrors({}); // Clear previous errors before fetching

      try {
        // Fetch both medecin data and specialites concurrently (or sequentially if needed)
        const [medecinData, specData] = await Promise.all([
          fetchMedecinById(medecinId),
          fetchSpecialites()
        ]);

        // *** CRITICAL DEBUGGING STEP 1: Examine this log output VERY carefully ***
        console.log("--- RAW MEDECIN DATA FROM API ---", JSON.stringify(medecinData, null, 2));
        console.log("--- RAW SPECIALITES DATA FROM API ---", JSON.stringify(specData, null, 2));

        // Set Specialites State
        setSpecialites(Array.isArray(specData) ? specData : []);
        console.log("--- Specialites fetched and set ---");

        // Set Medecin Form State (ensure medecinData is valid)
        if (medecinData && typeof medecinData === 'object' && medecinData.utilisateur) { // Added check for utilisateur
          console.log('--- Setting form state from fetched medecin data (accessing utilisateur) ---');

          const user = medecinData.utilisateur; // Convenience variable

          setNom(user.nom || "");                 // Access via user.nom
          setPrenom(user.prenom || "");           // Access via user.prenom
          setEmail(user.email || "");             // Access via user.email
                   // Access via user.login
          setTel(user.tel || "");                 // Access via user.tel
          setSexe(user.sexe || "");               // Access via user.sexe
          setImageart(user.imageart || "");       // Access via user.imageart

          // These were already correct as they are top-level in medecinData
          setReference(medecinData.reference || "");
          const fetchedSpecId = medecinData.specid;
          setSpecid(fetchedSpecId ? String(fetchedSpecId) : "");
          console.log(`--- Set specid state to: '${fetchedSpecId ? String(fetchedSpecId) : ""}' ---`);

        } else {
          // Handle case where API returns medecinData but utilisateur is missing
          console.error('SKIPPED state setting - medecinData or medecinData.utilisateur is missing/falsy.', medecinData);
          throw new Error("Données du médecin ou de l'utilisateur reçues dans un format inattendu ou vides.");
        }

      } catch (err) {
        console.error("Erreur de chargement ou de traitement:", err);
        setErrors({ general: err.message || "Erreur de chargement des données." });
        // Optionally clear form fields on error?
        // setNom(''); setPrenom(''); /* ... etc ... */ setSpecid(''); setSpecialites([]);
      } finally {
        setIsLoading(false);
        console.log("--- useEffect finished, isLoading set to false ---");
      }
    };

    fetchData();
  }, [medecinId]); // Re-run effect if medecinId changes

  // --- Prepare options for Select dropdowns ---
  const optionSpec = specialites.map(spec => ({
    value: String(spec.specid), // Ensure option value is string
    label: spec.designation,
  }));

  // --- Input Change Handlers ---
  // Generic handler for simple text/tel/email inputs
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  // Specific handler for Specialty Select
  const handleSpecChange = (value) => {
     console.log("Specialty Selected value:", value);
     setSpecid(value); // Value from Select is already string
     if (errors.specid) {
       setErrors(prev => ({ ...prev, specid: null }));
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

  // --- Form Validation ---
  const validateForm = () => {
    const newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Format d'email invalide";
    if (!tel.trim()) newErrors.tel = "Téléphone requis";
    // Validate sexe against expected values if necessary, or just presence
    if (!sexe || !["M", "F"].includes(sexe)) newErrors.sexe = "Sexe requis (Homme ou Femme)";
    if (!reference.trim()) newErrors.reference = "Référence requise";
    if (!specid) newErrors.specid = "Spécialité requise"; // Check string state

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors (especially general)

    // *** CRITICAL DEBUGGING STEP 4: Log state *before* validation/submission ***
    console.log("--- Submitting Form ---");
    console.log("State Nom:", nom);
    console.log("State Prenom:", prenom);
    console.log("State Email:", email);
    console.log("State Tel:", tel);
    console.log("State Sexe:", sexe); // Should be "M" or "F"
    console.log("State Imageart:", imageart);
    console.log("State Reference:", reference);
    console.log("State Specid:", specid); // Should be the string ID

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const dataToUpdate = {
          // Ensure data matches the API expectation
          nom,
          prenom,
          email,
       
          tel,
          sexe, // Send "M" or "F"
          imageart: imageart || null, // Send null if empty, adjust if API needs ""
          reference,
          specid: Number(specid), // Convert string specid back to number for API
        };

        console.log("--- Data being sent to updateMedecin:", JSON.stringify(dataToUpdate, null, 2));

        await updateMedecin(medecinId, dataToUpdate);

        alert("Médecin mis à jour avec succès !"); // Consider using a more integrated notification system
        router.push("/medecins"); // Adjust route if needed
        router.refresh(); // Re-fetch data on the list page

      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        // Try to get specific error message from API response
        const apiErrorMessage = error.response?.data?.message || error.message || "Échec de la mise à jour.";
        setErrors(prev => ({ ...prev, general: apiErrorMessage }));
        alert("Erreur lors de la mise à jour: " + apiErrorMessage); // Simple feedback
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Validation failed", errors);
       // Set a general error if specific field errors occurred
      setErrors(prev => ({...prev, general: "Veuillez corriger les erreurs dans le formulaire."}))
    }
  };

  // --- Render Logic ---

  // *** CRITICAL DEBUGGING STEP 3: Log state values *during render* (example) ***
  // console.log("--- Rendering Component ---");
  // console.log("Current specid state:", specid);
  // console.log("Is Loading:", isLoading);


  if (isLoading) {
    return <ComponentCard title="Modifier Médecin"><p>Chargement des données du médecin...</p></ComponentCard>;
  }

  // Improved Error Display: Show error if general error exists AND data didn't load properly (e.g., nom is still empty)
  // This check might be less useful now if state is only set after successful fetch, but good as a fallback.
  if (errors.general && !nom && !isSubmitting) { // Check if initial load failed critically
      return (
          <ComponentCard title="Modifier Médecin">
              <p className="text-red-500 p-3 bg-red-100 border border-red-400 rounded">Erreur critique: {errors.general}</p>
              <p className="mt-2 text-sm text-gray-600">Impossible de charger les données initiales du médecin.</p>
          </ComponentCard>
      );
  }

  // Render the form
  return (
    <ComponentCard title="Modifier Médecin">
      <form onSubmit={handleSubmit}>
        {/* Display general errors (validation or submit errors) */}
        {errors.general && <p className="text-red-500 mb-4 p-3 bg-red-100 border border-red-400 rounded">Erreur: {errors.general}</p>}

        <div className="space-y-6">

          {/* Nom */}
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              name="nom"
              type="text"
              value={nom} // Controlled component
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
                 name="sexe" // Ensure radios share the same name
                 value="M" // The actual value to set in state
                 checked={sexe === "M"} // Compare state against this value
                 onChange={() => handleSexeChange("M")} // Use specific handler
                 label="Homme" // User-facing label
               />
               <Radio
                 name="sexe"
                 value="F" // The actual value to set in state
                 checked={sexe === "F"} // Compare state against this value
                 onChange={() => handleSexeChange("F")} // Use specific handler
                 label="Femme" // User-facing label
               />
               {/* Add 'Autre' if your API supports it and define its value */}
             </div>
             {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
           </div>

           {/* Image URL */}
           <div>
             <Label htmlFor="imageart">URL de l'image (Avatar)</Label>
             <Input
               id="imageart"
               name="imageart"
               type="text" // Could be type="url" for basic browser validation
               value={imageart}
               onChange={handleInputChange(setImageart)}
               placeholder="http://example.com/image.jpg"
               // No specific validation error shown here, but could be added
               // className={errors.imageart ? 'border-red-500' : ''}
             />
             {/* {errors.imageart && <p className="text-red-500 text-sm mt-1">{errors.imageart}</p>} */}
           </div>

           {/* Référence */}
           <div>
             <Label htmlFor="reference">Référence</Label>
             <Input
               id="reference"
               name="reference"
               type="text"
               value={reference}
               onChange={handleInputChange(setReference)}
               placeholder="Référence unique médecin"
               className={errors.reference ? 'border-red-500' : ''}
             />
               {errors.reference && <p className="text-red-500 text-sm mt-1">{errors.reference}</p>}
           </div>

          {/* Spécialité */}
          <div>
            <Label htmlFor="specid">Spécialité</Label>
            <Select
              id="specid"
              name="specid" // name is useful for potential form lib integration or simpler handlers
              value={specid} // Controlled by string state `specid`
              // Add a placeholder option similar to UpdateRendezVous
              options={[
                  { value: "", label: "Choisir une spécialité", disabled: true }, // Placeholder
                  ...optionSpec // Actual options
              ]}
              onChange={handleSpecChange} // Use the specific handler
              placeholder="Choisir une spécialité" // Fallback if needed by Select component
              className={`dark:bg-dark-900 ${errors.specid ? 'border-red-500' : ''}`}
            />
              {errors.specid && <p className="text-red-500 text-sm mt-1">{errors.specid}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50"
            // Disable while initially loading OR while submitting
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le Médecin"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}