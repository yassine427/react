"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { FaUserSlash, FaUserClock, FaUserTimes } from "react-icons/fa";


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


const RendezVous = ({ RDVEff, RDVNonEff }) => {
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
      const rdvef=RDVEff;
      const rdvnonef=RDVNonEff;
      setNonEffRendezVous(rdvnonef);
      setEffRendezVous(rdvef);
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

 

 
  useEffect(() => {
    RDVNonEff=RDVNonEff.filter((pat)=>pat.id!==id)
  }, [RDVNonEff]);
 
  return (
    <>

    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
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
                    
                
                      
                    </TableCell>



                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(nonEffRendezVous.length / rowsPerPage)}
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
                totalPages={Math.ceil(effRendezVous.length / rowsPerPage1)}
                onPageChange={handlePageChange1}
              />
            </div>
          )}
        </div>
       

      </div>
      
    </>
  );
};


export default RendezVous   