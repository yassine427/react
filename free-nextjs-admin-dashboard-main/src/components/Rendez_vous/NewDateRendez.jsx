  "use client";
  import React, { useEffect, useState } from "react";
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
  import { fetchAbscence } from "@/services/AbscenceService";

  export default function NewRendezVous({ rendez_vous,patients, medecins, specialites,abscences }) {
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
    const [showPassword, setShowPassword] = useState(false);

    const optionSpec = specialites.map((spec) => ({
      value: spec.specid,
      label: spec.designation,
    }));

 const optionHeur = [
  { value: "09:00", label: "08:00" },
  { value: "10:15", label: "09:15" },
  { value: "11:15", label: "10:15" },
  { value: "12:15", label: "11:15" },
  { value: "13:15", label: "12:15" },
  { value: "14:15", label: "13:15" },
  { value: "15:15", label: "14:15" },
  { value: "17:15", label: "16:15" },
];


    useEffect(() => {
      const mede = medecins.filter((med)=> med.specid==idSpec)
      
      setMedecinSpec(mede);
      const mede1 = medecins.find((med)=> med.specid==idSpec)
      if (mede1) {
          setIdMed(mede1.id);
        }
    }, [idSpec]);


    const optionMed = medecinSpec.map((med) => ({
      value: med.id,
      label: `${med.utilisateur.nom} ${med.utilisateur.prenom}`,
    }));

    const handleRadioChange = (value) => {
      setType(value);
      const today = new Date();

      if (value === "URG") {
        setDateRDV(today.toISOString().split("T")[0]);
        setHeureRDV(today.toTimeString().slice(0, 5));
      } else {
        setDateRDV("");
        setHeureRDV("");
      }
    };

    const handleAssurChange = (value) => {
      setAssur(value === "true"); // radio value is string, convert to boolean
    };

    const handleSelectChangeHeure = (value) => {
      setHeureRDV(value);
    };

    const handleSelectChange = (value) => {
      setIdSpec(value);
    };

    const handleSelectChange1 = (value) => {
      setIdMed(value);
    };

    const handleSelectPatient = (patient) => {
      setSelectedPatient(patient.utilisateur);
      setIdPatient(patient.id);
      closeModal();
    };
  const [absences, setAbsences] = useState([]); // Liste des absences du médecin

  useEffect(() => {
    if (idMed) {
      const absences2 = abscences
        .filter((abs) => abs.idMed === idMed)
        .map((a) => {
          const from = new Date(a.minDate);
          from.setHours(0, 0, 0, 0);
          
          const to = new Date(a.maxDate);
          to.setHours(23, 59, 59, 999);

          return { from, to };
        });
      setAbsences(absences2);
    }
    // Dans NewRendezVous
  console.log('Absences:', absences);
  }, [idMed, abscences]);


  const isDateDisabled = (date) => {
    return absences.some(abs => {
      const debut = new Date(abs.date_debut);
      const fin = new Date(abs.date_fin);
      const current = new Date(date);

      return current >= debut && current <= fin;
    });
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
useEffect(() => {
  if (!dateRDV || !idMed || !rendez_vous) return;
console.log("📅 Date sélectionnée :", dateRDV);
  console.log("🩺 ID médecin :", idMed);
  console.log("📋 Tous les rendez-vous :");
  console.table(rendez_vous.map(r => ({
    idMed: r.idMed,
    dateRendez: r.dateRendez,
    heure: new Date(r.dateRendez).toTimeString().slice(0, 5)
  })));
  // 1. Convertir la date sélectionnée en Date Tunisie (UTC+1)
  const selectedDate = new Date(`${dateRDV}T00:00:00`);
  selectedDate.setHours(selectedDate.getHours() + 1); // Compensation UTC → UTC+1

  // 2. Trouver les rendez-vous concernés
  const heuresPrises = rendez_vous
    .filter(rdv => {
      // Vérification médecin
      if (rdv.idMed !== idMed) return false;

      // Conversion date RDV UTC → Heure locale Tunisie
      const rdvDate = new Date(rdv.dateRendez);
      rdvDate.setHours(rdvDate.getHours() + 1); // Conversion manuelle UTC+1

      // Comparaison jour/mois/année
      return rdvDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
    })
    .map(rdv => {
      // Formatage de l'heure locale
      const rdvDate = new Date(rdv.dateRendez);
      rdvDate.setHours(rdvDate.getHours() + 1); // Conversion manuelle UTC+1
      return `${String(rdvDate.getHours()).padStart(2, '0')}:${String(rdvDate.getMinutes()).padStart(2, '0')}`;
    });

  // 3. Filtrer les heures disponibles
  const heuresDisponibles = optionHeur.filter(opt => 
    !heuresPrises.includes(opt.value)
  );

  console.log('🚩 Heures prises:', heuresPrises);
  console.log('✅ Heures disponibles :', heuresDisponibles.map(h => h.value));
  setListeHeure(heuresDisponibles);
}, [dateRDV, idMed, rendez_vous]);    


    return (
      <ComponentCard title="Ajouter un rendez-vous">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Patient</Label>
              <Input type="text" value={selectedPatient.nom + " " + selectedPatient.prenom} readOnly />
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
                <Radio id="radio2" name="group1" value="URG" checked={type === "URG"} onChange={handleRadioChange} label="URG" />
              </div>
              {errors.type && <p className="text-red-500">{errors.type}</p>}
            </div>

            <div>
              <Label>Spécialité</Label>
              <Select options={optionSpec} onChange={handleSelectChange} placeholder="Choisir une spécialité" />
              {errors.idSpec && <p className="text-red-500">{errors.idSpec}</p>}
            </div>

            <div>
              <Label>Médecin</Label>
              <Select options={optionMed} onChange={handleSelectChange1} placeholder="Choisir un médecin" />
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
    id="date-picker"
    label="Date du rendez-vous"
    disableRanges={absences}
 onChange={(dates, currentDateString) => {
              setDateRDV(currentDateString);
            }}  />


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

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Envoyer
            </button>
          </div>
        </form>

        {/* Modal Patient */}
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
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
