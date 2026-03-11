
ALTER TABLE public.profiles 
ADD COLUMN pro_expires_at timestamp with time zone DEFAULT NULL;

-- Create audit log table for pro status changes
CREATE TABLE public.pro_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  old_expires_at timestamp with time zone,
  new_expires_at timestamp with time zone,
  payment_reference text,
  amount_kobo integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pro_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
ON public.pro_audit_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
