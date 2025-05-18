"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
// Assuming Badge, Pagination are correctly imported
import Pagination from "../Rendez_vous/Pagination";
import Link from "next/link";
import { useRouter } from 'next/navigation';
// Import necessary service functions
import {
  fetchMedecins,
  fetchArchivedMedecins,
  deleteMedecin, // Soft delete
  restoreMedecin
} from "@/services/MedecinService";
import { FaPlus, FaTrash, FaUndo } from "react-icons/fa"; // Import restore icon

const TableMedecin = () => { // Remove medecins prop
  const [displayedMedecins, setDisplayedMedecins] = useState([]); // State for currently shown data
  // --- CHANGE HERE: Initialize isLoading to true ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nonArchive'); // 'nonArchive' or 'archive'

  // --- Data Fetching Logic ---
  const loadMedecins = useCallback(async () => {
    // Set loading true only if it wasn't already (e.g., for re-fetches, not initial)
    // Correction: Always set it true at the start of a load operation
    setIsLoading(true);
    setError(null);
    // Keep resetting page, it makes sense when changing tabs/reloading
    setCurrentPage(1);
    try {
      let data;
      if (activeTab === 'nonArchive') {
        console.log("Fetching non-archived medecins...");
        data = await fetchMedecins();
      } else {
        console.log("Fetching archived medecins...");
        data = await fetchArchivedMedecins();
      }
      setDisplayedMedecins(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (err) {
      console.error("Failed to fetch medecins:", err);
      setError(err.message || "Failed to load data.");
      setDisplayedMedecins([]); // Clear data on error
    } finally {
      // This will run after try or catch finishes
      setIsLoading(false);
    }
  }, [activeTab]); // Dependency: re-run if activeTab changes

  // --- Fetch data on mount and when activeTab changes ---
  useEffect(() => {
    loadMedecins();
    // The dependency array ensures this runs when loadMedecins reference changes
    // which happens when activeTab changes due to useCallback's dependency.
  }, [loadMedecins]);

  // --- Pagination Logic ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Slice the dynamically fetched data
  const currentRows = displayedMedecins.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(displayedMedecins.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Navigation ---
  const goToNewMedecin = () => {
    router.push('/admin/medecins/newMedecin');
  };

  // --- Actions ---
  const handleDelete = async (id) => {
    if (!id) {
      console.error('ID de médecin manquant');
      return;
    }
    if (window.confirm("Voulez-vous vraiment archiver ce médecin ?")) { // Changed confirm message
      try {
        setIsLoading(true); // Indicate loading during delete
        await deleteMedecin(id); // This performs a soft delete (archive)
        await loadMedecins(); // Refetch the data for the current tab
      } catch (error) {
        console.error("Erreur d'archivage:", error);
        alert("Échec de l'archivage: " + error.message);
        setIsLoading(false); // Ensure loading stops on error
      }
      // No finally block needed here as loadMedecins handles setting isLoading to false on completion
    }
  };

  const handleRestore = async (id) => {
    if (!id) {
      console.error('ID de médecin manquant');
      return;
    }
    if (window.confirm("Voulez-vous vraiment restaurer ce médecin ?")) {
      try {
        setIsLoading(true); // Indicate loading during restore
        await restoreMedecin(id); // Call the restore function
        await loadMedecins(); // Refetch the data for the current tab (Archive)
      } catch (error) {
        console.error("Erreur de restauration:", error);
        alert("Échec de la restauration: " + error.message);
        setIsLoading(false); // Ensure loading stops on error
      }
       // No finally block needed here as loadMedecins handles setting isLoading to false on completion
    }
  };

  // --- Rendering ---
  return (
    <>
      {/* Button remains outside the loading area */}
      <button
        onClick={goToNewMedecin}
        className="bg-blue-600 text-white flex items-center gap-2 p-2 rounded hover:bg-blue-700 mb-4" // Added mb-4
        style={{ marginLeft: "auto" }} // Align button to the right more reliably
      >
        <FaPlus />
        Ajouter Médecin
      </button>

      {/* Tabs remain outside the loading area */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'nonArchive' ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('nonArchive')}
              type="button"
              role="tab"
              disabled={isLoading} // Disable tab switching while loading
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
              disabled={isLoading} // Disable tab switching while loading
            >
              Archivés
            </button>
          </li>
        </ul>
      </div>

      {/* Data display area */}
      <div className="overflow-x-auto">
        {/* Show Loading message first */}
        {isLoading && <p className="text-center py-4">Chargement...</p>}

        {/* Show Error message if loading is finished and there's an error */}
        {!isLoading && error && <p className="text-red-500 text-center py-4">Erreur: {error}</p>}

        {/* Show Table/Empty message only when loading is finished and there's no error */}
        {!isLoading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Nom</TableCell>
                  <TableCell isHeader>Prénom</TableCell>
                  <TableCell isHeader>Référence</TableCell>
                  <TableCell isHeader>Spécialité</TableCell>
                  <TableCell isHeader>Opérations</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((medecin) => (
                    <TableRow key={medecin.id}>
                      {/* Added checks for potentially missing nested data */}
                      <TableCell>{medecin.utilisateur?.nom ?? 'N/A'}</TableCell>
                      <TableCell>{medecin.utilisateur?.prenom ?? 'N/A'}</TableCell>
                      <TableCell>{medecin.reference ?? 'N/A'}</TableCell>
                      <TableCell>{medecin.specialite?.designation ?? 'N/A'}</TableCell>
                      <TableCell className="flex flex-wrap gap-2">
                        <Link href={`/admin/medecins/updateMedecin/${medecin.id}`}>
                          <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">
                            ✏️ Modifier
                          </button>
                        </Link>
                        {activeTab === 'nonArchive' ? (
                          <button
                            onClick={() => handleDelete(medecin.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            <FaTrash className="inline mr-1" /> Archiver
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(medecin.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                          >
                            <FaUndo className="inline mr-1" /> Restaurer
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Aucun médecin trouvé.
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
export default TableMedecin;