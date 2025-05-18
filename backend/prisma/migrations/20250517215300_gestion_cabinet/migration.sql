-- CreateTable
CREATE TABLE `Specialite` (
    `specid` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `designation` VARCHAR(50) NOT NULL,
    `cout` DOUBLE NOT NULL,

    UNIQUE INDEX `Specialite_designation_key`(`designation`),
    PRIMARY KEY (`specid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(30) NOT NULL,
    `prenom` VARCHAR(20) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `imageart` VARCHAR(255) NOT NULL,
    `sexe` VARCHAR(5) NOT NULL,
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `password` VARCHAR(200) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `tel` VARCHAR(20) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medecin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(20) NOT NULL,
    `specid` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `Medecin_reference_key`(`reference`),
    UNIQUE INDEX `Medecin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `numDossier` VARCHAR(20) NULL,
    `userId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `Patient_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rendezvous` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('RDV', 'URG') NOT NULL,
    `dateRendez` DATETIME(3) NOT NULL,
    `etat` ENUM('EFF', 'NONEFF', 'REPORTE') NOT NULL DEFAULT 'NONEFF',
    `idMed` INTEGER UNSIGNED NOT NULL,
    `idPat` INTEGER UNSIGNED NOT NULL,
    `assurance` BOOLEAN NOT NULL DEFAULT false,
    `cout` DECIMAL(10, 4) NOT NULL,

    UNIQUE INDEX `RendezVous_idMed_idClient_dateRendez_key`(`idMed`, `idPat`, `dateRendez`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvitationCode` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(7) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `usedAt` DATETIME(3) NULL,

    UNIQUE INDEX `InvitationCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `abscence` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `minDate` DATETIME(3) NOT NULL,
    `maxDate` DATETIME(3) NOT NULL,
    `idMed` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medecin` ADD CONSTRAINT `medecin_utilisateurid_foreign` FOREIGN KEY (`userId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medecin` ADD CONSTRAINT `specialite_medecinid_foreign` FOREIGN KEY (`specid`) REFERENCES `Specialite`(`specid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `patient_utilisateurid_foreign` FOREIGN KEY (`userId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rendezvous` ADD CONSTRAINT `rendezvous_medecinid_foreign` FOREIGN KEY (`idMed`) REFERENCES `Medecin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rendezvous` ADD CONSTRAINT `rendezvous_patientid_foreign` FOREIGN KEY (`idPat`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `abscence` ADD CONSTRAINT `abscence_medecinid_foreign` FOREIGN KEY (`idMed`) REFERENCES `Medecin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
