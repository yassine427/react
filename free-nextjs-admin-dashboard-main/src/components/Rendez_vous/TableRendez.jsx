  "use client";
  import React, { useEffect, useState } from "react";
  import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

  import Badge from "../ui/badge/Badge";
  import Image from "next/image";
  import Pagination from "./Pagination"; // Assurez-vous d'importer votre composant Pagination
  import Label from "../form/Label";
  import Input from "../form/input/InputField";
  import * as Tabs from '@radix-ui/react-tabs';
  import { FaPlus } from "react-icons/fa6";
  import Link from "next/link";
  import { useRouter } from 'next/navigation';
  import { deleteRendezVous } from "@/services/RendezVousService";

  // Define the table data using the interface


  const RendezVous = ({ RDVEff, RDVNonEff,abscence }) => {
    const [nonEffRendezVous, setNonEffRendezVous] = useState(RDVNonEff);
    const [effRendezVous, setEffRendezVous] = useState(RDVEff);

    const router = useRouter();
    const [id, setId] = useState();
    const [activeTab, setActiveTab] = useState('profile');

    // Pagination pour les rendez-vous non effectués
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = nonEffRendezVous.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (page) => {
      if (page > 0 && page <= Math.ceil(RDVNonEff.length / rowsPerPage)) {
        setCurrentPage(page);
      }
    };


    
    // Mettez à jour les états quand les props changent
    useEffect(() => {
      setNonEffRendezVous(RDVNonEff);
      setEffRendezVous(RDVEff);
    }, [RDVNonEff, RDVEff]);

    // Pagination pour les rendez-vous effectués
    const [currentPage1, setCurrentPage1] = useState(1);
    const rowsPerPage1 = 3;
    const indexOfLastRow1 = currentPage1 * rowsPerPage1;
    const indexOfFirstRow1 = indexOfLastRow1 - rowsPerPage1;
    const currentRows1 = RDVEff.slice(indexOfFirstRow1, indexOfLastRow1);

    const handlePageChange1 = (page) => {
      if (page > 0 && page <= Math.ceil(RDVEff.length / rowsPerPage1)) {
        setCurrentPage1(page);
      }
    };

    const goToNewRendezVous = () => {
      router.push('/admin/rendez_vous/newRendezVous');
    };

    const deleterendez = async (id) => {
      if (!id) {
        console.error('ID de rendezvous manquant');
        return;
      }

      if (window.confirm("supprimer le rendezvous O/N")) {
        try {
          await deleteRendezVous(id);
          
          // Mise à jour locale immédiate
          setNonEffRendezVous(prev => prev.filter(item => item.id !== id));
          setEffRendezVous(prev => prev.filter(item => item.id !== id));
          router.push('/admin/rendez_vous');
          // Rafraîchissement des données côté serveur
          router.refresh();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Échec de la suppression");
        }
      }
    };
    useEffect(() => {
      RDVNonEff=RDVNonEff.filter((pat)=>pat.id!==id)
    }, [RDVNonEff]);
const [showModal, setShowModal] = useState(false);
const [filteredAbsences, setFilteredAbsences] = useState([]);

  useEffect(() => {
    console.log("ab :"+abscence)
  const today = new Date().toISOString().split('T')[0]; // Format: yyyy-mm-dd
  const filtered = abscence.filter(abs => abs.maxDate >= today);
  setFilteredAbsences(filtered);
      console.log("filter  :"+filtered)

}, [abscence]);

    return (
      <>
    


      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
     <button 
  onClick={() => setShowModal(true)}
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
>
  📋 Voir les absences
</button>

      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'profile' ? 'text-gray-800 border-gray-800' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('profile')}
                type="button"
                role="tab"
              >
                Non Effectué
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'dashboard' ? 'text-gray-800 border-gray-800' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('dashboard')}
                type="button"
                role="tab"
              >
                Effectué
              </button>
            </li>
          </ul>

          <div className="p-4 rounded-lg  bg-gray-50 dark:bg-gray-800">
            {activeTab === 'profile' && (
              <div className="overflow-x-auto"> 
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Patient</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Médecin</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Rendez-vous</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">État</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">assurance</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">cout</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Operation</TableCell>



                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {currentRows.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{order.patient.utilisateur.nom+" "+order.patient.utilisateur.prenom}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">{order.medecin.utilisateur.nom + ' ' + order.medecin.utilisateur.prenom}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">{ order.dateRendez.split('T')[0] + ' ' + ' ' +order.dateRendez.split('T')[1].slice(0,5)}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">
                          <Badge size="sm" color={order.etat === 'REPORTE' ? 'warning' : 'error'}>
                            {order.etat}
                          </Badge>  
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.type}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.assurance === true ? 'Oui' : 'Non'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.cout}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 flex items-center gap-2">
                        <Link href={`/admin/rendez_vous/updateRendezVous/${order.id}`} className="no-underline">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                          ✏️ Modifier
                        </button>
                      </Link>
                        <button onClick={() => {
                      if (order.id) {
                        deleterendez(order.id); // Passez l'ID si valide
                      } else {
                        console.error('ID de Rendez vous manquant');
                      }
                    }}className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                          🗑️ Supprimer
                        </button>
                        
                      </TableCell>



                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(RDVNonEff.length / rowsPerPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Patient</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Médecin</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Rendez-vous</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">État</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {currentRows1.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full"></div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{order.patient.utilisateur.nom}</span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{order.patient.utilisateur.prenom}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">{order.medecin.utilisateur.nom + ' ' + order.medecin.utilisateur.prenom}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">{ order.dateRendez.split('T')[0] + ' ' +' '+ order.dateRendez.split('T')[1].slice(0,5)}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start">
                          <Badge size="sm" color={order.etat === 'EFF' ? 'success' : 'error'}>
                            {order.etat}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.type}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.assurance}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500">{order.cout}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500"></TableCell>



                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage1}
                  totalPages={Math.ceil(RDVEff.length / rowsPerPage1)}
                  onPageChange={handlePageChange1}
                />
              </div>
            )}
          </div>
        

        </div>
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-[600px] max-h-[80vh] overflow-y-auto shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Liste des absences</h2>
        <button onClick={() => setShowModal(false)} className="text-red-500 text-lg">✖</button>
      </div>
      {filteredAbsences.length > 0 ? (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
                            <th className="p-2 border">Médecin</th>

              <th className="p-2 border">Date Min </th>
              <th className="p-2 border">Date Max</th>
            </tr>
          </thead>
          <tbody>
            {filteredAbsences.map((abs, index) => (
              <tr key={index}>
                <td className="p-2 border">{abs.medecin?.utilisateur?.nom} {abs.medecin?.utilisateur?.prenom}</td>
                              <td className="p-2 border">{new Date(abs.minDate).toISOString().split("T")[0]}</td>
<td className="p-2 border">{new Date(abs.maxDate).toISOString().split("T")[0]}</td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune absence à afficher.</p>
      )}
    </div>
  </div>
)}

      </>
    );
  };


  export default RendezVous   