INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload customer documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Customer documents are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'customer-documents');

CREATE POLICY "Users can update own customer documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own customer documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);