import { MedicalStore } from "./MedicalStore";

export interface Medicine {
  _id: string;
  store: MedicalStore;
  name: string;
  description: string;
  price: number;
  stock: number;
  prescriptionRequired: boolean;
  imageUrl: string;
}
