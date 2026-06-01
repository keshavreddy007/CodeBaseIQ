import { motion } from "motion/react";
import { X, Users, RefreshCw, ShieldCheck } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAllUsers } from "../lib/firebase";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
}

export function AdminPanel({ isOpen, onClose, user }: AdminPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await getAllUsers().catch(err => {
        console.warn("getAllUsers fallback:", err);
        return [];
      });
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!user || (user.email?.toLowerCase() !== "reddykeshav0007@gmail.com" && user.email?.toLowerCase() !== "bloodygaming398@gmail.com")) return null;

  return (
    <>
      {isOpen && (
        <motion.div
          key="admin-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            className="bg-[#0a0a0c] border border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl max-w-4xl w-full h-[92vh] sm:h-[85vh] md:h-[80vh] flex flex-col shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-none">Admin Panel</h2>
                  <p className="text-xs text-zinc-500 mt-1">Superuser monitoring suite</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="p-2 px-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-zinc-300 text-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex border-b border-white/5 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none select-none shrink-0 gap-1 sm:gap-2">
              <button
                className="py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 border-brand-blue text-white"
              >
                <Users className="w-4 h-4" />
                Registered Users ({users.length})
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Content list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-500">
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
                  <p className="text-sm">Retrieving real-time Firestore database...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                              <Users className="w-5 h-5 text-zinc-500" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-white font-medium truncate text-sm">{u.displayName || "No Name"}</p>
                            <p className="text-zinc-500 text-xs truncate">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500 mt-2 space-y-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 font-mono">
                          <p className="truncate text-[10px]">UID: <span className="text-zinc-400">{u.uid}</span></p>
                          <p>Provider: <span className="text-zinc-400 capitalize">{u.provider?.replace('.com', '') || 'Password'}</span></p>
                          <p>Joined: <span className="text-zinc-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}</span></p>
                          <p>Last Login: <span className="text-zinc-400">{u.lastLogin?.toDate ? new Date(u.lastLogin.toDate()).toLocaleString() : 'Just now'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {users.length === 0 && !error && (
                    <div className="text-center text-zinc-500 mt-10">
                      No registered users found.
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
