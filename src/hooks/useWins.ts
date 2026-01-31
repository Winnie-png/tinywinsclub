import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Win {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
  jarId: string | null;
}

interface DatabaseWin {
  id: string;
  text: string;
  mood: string;
  created_at: string;
  user_id: string;
  jar_id: string | null;
}

export function useWins(jarId?: string | null) {
  const { user } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wins from database on mount and when user/jarId changes
  const fetchWins = useCallback(async () => {
    if (!user) {
      setWins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from("wins")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Filter by jar if specified
    if (jarId) {
      query = query.eq("jar_id", jarId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching wins:", error);
      toast.error("Failed to load wins");
      setWins([]);
    } else {
      // Transform database format to app format
      const transformedWins: Win[] = (data as DatabaseWin[]).map((w) => ({
        id: w.id,
        text: w.text,
        mood: w.mood,
        createdAt: w.created_at,
        jarId: w.jar_id,
      }));
      setWins(transformedWins);
    }
    setLoading(false);
  }, [user, jarId]);

  useEffect(() => {
    fetchWins();
  }, [fetchWins]);

  // Save a new win - waits for database confirmation
  const saveWin = async (win: { text: string; mood: string; jarId?: string | null }): Promise<Win | null> => {
    if (!user) {
      toast.error("You must be logged in to save wins");
      return null;
    }

    const { data, error } = await supabase
      .from("wins")
      .insert({
        user_id: user.id,
        text: win.text,
        mood: win.mood,
        jar_id: win.jarId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving win:", error);
      toast.error("Failed to save win. Please try again.");
      return null;
    }

    const newWin: Win = {
      id: data.id,
      text: data.text,
      mood: data.mood,
      createdAt: data.created_at,
      jarId: data.jar_id,
    };

    // Update local state after successful save
    setWins((prev) => [newWin, ...prev]);
    return newWin;
  };

  // Delete a win - waits for database confirmation
  const deleteWin = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to delete wins");
      return false;
    }

    const { error } = await supabase
      .from("wins")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting win:", error);
      toast.error("Failed to delete win");
      return false;
    }

    // Update local state after successful delete
    setWins((prev) => prev.filter((w) => w.id !== id));
    return true;
  };

  return {
    wins,
    loading,
    saveWin,
    deleteWin,
    refetch: fetchWins,
  };
}
