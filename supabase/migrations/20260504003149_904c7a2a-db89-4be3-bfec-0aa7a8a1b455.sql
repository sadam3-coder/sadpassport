
DROP POLICY "Authenticated can insert customers" ON public.customers;
DROP POLICY "Authenticated can update customers" ON public.customers;
DROP POLICY "Authenticated can delete customers" ON public.customers;

CREATE POLICY "Users insert own customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users update own customers" ON public.customers FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users delete own customers" ON public.customers FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
