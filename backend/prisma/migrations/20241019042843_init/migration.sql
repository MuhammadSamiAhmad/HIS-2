-- CreateTable
CREATE TABLE `Patient` (
    `patientID` INTEGER NOT NULL AUTO_INCREMENT,
    `PatientSSN` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `Smoker` BOOLEAN NOT NULL,
    `alcoholIntake` BOOLEAN NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `InsuranceCompany` VARCHAR(191) NOT NULL DEFAULT 'None',
    `InsuranceCoverage` VARCHAR(191) NOT NULL DEFAULT 'None',

    UNIQUE INDEX `Patient_PatientSSN_key`(`PatientSSN`),
    UNIQUE INDEX `Patient_email_key`(`email`),
    PRIMARY KEY (`patientID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
