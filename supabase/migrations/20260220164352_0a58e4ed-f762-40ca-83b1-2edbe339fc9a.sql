
-- Add CHECK constraints for input validation on wins and jars tables
ALTER TABLE public.wins
ADD CONSTRAINT wins_text_length CHECK (char_length(text) > 0 AND char_length(text) <= 280);

ALTER TABLE public.jars
ADD CONSTRAINT jars_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100);
