export type TransportMode = 'train' | 'personal-car' | 'rental-car' | 'plane';

export interface Journey {
  transportMode: TransportMode;
  departureDate: string;
  departureTime: string;
  departureLocation: string;
  arrivalLocation: string;
  comments: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  emergencyContact: string;
  email: string;
  bloodType: string;
  idDocument: File | null;
}

export interface Booking {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    id_document_url: string;
  };
  status: string;
  created_at: string;
  journeys: Journey[];
}