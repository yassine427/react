"use client";
import React, { useState, useEffect } from "react";
import TableMedecin from "@/components/Medecin/TableMedecin";  // Import the TableMedecin component
import { fetchMedecins } from "@/services/MedecinService";  // Assuming you have a service to fetch Medecin data
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/router";
const MedecinPage = () => {
  const [medecins, setMedecins] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMedecins(); 
        setMedecins(data);
      } catch (error) {
        console.error("Error fetching Médecins:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Liste des Médecins</h1>
      {/* Pass the fetched medecins to the TableMedecin component */}
      <TableMedecin medecins={medecins} />
    </div>
  );
};
export default MedecinPage;
