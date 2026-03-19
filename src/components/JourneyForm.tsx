import React from 'react';
import { Plane, Train, Car, CarTaxiFront } from 'lucide-react';
import { Journey, TransportMode } from '../types';

interface JourneyFormProps {
  journey: Journey;
  onUpdate: (field: keyof Journey, value: string) => void;
  onRemove: () => void;
  isOnly: boolean;
}

const transportModes: { value: TransportMode; label: string; icon: React.ReactNode }[] = [
  { value: 'train', label: 'Train', icon: <Train className="w-5 h-5" /> },
  { value: 'personal-car', label: 'Voiture personnelle', icon: <Car className="w-5 h-5" /> },
  { value: 'rental-car', label: 'Location de voiture', icon: <CarTaxiFront className="w-5 h-5" /> },
  { value: 'plane', label: 'Avion', icon: <Plane className="w-5 h-5" /> },
];

export default function JourneyForm({ journey, onUpdate, onRemove, isOnly }: JourneyFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode de transport
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {transportModes.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate('transportMode', value)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  journey.transportMode === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {icon}
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de départ
          </label>
          <input
            type="date"
            value={journey.departureDate}
            onChange={(e) => onUpdate('departureDate', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heure de départ
          </label>
          <input
            type="time"
            value={journey.departureTime}
            onChange={(e) => onUpdate('departureTime', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu de départ
          </label>
          <input
            type="text"
            value={journey.departureLocation}
            onChange={(e) => onUpdate('departureLocation', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu d'arrivée
          </label>
          <input
            type="text"
            value={journey.arrivalLocation}
            onChange={(e) => onUpdate('arrivalLocation', e.target.value)}
            className="w-full h-11 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3"
            required
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentaires (ex: bagages)
          </label>
          <textarea
            value={journey.comments}
            onChange={(e) => onUpdate('comments', e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
            rows={3}
            required
          />
        </div>
      </div>

      {!isOnly && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Supprimer ce trajet
        </button>
      )}
    </div>
  );
}