// UserAddressCard.tsx
"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface UserAddressCardProps {
  medecin: {
    utilisateur: {
      adresse?: string;
      ville?: string;
      codePostal?: string;
      pays?: string;
    };
  };
}

export default function UserAddressCard({ medecin }: UserAddressCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const user = medecin.utilisateur;

  const handleSave = async () => {
    try {
      // Implémenter la logique de sauvegarde ici
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Adresse
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Pays
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.pays || "Non renseigné"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ville
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.ville || "Non renseigné"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Code Postal
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.codePostal || "Non renseigné"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Adresse
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.adresse || "Non renseignée"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {/* Icône d'édition */}
            Modifier
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier l'adresse
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Pays</Label>
                  <Input
                    name="pays"
                    type="text"
                    defaultValue={user.pays}
                  />
                </div>

                <div>
                  <Label>Ville</Label>
                  <Input
                    name="ville"
                    type="text"
                    defaultValue={user.ville}
                  />
                </div>

                <div>
                  <Label>Code Postal</Label>
                  <Input
                    name="codePostal"
                    type="text"
                    defaultValue={user.codePostal}
                  />
                </div>

                <div>
                  <Label>Adresse</Label>
                  <Input
                    name="adresse"
                    type="text"
                    defaultValue={user.adresse}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}