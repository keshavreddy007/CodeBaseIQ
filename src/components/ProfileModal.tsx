import { motion } from "motion/react";
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  Link2,
  Loader2
} from "lucide-react";
import { User as FirebaseUser, updateProfile } from "firebase/auth";
import { logOut, saveUserToDb } from "../lib/firebase";
import { useState, useEffect, useRef } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  onProfileUpdated?: () => void;
}

export function ProfileModal({ isOpen, onClose, user, onProfileUpdated }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with user properties when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
      setSuccessMsg("");
      setErrorMsg("");
      setIsEditing(false);
    }
  }, [user, isOpen]);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await logOut();
      onClose();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const AVATAR_PRESETS = [
    { name: "Cyber-Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberBot&backgroundColor=0284c7" },
    { name: "Terminal Pixel", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Terminal&backgroundColor=1f2937" },
    { name: "Hacker Explorer", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hacker&backgroundColor=7c3aed" },
    { name: "Code Shapes", url: "https://api.dicebear.com/7.x/shapes/svg?seed=CodeNerd&backgroundColor=0d9488" },
    { name: "Creative Initials", url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName || user.email?.split('@')[0] || 'User')}&backgroundColor=ea580c` },
    { name: "Identicon Flow", url: "https://api.dicebear.com/7.x/identicon/svg?seed=Cloud&backgroundColor=059669" }
  ];

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      setPhotoURL(base64Url);
      setSuccessMsg("Custom profile picture uploaded successfully!");
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      setErrorMsg("Please enter a valid image URL.");
      return;
    }
    setPhotoURL(customUrlInput.trim());
    setSuccessMsg("Custom URL applied as preview!");
    setErrorMsg("");
  };

  const handleSaveChanges = async () => {
    if (!displayName.trim()) {
      setErrorMsg("Display name cannot be blank.");
      return;
    }

    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Update Profile in Firebase Auth
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: photoURL
      });

      // 2. Persist state changes in Firestore database users collection
      await saveUserToDb(user);

      // 3. Trigger immediate state updates in Parent UI (Navbar / App)
      if (onProfileUpdated) {
        onProfileUpdated();
      }

      setSuccessMsg("Your profile and avatar settings saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const creationTime = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      }) 
    : "Unknown date";

  const containerVariants: any = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.96, 
      y: 15,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div
          key="profile-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#08080c] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
          >
            {/* Ambient colorful glow backdrop inside card */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-blue/15 to-transparent pointer-none" />

            {/* Header section */}
            <div className="p-6 border-b border-white/5 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button 
                    onClick={() => { setIsEditing(false); setSuccessMsg(""); setErrorMsg(""); }}
                    className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-blue" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">My Workspace Account</h3>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main scrollable view contents */}
            <div className="p-6 sm:p-7 overflow-y-auto custom-scrollbar relative z-10 flex-1 space-y-6">
              
              {/* Feedback messages */}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* VIEW MODE: User profile preview */}
              {!isEditing ? (
                <div className="space-y-6">
                  
                  {/* Account Hero Card with custom large avatar ring */}
                  <div className="flex flex-col items-center py-4 bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="text-[9px] bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-bold rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                        FREE EDITION
                      </span>
                    </div>

                    <div className="relative group mb-3 mt-2">
                      <div className="absolute -inset-1.5 bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet rounded-full opacity-40 blur-md pointer-events-none" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet p-[2px] relative">
                        <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                          {photoURL ? (
                            <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-8 h-8 text-zinc-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {displayName || "CodeBaseIQ Developer"}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wide mt-1">UUID: {user.uid.substring(0, 8)}...</span>
                  </div>

                  {/* Settings specs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-colors">
                      <div className="p-2 rounded-xl bg-brand-blue/10">
                        <Mail className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Email Account</span>
                        <span className="text-xs text-zinc-300 font-medium truncate">{user.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-colors">
                      <div className="p-2 rounded-xl bg-brand-violet/10">
                        <Calendar className="w-4 h-4 text-brand-violet" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Member Since</span>
                        <span className="text-xs text-zinc-300 font-medium">{creationTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-colors">
                      <div className="p-2 rounded-xl bg-brand-cyan/10">
                        <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Security Status</span>
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          Verified Safe <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Profile Settings toggler */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-white text-xs font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-lg uppercase tracking-wider"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Nickname & Avatar
                  </button>

                  <div className="h-px bg-white/5 my-4" />

                  {/* Logout Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-500/10 group cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Sign Out from Workspace
                  </button>

                </div>
              ) : (
                /* EDIT MODE: User profile settings edit form with picture uploads & preset grid */
                <div className="space-y-5">
                  
                  {/* Nickname editor input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">Edit Nickname / Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. CodeWizard_99"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  {/* Profile Image Customizer */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">Avatar Selection Engine</label>
                    
                    {/* Live Preview Ring */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet p-[2px] relative shrink-0">
                        <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                          {photoURL ? (
                            <img src={photoURL} alt="Preview Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-6 h-6 text-zinc-500" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1 bg-brand-blue rounded-full border border-black text-white">
                          <Camera className="w-2.5 h-2.5" />
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-bold text-zinc-300">Avatar Live Preview</h5>
                        <p className="text-[10px] text-zinc-500 mt-1">Select an item below or drag a custom profile picture file.</p>
                      </div>
                    </div>

                    {/* Settings Tabs (Presets / Upload / URL) */}
                    <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('presets'); setSuccessMsg(""); setErrorMsg(""); }}
                        className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'presets' ? 'bg-brand-blue text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('upload'); setSuccessMsg(""); setErrorMsg(""); }}
                        className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'upload' ? 'bg-brand-blue text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('url'); setSuccessMsg(""); setErrorMsg(""); }}
                        className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'url' ? 'bg-brand-blue text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Image URL
                      </button>
                    </div>

                    {/* Tab 1: Presets grid */}
                    {activeTab === 'presets' && (
                      <div className="grid grid-cols-3 gap-2 p-1 bg-black/25 rounded-xl border border-white/5">
                        {AVATAR_PRESETS.map((preset, i) => {
                          const isSelected = photoURL === preset.url;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setPhotoURL(preset.url);
                                setSuccessMsg(`Selected preset: ${preset.name}`);
                                setErrorMsg("");
                              }}
                              className={`p-2 rounded-lg border transition-all hover:bg-white/[0.02] flex flex-col items-center gap-1.5 cursor-pointer ${isSelected ? 'border-brand-blue bg-brand-blue/10' : 'border-white/5'}`}
                            >
                              <img src={preset.url} alt={preset.name} className="w-10 h-10 object-cover rounded-full" referrerPolicy="no-referrer" />
                              <span className="text-[9px] text-zinc-500 truncate max-w-full font-mono">{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Tab 2: Native drag and drop / File upload */}
                    {activeTab === 'upload' && (
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-xl border border-dashed text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          dragActive 
                            ? "border-brand-blue bg-brand-blue/5" 
                            : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <UploadCloud className="w-7 h-7 text-zinc-400 animate-pulse" />
                        <h6 className="text-xs font-semibold text-zinc-300">Drag & Drop file or click to choose</h6>
                        <p className="text-[9px] text-zinc-500">Supports JPEG, PNG, or WebP. Limit 2MB.</p>
                      </div>
                    )}

                    {/* Tab 3: Paste Custom URL */}
                    {activeTab === 'url' && (
                      <div className="p-3.5 rounded-xl border border-white/5 bg-black/25 flex flex-col gap-2.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://example.com/images/avatar.png"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomUrl}
                            className="bg-brand-blue hover:bg-brand-blue/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center justify-center gap-1"
                          >
                            <Link2 className="w-3.5 h-3.5" /> Preview
                          </button>
                        </div>
                        <p className="text-[9.5px] text-zinc-500 italic leading-relaxed">
                          Paste any secure URL image address (HTTPS) from hosting websites (e.g. Imgur, Unsplash, Google Photos).
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Lower action block */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setSuccessMsg(""); setErrorMsg(""); }}
                      disabled={isSaving}
                      className="flex-1 py-3 text-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-45"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45 shadow-lg shadow-brand-blue/10"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 mr-1" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
