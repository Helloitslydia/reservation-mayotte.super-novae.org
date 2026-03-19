import React from 'react';
import { Upload } from 'lucide-react';
import { PersonalInfo } from '../types';

interface PersonalInfoFormProps {
  info: PersonalInfo;
  onUpdate: (field: keyof PersonalInfo, value: string | File | null) => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function PersonalInfoForm({ info, onUpdate }: PersonalInfoFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file && !ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Format de fichier non autorisé. Veuillez utiliser uniquement des fichiers PNG ou JPG.');
      e.target.value = ''; // Reset input
      return;
    }
    
    onUpdate('idDocument', file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            value={info.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={info.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact d'urgence
          </label>
          <input
            type="tel"
            value={info.emergencyContact}
            onChange={(e) => onUpdate('emergencyContact', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={info.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Groupe sanguin
          </label>
          <select
            value={info.bloodType}
            onChange={(e) => onUpdate('bloodType', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          >
            <option value="">Sélectionnez</option>
            {bloodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo de carte d'identité/passeport
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Télécharger un fichier</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">Formats acceptés : PNG, JPG uniquement (max 10MB)</p>
              {info.idDocument && (
                <p className="text-sm text-green-600">
                  Fichier sélectionné: {info.idDocument.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}