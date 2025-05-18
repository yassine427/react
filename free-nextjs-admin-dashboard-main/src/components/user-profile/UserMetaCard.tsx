"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

interface UserMetaCardProps {
  medecin: {
    id: string | number;
    utilisateur: {
      nom: string;
      prenom: string;
      email: string;
      imageart: string;
      tel: string;
      role: string;
    };
    specialite?: {
      nom: string;
    };
  };
}

export default function UserMetaCard({ medecin }: UserMetaCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const user = medecin.utilisateur;

  const handleSave = async () => {
    try {
      // Ici vous devrez implémenter l'appel API pour la mise à jour
      // Exemple avec une fonction hypothetique updateMedecin :
      // await updateMedecin(medecin.id, updatedData);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user.imageart || "/images/user/default-avatar.jpg"}
                alt={`${user.prenom} ${user.nom}`}
                className="object-cover"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.prenom} {user.nom}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
                {medecin.specialite && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {medecin.specialite.nom}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {/* Les liens sociaux peuvent être dynamisés si ajoutés au schéma */}
              {/* Conservez cette partie si vous ajoutez les liens sociaux plus tard */}
              {/* ... */}
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
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations personnelles
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informations personnelles
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Prénom</Label>
                    <Input
                      type="text"
                      name="prenom"
                      defaultValue={user.prenom}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nom</Label>
                    <Input type="text" name="nom" defaultValue={user.nom} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input type="email" name="email" defaultValue={user.email} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Téléphone</Label>
                    <Input type="tel" name="tel" defaultValue={user.tel} />
                  </div>

                  <div className="col-span-2">
                    <Label>Rôle</Label>
                    <Input type="text" name="role" defaultValue={user.role} />
                  </div>
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