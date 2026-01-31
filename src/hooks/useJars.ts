import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Jar {
  id: string;
  name: string;
  createdAt: string;
}

interface DatabaseJar {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export function useJars() {
  const { user } = useAuth();
  const [jars, setJars] = useState<Jar[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJarId, setActiveJarId] = useState<string | null>(null);

  // Fetch jars from database
  const fetchJars = useCallback(async () => {
    if (!user) {
      setJars([]);
      setActiveJarId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("jars")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jars:", error);
      toast.error("Failed to load jars");
      setJars([]);
    } else {
      const transformedJars: Jar[] = (data as DatabaseJar[]).map((j) => ({
        id: j.id,
        name: j.name,
        createdAt: j.created_at,
      }));
      setJars(transformedJars);
      
      // Auto-select first jar if none selected
      if (transformedJars.length > 0 && !activeJarId) {
        setActiveJarId(transformedJars[0].id);
      }
    }
    setLoading(false);
  }, [user, activeJarId]);

  useEffect(() => {
    fetchJars();
  }, [fetchJars]);

  // Create a new jar
  const createJar = async (name: string = "My Win Jar"): Promise<Jar | null> => {
    if (!user) {
      toast.error("You must be logged in to create jars");
      return null;
    }

    const { data, error } = await supabase
      .from("jars")
      .insert({
        user_id: user.id,
        name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating jar:", error);
      toast.error("Failed to create jar. Please try again.");
      return null;
    }

    const newJar: Jar = {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
    };

    setJars((prev) => [newJar, ...prev]);
    setActiveJarId(newJar.id);
    return newJar;
  };

  // Update jar name
  const updateJar = async (id: string, name: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to update jars");
      return false;
    }

    const { error } = await supabase
      .from("jars")
      .update({ name })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating jar:", error);
      toast.error("Failed to update jar");
      return false;
    }

    setJars((prev) =>
      prev.map((j) => (j.id === id ? { ...j, name } : j))
    );
    return true;
  };

  // Delete a jar
  const deleteJar = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to delete jars");
      return false;
    }

    const { error } = await supabase
      .from("jars")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting jar:", error);
      toast.error("Failed to delete jar");
      return false;
    }

    setJars((prev) => prev.filter((j) => j.id !== id));
    
    // If deleted jar was active, switch to another
    if (activeJarId === id) {
      const remaining = jars.filter((j) => j.id !== id);
      setActiveJarId(remaining.length > 0 ? remaining[0].id : null);
    }
    
    return true;
  };

  // Ensure user has at least one jar (create default if needed)
  const ensureDefaultJar = async (): Promise<string | null> => {
    if (jars.length > 0) {
      return activeJarId || jars[0].id;
    }
    
    const newJar = await createJar("My Win Jar");
    return newJar?.id || null;
  };

  return {
    jars,
    loading,
    activeJarId,
    setActiveJarId,
    createJar,
    updateJar,
    deleteJar,
    ensureDefaultJar,
    refetch: fetchJars,
  };
}
