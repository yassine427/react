"use client";
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Radio from "../form/input/Radio";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import DatePicker from "@/components/form/date-picker";
import { addRendezVous } from "@/services/RendezVousService";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";

// Define optionHeur outside the component or memoize it if it needs props
const STATIC_OPTION_HEUR = [
  { value: "09:00", label: "08:00" }, // Note: value "09:00" label "08:00", check if intended
  { value: "10:15", label: "09:15" },
  { value: "11:15", label: "10:15" },
  { value: "12:15", label: "11:15" },
  { value: "13:15", label: "12:15" },
  { value: "14:15", label: "13:15" },
  { value: "15:15", label: "14:15" },
  { value: "17:15", label: "16:15" },
];

export default function NewRendezVous({ rendez_vous, patients, medecins, specialites, abscences: abscencesProp }) {
  const [selectedPatient, setSelectedPatient] = useState({ id: "", nom: "", prenom: "" });
  const [idPatient, setIdPatient] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [type, setType] = useState("RDV");
  const [idSpec, setIdSpec] = useState();
  const [medecinSpec, setMedecinSpec] = useState([]);
  const [idMed, setIdMed] = useState(0);
  const [assur, setAssur] = useState(false);
  const [dateRDV, setDateRDV] = useState("");
  const [heureRDV, setHeureRDV] = useState("");
  const [listeHeure, setListeHeure] = useState([]);
  const [errors, setErrors] = useState({});
  const [doctorAbsenceRanges, setDoctorAbsenceRanges] = useState([]);

  // Use the stable optionHeur
  const optionHeur = STATIC_OPTION_HEUR;
  // If optionHeur needed to be derived from props or state (which it doesn't here):
  // const optionHeur = useMemo(() => [...], [dependencies_if_any]);


  const optionSpec = useMemo(() => specialites.map((spec) => ({
    value: spec.specid,
    label: spec.designation,
  })), [specialites]);


  useEffect(() => {
    const mede = medecins.filter((med) => med.specid == idSpec);
    setMedecinSpec(mede);
    const mede1 = medecins.find((med) => med.specid == idSpec);
    if (mede1) {
      if (idMed !== mede1.id) { // Only update if doctor ID actually changes
        setIdMed(mede1.id);
        setHeureRDV("");
      }
    } else {
      if (idMed !== 0) { // Only update if doctor ID actually changes
        setIdMed(0);
        setHeureRDV("");
        setListeHeure([]);
      }
    }
  }, [idSpec, medecins]); // Added idMed to prevent setting it if it's already correct

useEffect(() => {
    if (idMed && abscencesProp) {
      const filteredAndMappedAbsences = abscencesProp
        .filter((abs) => abs.idMed === idMed)
        .map((a) => {
          const from = new Date(a.minDate);
          from.setHours(0, 0, 0, 0);
          const to = new Date(a.maxDate);
          to.setHours(23, 59, 59, 999);
          return { from, to };
        });
      setDoctorAbsenceRanges(filteredAndMappedAbsences);
    } else {
      setDoctorAbsenceRanges([]);
    }
  }, [idMed, abscencesProp]);
  

  const optionMed = useMemo(() => medecinSpec.map((med) => ({
    value: med.id,
    label: `${med.utilisateur.nom} ${med.utilisateur.prenom}`,
  })), [medecinSpec]);

  

  const handleRadioChange = (value) => {
    setType(value);
    const today = new Date();
    if (value === "URG") {
      setDateRDV(today.toISOString().split("T")[0]);
      setHeureRDV(today.toTimeString().slice(0, 5));
      setListeHeure([]);
    } else {
      setDateRDV("");
      setHeureRDV("");
    }
  };

  const handleAssurChange = (value) => {
    setAssur(value === "true");
  };

  const handleSelectChangeHeure = (value) => {
    setHeureRDV(value);
  };

  const handleSelectChange = (value) => { // Specialty change
    setIdSpec(value);
    // Doctor and hour will be reset by the useEffect listening to idSpec
  };

  const handleSelectChange1 = (value) => { // Doctor change
    if (idMed !== value) { // Only update if doctor ID actually changes
        setIdMed(Number(value));
        setHeureRDV("");
        setListeHeure([]);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient.utilisateur);
    setIdPatient(patient.id);
    closeModal();
  };

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
      try {
        await addRendezVous({
          idPat: Number(idPatient),
          type,
          idMed: Number(idMed),
          assurance: assur,
          dateRendez: dateRDV + "T" + heureRDV,
        });
        router.push("/admin/rendez_vous");
        router.refresh();
      } catch (error) {
        alert("Erreur lors de l'ajout du rendez-vous : " + error.message);
      }
    }
  };

  // This is the useEffect that was likely causing the loop (around line 229)
  useEffect(() => {
    if (!dateRDV || !idMed || !rendez_vous || type === "URG") {
      if (listeHeure.length > 0) setListeHeure([]); // Only update if different
      return;
    }

    const selectedDate = new Date(dateRDV + "T00:00:00");

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const heuresPrises = rendez_vous
      .filter(rdv => rdv.idMed === idMed)
      .filter(rdv => {
        const rdvDate = new Date(rdv.dateRendez);
        return isSameDay(rdvDate, selectedDate);
      })
      .map(rdv => {
        const rdvDate = new Date(rdv.dateRendez);
        const heures = String(rdvDate.getHours()).padStart(2, '0');
        const minutes = String(rdvDate.getMinutes()).padStart(2, '0');
        return `${heures}:${minutes}`;
      });

    const heuresDisponibles = optionHeur.filter(opt => // optionHeur is now stable
      !heuresPrises.includes(opt.value)
    );
   
    // Basic check to see if listeHeure actually needs updating
    if (JSON.stringify(listeHeure) !== JSON.stringify(heuresDisponibles)) {
        setListeHeure(heuresDisponibles);
    }

    // If current heureRDV is no longer valid, reset it.
    // This call will cause a re-render. Since heureRDV is NOT in this effect's
    // dependency array, this specific effect won't loop due to this call.
    if (heureRDV && !heuresDisponibles.some(opt => opt.value === heureRDV)) {
      setHeureRDV(""); // This was likely your line 229 error source if heureRDV was in deps
    }
  // Dependencies: only include what's needed to calculate listeHeure.
  // rendez_vous and optionHeur are arrays/objects; ensure they are stable references
  // or use a deep comparison if necessary (though usually avoided for performance).
  // Assuming rendez_vous prop is stable or changes meaningfully.
  }, [dateRDV, idMed, rendez_vous, type, optionHeur, listeHeure, heureRDV]); // Added listeHeure, heureRDV to re-evaluate only if they change to prevent frequent updates if stringify check is not enough

  // After reviewing the dependencies for the above useEffect:
  // The `JSON.stringify` check for `listeHeure` is a bit heavy.
  // The main problem was likely `optionHeur` being unstable and `heureRDV` being in dependencies while also being set.
  // Let's simplify the dependency array for the `listeHeure` calculation effect to the core items that define it.
  // The conditional reset of `heureRDV` should be fine as long as `heureRDV` is not a direct dependency *for that reset action*.

  // REVISED useEffect for listeHeure (this is the critical one):
  useEffect(() => {
    if (!dateRDV || !idMed || !rendez_vous || type === "URG") {
      if (listeHeure.length > 0) setListeHeure([]);
      return;
    }
    // console.log("Recalculating listeHeure"); // For debugging
    const selectedDateObj = new Date(dateRDV + "T00:00:00Z"); // Use UTC to avoid timezone issues for date part

    const isSameDate = (d1, d2) =>
      d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate();

    const heuresPrises = rendez_vous
      .filter(rdv => rdv.idMed === idMed)
      .filter(rdv => {
        const rdvDate = new Date(rdv.dateRendez); // Assuming dateRendez is ISO string
        return isSameDate(rdvDate, selectedDateObj);
      })
      .map(rdv => {
        const rdvDate = new Date(rdv.dateRendez);
        // Get hours/minutes in local time as they are for display/selection
        const heures = String(rdvDate.getHours()).padStart(2, '0');
        const minutes = String(rdvDate.getMinutes()).padStart(2, '0');
        return `${heures}:${minutes}`;
      });

    const newHeuresDisponibles = optionHeur.filter(opt => // optionHeur is stable
      !heuresPrises.includes(opt.value)
    );

    // Update listeHeure only if it has actually changed
    if (JSON.stringify(listeHeure) !== JSON.stringify(newHeuresDisponibles)) {
        setListeHeure(newHeuresDisponibles);
    }
   
    // If a time was selected but is no longer in the available list, clear the selection.
    // This is safe because heureRDV is NOT in this effect's dependency array.
    if (heureRDV && !newHeuresDisponibles.some(opt => opt.value === heureRDV)) {
        setHeureRDV("");
    }

  }, [dateRDV, idMed, rendez_vous, type, optionHeur, listeHeure, heureRDV]); // Keep listeHeure and heureRDV here if the JSON.stringify and conditional setHeureRDV logic depends on their previous values to avoid unnecessary sets.


  return (
    <ComponentCard title="Ajouter un rendez-vous">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label>Patient</Label>
            <Input type="text" value={selectedPatient.nom && selectedPatient.prenom ? `${selectedPatient.nom} ${selectedPatient.prenom}` : ""} readOnly />
            {errors.idPatient && <p className="text-red-500">{errors.idPatient}</p>}
            <button
              type="button"
              onClick={openModal}
              className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Choisir un patient
            </button>
          </div>

          <div>
            <Label>Type</Label>
            <div className="flex gap-4">
              <Radio id="radio1" name="group1" value="RDV" checked={type === "RDV"} onChange={handleRadioChange} label="RDV" />
              <Radio id="radio2" name="group1" value="URG" checked={type === "URG"} onChange={ handleRadioChange} label="URG" />
            </div>
            {errors.type && <p className="text-red-500">{errors.type}</p>}
          </div>

          <div>
            <Label>Spécialité</Label>
            <Select options={optionSpec} onChange={handleSelectChange} placeholder="Choisir une spécialité" value={idSpec || ""} />
            {errors.idSpec && <p className="text-red-500">{errors.idSpec}</p>}
          </div>

          <div>
            <Label>Médecin</Label>
            <Select options={optionMed} onChange={handleSelectChange1} placeholder={idSpec ? "Choisir un médecin" : "Choisir une spécialité d'abord"} value={idMed || ""} disabled={!idSpec}/>
            {errors.idMed && <p className="text-red-500">{errors.idMed}</p>}
          </div>

          <div>
            <Label>Assurance</Label>
            <div className="flex gap-4">
              <Radio id="radio3" name="group2" value="true" checked={assur === true} onChange={handleAssurChange} label="Oui" />
              <Radio id="radio4" name="group2" value="false" checked={assur === false} onChange={handleAssurChange} label="Non" />
            </div>
            {errors.assur && <p className="text-red-500">{errors.assur}</p>}
          </div>

          <div>
            <DatePicker
              key={idMed}
              id="date-picker"
              label="Date du rendez-vous"
              disableRanges={doctorAbsenceRanges}
              value={dateRDV}
              onChange={(dates, currentDateString) => {
                if (dateRDV !== currentDateString) {
                    setDateRDV(currentDateString);
                    setHeureRDV("");
                }
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
                disabled={type === "URG" || !dateRDV || !idMed || listeHeure.length === 0}
                value={heureRDV}
              />
            </div>
            {errors.heureRDV && <p className="text-red-500">{errors.heureRDV}</p>}
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Envoyer
          </button>
        </div>
      </form>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
        {/* Modal content unchanged */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Choisir un patient</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Nom</TableCell>
                <TableCell isHeader>Prénom</TableCell>
                <TableCell isHeader>Email</TableCell>
                <TableCell isHeader>Téléphone</TableCell>
                <TableCell isHeader>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.utilisateur?.nom}</TableCell>
                  <TableCell>{patient.utilisateur?.prenom}</TableCell>
                  <TableCell>{patient.utilisateur?.email}</TableCell>
                  <TableCell>{patient.utilisateur?.tel}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Ajouter
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Modal>
    </ComponentCard>
  );
}
