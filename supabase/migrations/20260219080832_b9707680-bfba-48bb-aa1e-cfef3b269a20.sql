-- Drop existing permissive update policy on profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate with WITH CHECK that prevents users from changing their own is_pro value
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_pro = (SELECT p.is_pro FROM public.profiles p WHERE p.user_id = auth.uid())
);