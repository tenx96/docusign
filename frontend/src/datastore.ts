interface PatientInfo {
  name: string;
  email: string;
  userId: string;
}

export const PatientsList: PatientInfo[] = [
  {
    name: "John Doe",
    email: "johndoe@email.com",
    userId: "P1",
  },
  {
    name: "Jimmy",
    email: "jimmy@email.com",
    userId: "P2",
  },
  {
    name: "Jane Mary",
    email: "jane@email.com",
    userId: "P3",
  },
];

export const PatientsMap = PatientsList.reduce((acc, patient) => {
  acc[patient.userId] = patient;
  return acc;
}, {});
