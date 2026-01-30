-- Create wins table for permanent storage
CREATE TABLE public.wins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '😊',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;

-- Users can view their own wins
CREATE POLICY "Users can view own wins"
ON public.wins
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own wins
CREATE POLICY "Users can create own wins"
ON public.wins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wins
CREATE POLICY "Users can delete own wins"
ON public.wins
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster user queries
CREATE INDEX idx_wins_user_id ON public.wins(user_id);
CREATE INDEX idx_wins_created_at ON public.wins(created_at DESC);