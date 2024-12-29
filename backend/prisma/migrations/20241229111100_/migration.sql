-- CreateTable
CREATE TABLE `Patient` (
    `patientID` INTEGER NOT NULL AUTO_INCREMENT,
    `patientSSN` VARCHAR(191) NOT NULL DEFAULT '',
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL DEFAULT 'None',
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `smoker` BOOLEAN NOT NULL DEFAULT false,
    `alcoholIntake` BOOLEAN NOT NULL DEFAULT false,
    `bloodGroup` VARCHAR(191) NOT NULL DEFAULT 'None',
    `insuranceCompany` VARCHAR(191) NOT NULL DEFAULT 'None',
    `insuranceCoverage` VARCHAR(191) NOT NULL DEFAULT 'None',
    `allergies` VARCHAR(191) NOT NULL DEFAULT 'None',
    `chronicDiseases` VARCHAR(191) NOT NULL DEFAULT 'None',
    `personalImageURL` VARCHAR(191) NULL DEFAULT 'default.jpg',

    UNIQUE INDEX `Patient_patientSSN_key`(`patientSSN`),
    UNIQUE INDEX `Patient_phone_key`(`phone`),
    UNIQUE INDEX `Patient_email_key`(`email`),
    PRIMARY KEY (`patientID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnosis` (
    `diagnosisID` INTEGER NOT NULL AUTO_INCREMENT,
    `affectedArea` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT 'None',
    `diagnosedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patientId` INTEGER NOT NULL,
    `dentistSsn` VARCHAR(191) NOT NULL,
    `cost` DOUBLE NOT NULL DEFAULT 300,
    `visitId` INTEGER NOT NULL,

    INDEX `Diagnosis_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Diagnosis_patientId_fkey`(`patientId`),
    INDEX `Diagnosis_visitId_fkey`(`visitId`),
    PRIMARY KEY (`diagnosisID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `treatmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `treatmentType` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL DEFAULT 'None',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `dentistSsn` VARCHAR(191) NOT NULL,

    INDEX `Treatment_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Treatment_patientId_fkey`(`patientId`),
    PRIMARY KEY (`treatmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `dosage` DOUBLE NOT NULL,
    `dosageUnit` VARCHAR(191) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `prescriptionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patientId` INTEGER NOT NULL,
    `dentistSsn` VARCHAR(191) NOT NULL,

    INDEX `Medications_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Medications_patientId_fkey`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RadiologyImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `dentistComments` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `diagnosisId` INTEGER NOT NULL,

    UNIQUE INDEX `RadiologyImages_patientId_key`(`patientId`),
    UNIQUE INDEX `RadiologyImages_diagnosisId_key`(`diagnosisId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dentist` (
    `dentistSSN` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `specialization` VARCHAR(191) NOT NULL,
    `personalImageURL` VARCHAR(191) NULL DEFAULT 'default.jpg',

    UNIQUE INDEX `Dentist_dentistSSN_key`(`dentistSSN`),
    PRIMARY KEY (`dentistSSN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `day` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `dentistSsn` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`dentistSsn`, `day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `employeeSSN` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `personalImageURL` VARCHAR(191) NULL DEFAULT 'default.jpg',

    UNIQUE INDEX `Employee_employeeSSN_key`(`employeeSSN`),
    PRIMARY KEY (`employeeSSN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileLogin` (
    `loginId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `userType` VARCHAR(191) NOT NULL,
    `employeeSsn` VARCHAR(191) NULL,
    `dentistSsn` VARCHAR(191) NULL,
    `patientId` INTEGER NULL,

    UNIQUE INDEX `ProfileLogin_username_key`(`username`),
    UNIQUE INDEX `ProfileLogin_employeeSsn_key`(`employeeSsn`),
    UNIQUE INDEX `ProfileLogin_dentistSsn_key`(`dentistSsn`),
    UNIQUE INDEX `ProfileLogin_patientId_key`(`patientId`),
    PRIMARY KEY (`loginId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `billingId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalCost` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Unpaid',
    `visitId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `employeeSsn` VARCHAR(191) NULL,

    UNIQUE INDEX `Invoice_visitId_key`(`visitId`),
    INDEX `Invoice_employeeSsn_fkey`(`employeeSsn`),
    INDEX `Invoice_patientId_fkey`(`patientId`),
    PRIMARY KEY (`billingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `itemID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `equipmentImage` VARCHAR(191) NOT NULL DEFAULT 'inventoryDefaultImage.jpg',
    `currentTotalQuantity` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`itemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemPurchaseDetails` (
    `purchaseID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cost` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `employeeSsn` VARCHAR(191) NOT NULL,

    INDEX `ItemPurchaseDetails_employeeSsn_fkey`(`employeeSsn`),
    INDEX `ItemPurchaseDetails_itemID_fkey`(`itemID`),
    PRIMARY KEY (`purchaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NULL,
    `dentistSsn` VARCHAR(191) NULL,
    `serviceName` VARCHAR(191) NOT NULL,

    INDEX `Visit_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Visit_patientId_fkey`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consultation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `summary` VARCHAR(191) NOT NULL,
    `cost` DOUBLE NOT NULL DEFAULT 100,
    `dentistSsn` VARCHAR(191) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `visitId` INTEGER NOT NULL,

    INDEX `Consultation_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Consultation_patientId_fkey`(`patientId`),
    INDEX `Consultation_visitId_fkey`(`visitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Procedure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `cost` DOUBLE NOT NULL,
    `dentistSsn` VARCHAR(191) NOT NULL,
    `PatientId` INTEGER NOT NULL,
    `visitId` INTEGER NOT NULL,

    INDEX `Procedure_PatientId_fkey`(`PatientId`),
    INDEX `Procedure_dentistSsn_fkey`(`dentistSsn`),
    INDEX `Procedure_visitId_fkey`(`visitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medications` ADD CONSTRAINT `Medications_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medications` ADD CONSTRAINT `Medications_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyImages` ADD CONSTRAINT `RadiologyImages_diagnosisId_fkey` FOREIGN KEY (`diagnosisId`) REFERENCES `Diagnosis`(`diagnosisID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RadiologyImages` ADD CONSTRAINT `RadiologyImages_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileLogin` ADD CONSTRAINT `ProfileLogin_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileLogin` ADD CONSTRAINT `ProfileLogin_employeeSsn_fkey` FOREIGN KEY (`employeeSsn`) REFERENCES `Employee`(`employeeSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileLogin` ADD CONSTRAINT `ProfileLogin_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_employeeSsn_fkey` FOREIGN KEY (`employeeSsn`) REFERENCES `Employee`(`employeeSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPurchaseDetails` ADD CONSTRAINT `ItemPurchaseDetails_employeeSsn_fkey` FOREIGN KEY (`employeeSsn`) REFERENCES `Employee`(`employeeSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPurchaseDetails` ADD CONSTRAINT `ItemPurchaseDetails_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`itemID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_PatientId_fkey` FOREIGN KEY (`PatientId`) REFERENCES `Patient`(`patientID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`dentistSSN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
