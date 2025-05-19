import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Key } from "lucide-react";

type PropsType = {
 id: string;
  onChange?: (selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  disableDates?: (Date | string)[];
  disableRanges?: { from: Date; to: Date }[]; // Plages de dates à désactiver
};

export default function DatePicker({
  id,
  onChange,
  label,
  placeholder,
  disabled = false,
  disableDates = [],
  disableRanges = [],
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickrInstance.current = flatpickr(inputRef.current, {
      mode: "single",
      dateFormat: "Y-m-d",
      // Dans le composant DatePicker
disable: [
  ...disableDates,
  (date) => {
    return disableRanges.some(({ from, to }) => {
      const time = date.getTime();
      return time >= from.getTime() && time <= to.getTime();
    });
  }
],
      onChange,
      disableMobile: true,
    });

    return () => {
      flatpickrInstance.current?.destroy();
      flatpickrInstance.current = null;
    };
  }, [onChange, disableDates, disableRanges]);

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        ref={inputRef}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        className="border p-2 rounded"
      />
    </div>
  );
}
