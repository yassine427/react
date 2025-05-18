"use client"
import React, { useEffect, useState } from "react"
import Badge from "../ui/badge/Badge"
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons"
import { FaUserClock } from "react-icons/fa"
import { FaUserCheck, FaUserTie, FaCheckCircle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa"

export const Ecommercee = ({ RDVEff, RDVNonEff }) => {
  const [nbClient, setNbClient] = useState(0);
  const [nonEffRendezVous, setNonEffRendezVous] = useState(RDVNonEff);
  const [effRendezVous, setEffRendezVous] = useState(RDVEff);
  const [cout, setCout] = useState(0);    

  useEffect(() => {
    const rdvef = RDVEff;
    const rdvnonef = RDVNonEff;
  
    setNonEffRendezVous(rdvnonef);
    setEffRendezVous(rdvef);
  
    // Calcul correct du coût total
    const totalCout = rdvef.reduce((acc, rdv) => acc + (parseFloat(rdv.cout) || 0), 0);
    setCout(totalCout);
  }, [RDVNonEff, RDVEff]);
  


  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
{/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
          <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
  Total des clients
</span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {effRendezVous.length+nonEffRendezVous.length}
            </h4>
          </div>
      
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <FaUserClock color="orange" size={30} /> 

    
 

        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
          <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
  
              Clients Non Effectuée
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {nonEffRendezVous.length}
            </h4>
          </div>

      
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <FaUserCheck color="green" size={30} />
    
 

        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
          <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
            <h3>Clients  Effectuée</h3>
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {effRendezVous.length}
            </h4>
          </div>

         
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">

<FaMoneyBillWave className="text-green-600 w-6 h-6" />        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
          <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300">
Money</span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {cout}
            </h4>
          </div>
      
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  )
}
