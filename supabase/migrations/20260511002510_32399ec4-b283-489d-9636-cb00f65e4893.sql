
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS birth_place text,
  ADD COLUMN IF NOT EXISTS reference_number numeric,
  ADD COLUMN IF NOT EXISTS referral_details text,
  ADD COLUMN IF NOT EXISTS appointment_type text,
  ADD COLUMN IF NOT EXISTS coming_platform text,
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS sub_service_type text,
  ADD COLUMN IF NOT EXISTS receipt_passport_number_url text,
  ADD COLUMN IF NOT EXISTS receipt_passport_picture_url text,
  ADD COLUMN IF NOT EXISTS appointment_paper_url text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS passport_url text,
  ADD COLUMN IF NOT EXISTS court_document_url text,
  ADD COLUMN IF NOT EXISTS police_report_url text,
  ADD COLUMN IF NOT EXISTS receipt_url text;

ALTER TABLE public.customers ALTER COLUMN week TYPE text USING week::text;
