import React, { useState, useEffect } from 'react';
import { Journey, PersonalInfo } from './types';
import { supabase } from './lib/supabase';
import JourneyForm from './components/JourneyForm';
import PersonalInfoForm from './components/PersonalInfoForm';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { Plane, Loader2 } from 'lucide-react';

const emptyJourney: Journey = {
  transportMode: 'train',
  departureDate: '',
  departureTime: '',
  departureLocation: '',
  arrivalLocation: '',
  comments: '',
};

const emptyPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  phone: '',
  emergencyContact: '',
  email: '',
  bloodType: '',
  idDocument: null,
};

function App() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [journeys, setJourneys] = useState<Journey[]>([{ ...emptyJourney }]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...emptyPersonalInfo });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const updateJourney = (index: number, field: keyof Journey, value: string) => {
    const updatedJourneys = journeys.map((journey, i) =>
      i === index ? { ...journey, [field]: value } : journey
    );
    setJourneys(updatedJourneys);
  };

  const addJourney = () => {
    setJourneys([...journeys, { ...emptyJourney }]);
  };

  const removeJourney = (index: number) => {
    setJourneys(journeys.filter((_, i) => i !== index));
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | File | null) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const uploadIdDocument = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('id-documents')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const saveToDatabase = async () => {
    try {
      // Upload ID document
      let idDocumentUrl = '';
      if (personalInfo.idDocument) {
        idDocumentUrl = await uploadIdDocument(personalInfo.idDocument);
      }

      // Create or update profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone: personalInfo.phone,
          emergency_contact: personalInfo.emergencyContact,
          email: personalInfo.email,
          blood_type: personalInfo.bloodType,
          id_document_url: idDocumentUrl
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          profile_id: profile.id,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create journeys
      const journeyData = journeys.map(journey => ({
        booking_id: booking.id,
        transport_mode: journey.transportMode,
        departure_date: journey.departureDate,
        departure_time: journey.departureTime,
        departure_location: journey.departureLocation,
        arrival_location: journey.arrivalLocation,
        comments: journey.comments
      }));

      const { error: journeysError } = await supabase
        .from('journeys')
        .insert(journeyData);

      if (journeysError) throw journeysError;

      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsSubmitting(true);
      setError(null);
      try {
        await saveToDatabase();
        alert('Réservation envoyée avec succès !');
        // Reset form
        setJourneys([{ ...emptyJourney }]);
        setPersonalInfo({ ...emptyPersonalInfo });
        setStep(1);
      } catch (err) {
        setError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isAuthenticated) {
    return <Dashboard onSignOut={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-8 mb-8">
            <img
              src="//c5ceaa4e16cfaa43c4e175e2d8739333.cdn.bubble.io/f1737549075297x225536579311563780/WhatsApp%20Image%202025-01-21%20at%2018.11.28.jpeg"
              alt="Logo 1"
              className="h-20 object-contain"
            />
            <img
              src="//c5ceaa4e16cfaa43c4e175e2d8739333.cdn.bubble.io/f1737549088925x260745126190657700/WhatsApp%20Image%202025-01-21%20at%2018.11.14.jpeg"
              alt="Logo 2"
              className="h-20 object-contain"
            />
            <button
              onClick={() => setShowAuthModal(true)}
              className="focus:outline-none"
            >
              <img
                src="//c5ceaa4e16cfaa43c4e175e2d8739333.cdn.bubble.io/f1737549126604x138366551156432480/logo-sn.jpeg"
                alt="Logo SN"
                className="h-20 object-contain hover:opacity-80 transition-opacity"
              />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Réservation de Transport pour le projet Mayotte
          </h1>
          <p className="mt-4 text-lg text-blue-800 font-medium bg-blue-50 p-3 rounded-lg">
            Envoyez votre demande à l'équipe Logistique de Super-Novae sur cette plateforme
          </p>
          <p className="mt-2 text-gray-600">
            {step === 1
              ? 'Étape 1: Planifiez vos trajets'
              : 'Étape 2: Vos informations personnelles'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              {journeys.map((journey, index) => (
                <JourneyForm
                  key={index}
                  journey={journey}
                  onUpdate={(field, value) => updateJourney(index, field, value)}
                  onRemove={() => removeJourney(index)}
                  isOnly={journeys.length === 1}
                />
              ))}

              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={addJourney}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Ajouter un trajet
                </button>
              </div>
            </>
          ) : (
            <PersonalInfoForm info={personalInfo} onUpdate={updatePersonalInfo} />
          )}

          {error && (
            <div className="mt-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {step === 1 ? 'Continuer' : (
                <>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la réservation'
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;
