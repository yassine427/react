"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Pagination from "../Rendez_vous/Pagination";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  fetchPatients,
  fetchArchivedPatients,
  deletePatient,
  restorePatient
} from "@/services/PatientService";
import { FaPlus, FaTrash, FaUndo, FaEdit } from "react-icons/fa";

const TablePatient = () => {
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nonArchive');

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      let data;
      if (activeTab === 'nonArchive') {
        data = await fetchPatients();
      } else {
        data = await fetchArchivedPatients();
      }
      setDisplayedPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError(err.message || "Failed to load data.");
      setDisplayedPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = displayedPatients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(displayedPatients.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNewPatient = () => {
    router.push('/admin/patients/newPatient');
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('ID de patient manquant');
      return;
    }
    if (window.confirm("Voulez-vous vraiment archiver ce patient ?")) {
      try {
        setIsLoading(true);
        await deletePatient(id);
        await loadPatients();
      } catch (error) {
        console.error("Erreur d'archivage (patient):", error);
        alert("Échec de l'archivage du patient: " + error.message);
        setIsLoading(false);
      }
    }
  };

  const handleRestore = async (id) => {
    if (!id) {
      console.error('ID de patient manquant');
      return;
    }
    if (window.confirm("Voulez-vous vraiment restaurer ce patient ?")) {
      try {
        setIsLoading(true);
        await restorePatient(id);
        await loadPatients();
      } catch (error) {
        console.error("Erreur de restauration (patient):", error);
        alert("Échec de la restauration du patient: " + error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={goToNewPatient}
        className="bg-blue-600 text-white flex items-center gap-2 p-2 rounded hover:bg-blue-700 mb-4"
        style={{ marginLeft: "auto" }}
      >
        <FaPlus />
        Ajouter Patient
      </button>

      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'nonArchive' ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('nonArchive')}
              type="button"
              role="tab"
              disabled={isLoading}
            >
              Actifs
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'archive' ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('archive')}
              type="button"
              role="tab"
              disabled={isLoading}
            >
              Archivés
            </button>
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        {isLoading && <p className="text-center py-4">Chargement des patients...</p>}
        {!isLoading && error && <p className="text-red-500 text-center py-4">Erreur: {error}</p>}
        {!isLoading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Nom</TableCell>
                  <TableCell isHeader>Prénom</TableCell>
                  <TableCell isHeader>N° Dossier</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Téléphone</TableCell>
                  <TableCell isHeader>Opérations</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.utilisateur?.nom ?? 'N/A'}</TableCell>
                      <TableCell>{patient.utilisateur?.prenom ?? 'N/A'}</TableCell>
                      <TableCell>{patient.numDossier ?? 'N/A'}</TableCell>
                      <TableCell>{patient.utilisateur?.email ?? 'N/A'}</TableCell>
                      <TableCell>{patient.utilisateur?.tel ?? 'N/A'}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Link href={`/admin/patients/updatePatient/${patient.id}`}>
                          <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs flex items-center gap-1">
                            <FaEdit /> Modifier
                          </button>
                        </Link>
                        {activeTab === 'nonArchive' ? (
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs flex items-center gap-1"
                          >
                            <FaTrash /> Archiver
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(patient.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs flex items-center gap-1"
                          >
                            <FaUndo /> Restaurer
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Aucun patient trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TablePatient;
