
import React from "react";
import TablePatient from "@/components/Patient/TablePatient"; // Import the TablePatient component
export default function PatientPage() {
  return (
    <div>
     
      <h1 className="text-xl font-semibold mb-4">Liste des Patients</h1>
      <TablePatient />
    </div>
  );
}