"use client";
import React, { useState } from "react";
import DatePicker from "../form/date-picker";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";

// Le parent va te donner une fonction "onDateChange"
function DateRendez({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();

  const handleDateChange = (dates, currentDateString) => {
    setSelectedDate(currentDateString);
    console.log({ dates, currentDateString });

    if (onDateChange) {
      onDateChange(currentDateString); // envoyer la date au parent
    }
  };
  const goToNewRendezVous = () => {
    router.push('/admin/rendez_vous/newRendezVous');
  };
  return (
    <div className="flex items-end gap-4"> {/* flex pour aligner sur la même ligne + gap pour l'espace */}
      <div style={{ width: "200px" }}>
        <DatePicker
          id="date-picker"
          label="Date Picker Input"
          placeholder="Select a date"
          onChange={handleDateChange}
          style={{ width: "100%" }}
        />
      </div>
      
      <button
        onClick={goToNewRendezVous}
        className="bg-blue-600 text-white flex items-center  gap-2 p-2 rounded hover:bg-blue-700"
        style={{marginLeft:"70%"}}
      >
        <FaPlus />
        Ajouter
      </button>
    </div>
  );
  
}

export default DateRendez;
