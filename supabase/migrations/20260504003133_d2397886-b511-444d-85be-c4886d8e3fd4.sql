
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  service_type text DEFAULT 'Passport',
  passport_type text DEFAULT 'Ordinary',
  appointment_date date,
  birth_date date,
  week int,
  month text,
  year int,
  phone_number text,
  email text,
  passport_status text DEFAULT 'Not started',
  application_no text,
  amount_paid numeric DEFAULT 0,
  date_of_issue date,
  gender text,
  served_by text,
  marital_status text,
  immigration_place text,
  work_type text,
  address text,
  remarks text,
  birth_certificate_url text,
  kebele_id_url text,
  national_id_url text,
  smart_services_needed boolean DEFAULT false,
  account_status text DEFAULT 'Active',
  membership_level text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update customers" ON public.customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete customers" ON public.customers FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
