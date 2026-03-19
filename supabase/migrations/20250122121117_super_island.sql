/*
  # Create storage bucket for ID documents

  1. Changes
    - Create storage bucket for ID documents with size and type restrictions
    - Set up public access policy for file uploads
*/

-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'id-documents',
  'id-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public uploads on objects table
CREATE POLICY "Allow public to upload files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'id-documents'
  AND LENGTH(name) > 1
  AND LENGTH(name) < 100
  AND (CASE WHEN metadata->>'size' IS NOT NULL 
       THEN (metadata->>'size')::int < 10485760 
       ELSE true
       END)
);