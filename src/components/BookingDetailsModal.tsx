import React from 'react';
import { X } from 'lucide-react';
import { Booking } from '../types';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (booking?.profile.id_document_url) {
        try {
          const { data, error } = await supabase
            .storage
            .from('id-documents')
            .createSignedUrl(booking.profile.id_document_url, 3600); // URL valide pendant 1 heure

          if (error) {
            console.error('Error getting signed URL:', error);
            return;
          }

          setDocumentUrl(data.signedUrl);
        } catch (err) {
          console.error('Error:', err);
        }
      }
    };

    getSignedUrl();
  }, [booking?.profile.id_document_url]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Détails de la réservation
        </h2>

        <div className="space-y-6">
          {/* Informations du voyageur */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Informations du voyageur
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom complet</p>
                <p className="text-base text-gray-900">
                  {booking.profile.first_name} {booking.profile.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{booking.profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="text-base text-gray-900">{booking.profile.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Document d'identité</p>
                {booking.profile.id_document_url ? (
                  <div className="relative group" onClick={() => documentUrl && window.open(documentUrl, '_blank')}>
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={documentUrl || 'https://placehold.co/600x400?text=Chargement...'}
                        alt="Document d'identité"
                        className="w-full h-full object-contain rounded-lg border border-gray-200 shadow-sm transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x400?text=Document+non+disponible';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
                          Cliquer pour agrandir
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Aucun document fourni</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  ${booking.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {booking.status === 'pending' ? 'En attente' : ''}
                  {booking.status === 'approved' ? 'Approuvé' : ''}
                  {booking.status === 'rejected' ? 'Rejeté' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Détails des trajets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Détails des trajets
            </h3>
            <div className="space-y-4">
              {booking.journeys.map((journey, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mode de transport</p>
                      <p className="text-base text-gray-900">
                        {journey.transport_mode === 'train' && 'Train'}
                        {journey.transport_mode === 'plane' && 'Avion'}
                        {journey.transport_mode === 'personal-car' && 'Voiture personnelle'}
                        {journey.transport_mode === 'rental-car' && 'Location de voiture'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date et heure</p>
                      <p className="text-base text-gray-900">
                        {new Date(journey.departure_date).toLocaleDateString()} à {journey.departure_time}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lieu de départ</p>
                      <p className="text-base text-gray-900">{journey.departure_location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lieu d'arrivée</p>
                      <p className="text-base text-gray-900">{journey.arrival_location}</p>
                    </div>
                  </div>
                  {journey.comments && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Commentaires</p>
                      <p className="text-base text-gray-900">{journey.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Informations de réservation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Informations de réservation
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Date de création</p>
                <p className="text-base text-gray-900">
                  {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}