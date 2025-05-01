export type MedicalStore = {
  _id: ObjectId;
  name: string;
  email: string;
  contact: string;
  profileImage: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  licenseNumber: string;
  licenseImage: string;
  isVerified: boolean;
};
