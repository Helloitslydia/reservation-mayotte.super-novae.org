/*
  # Enable public access for transport bookings

  1. Changes
    - Remove auth dependency from profiles table
    - Add new primary key for profiles
    - Update foreign key references
    - Update RLS policies for public access

  2. Security
    - Enable RLS on all tables
    - Add policies for public access with appropriate restrictions
*/

-- Drop existing tables to rebuild schema
DROP TABLE IF EXISTS journeys;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS profiles;

-- Create profiles table without auth dependency
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journeys table
CREATE TABLE journeys (
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

-- Public policies for profiles
CREATE POLICY "Allow public to insert profiles"
  ON profiles FOR INSERT
  TO public
  WITH CHECK (true);

-- Public policies for bookings
CREATE POLICY "Allow public to insert bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

-- Public policies for journeys
CREATE POLICY "Allow public to insert journeys"
  ON journeys FOR INSERT
  TO public
  WITH CHECK (true);

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
CREATE INDEX idx_bookings_profile_id ON bookings(profile_id);
CREATE INDEX idx_journeys_booking_id ON journeys(booking_id);