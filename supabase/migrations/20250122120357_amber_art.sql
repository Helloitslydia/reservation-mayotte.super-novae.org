/*
  # Schema for Transport Booking System

  1. New Tables
    - `profiles`
      - Stores user profile information including emergency contacts and blood type
      - Links to auth.users for authentication
    - `bookings`
      - Main booking records
      - Links profiles to their transport bookings
    - `journeys`
      - Individual journey details within a booking
      - One booking can have multiple journeys

  2. Security
    - Enable RLS on all tables
    - Policies allow users to:
      - Read and update their own profile
      - Create and read their own bookings and journeys
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  emergency_contact text NOT NULL,
  email text NOT NULL,
  blood_type text NOT NULL,
  id_document_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journeys table
CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  transport_mode text NOT NULL,
  departure_date date NOT NULL,
  departure_time time NOT NULL,
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Journeys policies
CREATE POLICY "Users can view journeys from their bookings"
  ON journeys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = journeys.booking_id
      AND bookings.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create journeys for their bookings"
  ON journeys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.profile_id = auth.uid()
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_journeys_updated_at
  BEFORE UPDATE ON journeys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_profile_id ON bookings(profile_id);
CREATE INDEX IF NOT EXISTS idx_journeys_booking_id ON journeys(booking_id);