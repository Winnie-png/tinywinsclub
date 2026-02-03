import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJars } from "@/hooks/useJars";
import { useAuth } from "@/contexts/AuthContext";
import { PaywallModal } from "@/components/PaywallModal";
import { 
  Plus, 
  Cookie, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Loader2,
  Lock,
  Crown 
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FREE_JAR_LIMIT = 1;

export default function Jars() {
  const { jars, loading, createJar, updateJar, deleteJar, activeJarId, setActiveJarId } = useJars();
  const { isPro } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newJarName, setNewJarName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const hasReachedLimit = !isPro && jars.length >= FREE_JAR_LIMIT;

  const handleCreateJar = async () => {
    if (!newJarName.trim()) {
      toast.error("Please enter a jar name");
      return;
    }

    const result = await createJar(newJarName.trim());
    if (result) {
      setNewJarName("");
      setIsCreating(false);
      toast.success("Jar created! 🫙");
    }
  };

  const handleStartCreate = () => {
    if (hasReachedLimit) {
      setShowPaywall(true);
      return;
    }
    setIsCreating(true);
  };

  const handleUpdateJar = async (id: string) => {
    if (!editingName.trim()) {
      toast.error("Please enter a jar name");
      return;
    }

    const success = await updateJar(id, editingName.trim());
    if (success) {
      setEditingId(null);
      setEditingName("");
      toast.success("Jar updated!");
    }
  };

  const handleDeleteJar = async (id: string) => {
    const success = await deleteJar(id);
    if (success) {
      toast.success("Jar deleted");
    }
  };

  const startEditing = (jar: { id: string; name: string }) => {
    setEditingId(jar.id);
    setEditingName(jar.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Jar limit reached!"
        message="Free users can only have 1 jar. Upgrade to Pro for unlimited jars."
      />

      <div className="pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Jars
            </h1>
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Organize your wins into categories
          </p>
          
          {/* Limit indicator for free users */}
          {!isPro && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              <Lock className="h-3 w-3" />
              {jars.length}/{FREE_JAR_LIMIT} free jars
            </div>
          )}
        </motion.div>

        {/* Create New Jar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div
                key="creating"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="card-cozy p-4"
              >
                <div className="flex gap-2">
                  <Input
                    value={newJarName}
                    onChange={(e) => setNewJarName(e.target.value)}
                    placeholder="Jar name..."
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateJar();
                      if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewJarName("");
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleCreateJar}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setNewJarName("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="button">
                <Button
                  onClick={handleStartCreate}
                  className="w-full rounded-2xl py-6 gap-2 shadow-lifted btn-bounce"
                  variant={hasReachedLimit ? "outline" : "default"}
                >
                  {hasReachedLimit ? (
                    <>
                      <Crown className="h-5 w-5 text-amber-500" />
                      Upgrade to Create More Jars
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create New Jar
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Jars List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {jars.map((jar, index) => (
              <motion.div
                key={jar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={`card-cozy p-4 ${
                  activeJarId === jar.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    className="text-3xl"
                  >
                    🫙
                  </motion.div>

                  {editingId === jar.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateJar(jar.id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                      />
                      <Button size="icon" onClick={() => handleUpdateJar(jar.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setActiveJarId(jar.id)}
                      >
                        <h3 className="font-display font-semibold text-foreground">
                          {jar.name}
                        </h3>
                        {activeJarId === jar.id && (
                          <span className="text-xs text-primary font-medium">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => startEditing(jar)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        {jars.length > 1 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Jar?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete "{jar.name}" and all wins inside it. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJar(jar.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {jars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">
                No jars yet. Create your first one!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
