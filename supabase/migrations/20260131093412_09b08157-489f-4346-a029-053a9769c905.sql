-- Create jars table
CREATE TABLE public.jars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Win Jar',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jars
ALTER TABLE public.jars ENABLE ROW LEVEL SECURITY;

-- RLS policies for jars
CREATE POLICY "Users can view own jars"
ON public.jars FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own jars"
ON public.jars FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jars"
ON public.jars FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jars"
ON public.jars FOR DELETE
USING (auth.uid() = user_id);

-- Add jar_id column to wins table
ALTER TABLE public.wins
ADD COLUMN jar_id UUID REFERENCES public.jars(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_jars_user_id ON public.jars(user_id);
CREATE INDEX idx_wins_jar_id ON public.wins(jar_id);