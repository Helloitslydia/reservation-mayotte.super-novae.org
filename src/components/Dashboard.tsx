import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';
import { LogOut, Loader2 } from 'lucide-react';
import BookingDetailsModal from './BookingDetailsModal';

interface DashboardProps {
  onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          profiles (
            first_name,
            last_name,
            email,
            phone,
            id_document_url
          ),
          journeys (
            transport_mode,
            departure_date,
            departure_time,
            departure_location,
            arrival_location,
            comments
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Transform and validate the data
      const transformedBookings = (data || []).map(booking => ({
        id: booking.id,
        status: booking.status || 'pending',
        created_at: booking.created_at,
        profile: {
          first_name: booking.profiles?.first_name || '',
          last_name: booking.profiles?.last_name || '',
          email: booking.profiles?.email || '',
          phone: booking.profiles?.phone || '',
          id_document_url: booking.profiles?.id_document_url || ''
        },
        journeys: (booking.journeys || []).map(journey => ({
          transport_mode: journey.transport_mode,
          departure_date: journey.departure_date,
          departure_time: journey.departure_time,
          departure_location: journey.departure_location,
          arrival_location: journey.arrival_location,
          comments: journey.comments
        }))
      }));
      setBookings(transformedBookings);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
      console.error('Error updating booking status:', err);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      onSignOut();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord des réservations
          </h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voyageur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trajets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.profile.first_name} {booking.profile.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.profile.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.profile.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.journeys.map((journey, index) => (
                            <div key={index} className="mb-2">
                              <div className="font-medium">
                                {journey.departure_location} → {journey.arrival_location}
                              </div>
                              <div className="text-gray-500">
                                {new Date(journey.departure_date).toLocaleDateString()} à{' '}
                                {journey.departure_time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {booking.status === 'pending' ? 'En attente' : ''}
                          {booking.status === 'approved' ? 'Approuvé' : ''}
                          {booking.status === 'rejected' ? 'Rejeté' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={booking.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateBookingStatus(booking.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="pending">En attente</option>
                          <option value="approved">Approuver</option>
                          <option value="rejected">Rejeter</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </div>
    </div>
  );
}