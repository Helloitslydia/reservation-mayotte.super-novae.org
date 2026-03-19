/*
  # Configure storage bucket for ID documents
  
  1. Changes
    - Create storage bucket for ID documents
    - Set file size limit to 10MB
    - Allow only image file types
    - Add security policies for public access
  
  2. Security
    - Enable public access for file uploads
    - Restrict file types to images only
    - Set reasonable file size limit
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES (
  'id-documents',
  'id-documents',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Set bucket configuration
UPDATE storage.buckets
SET file_size_limit = 10485760, -- 10MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg']::text[]
WHERE id = 'id-documents';

-- Create policy to allow public to upload files
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'id-documents'
  AND LENGTH(name) > 1
  AND LENGTH(name) < 100
);

-- Create policy to allow public to read files
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'id-documents');