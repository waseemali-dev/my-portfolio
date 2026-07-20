import { useState, FormEvent } from "react";
import { Shield, Save, RefreshCw, Key, Database, Cloud } from "lucide-react";
import { getAdminCredentials, saveAdminCredentials } from "../../utils/authStorage";

export default function Settings() {
  const currentCreds = getAdminCredentials();
  const [username, setUsername] = useState(currentCreds.username);
  const [password, setPassword] = useState(currentCreds.password);
  const [confirmPassword, setConfirmPassword] = useState(currentCreds.password);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!username.trim()) {
      setMessage({ type: "error", text: "Username is required." });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setMessage({ type: "error", text: "Password must be at least 4 characters long." });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const success = saveAdminCredentials(username.trim(), password);
      if (success) {
        setMessage({ type: "success", text: "Administrative credentials updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update credentials. Please try again." });
      }
      setLoading(false);
    }, 400);
  };

  const handleFlushCache = async () => {
    try {
      setMessage({ type: "success", text: "Flushing caches and re-syncing with the server..." });
      
      // 1. Clear portfolio local storage content
      localStorage.removeItem("portfolio_content");
      
      // 2. Clear caches storage if available
      if (window.caches) {
        try {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(key => caches.delete(key)));
        } catch (e) {
          console.warn("Could not delete CacheStorage:", e);
        }
      }
      
      // 3. Unregister active service workers
      if (navigator.serviceWorker) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(reg => reg.unregister()));
        } catch (e) {
          console.warn("Could not unregister Service Workers:", e);
        }
      }

      setMessage({ type: "success", text: "All caches successfully flushed! Force reloading in 1.5 seconds..." });
      
      // 4. Reload page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to clear cache: " + (err.message || err) });
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Update Credentials</span>
          </h3>
          <p className="text-xs text-slate-400">
            Edit the username and passcode required to unlock the `/admin-dev` portal.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="admin"
            />
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>Default credentials are admin / admin123</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Update Password</span>
          </button>
        </div>
      </form>

      {/* Cache & Synchronization Management Section */}
      <div className="border-t border-slate-800/80 pt-6 mt-6 space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Cache & Synchronization</span>
          </h4>
          <p className="text-xs text-slate-400">
            Force clear your local browser storage caches, session states, and assets, then retrieve the latest synchronized version from the server. Use this if your changes are not appearing instantly on other tabs or devices.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-200">Force Flush All Caches</p>
            <p className="text-[10px] text-slate-400">Clears client storage, unregisters active service workers, clears cache databases, and performs a hard reload.</p>
          </div>
          <button
            type="button"
            onClick={handleFlushCache}
            className="px-4 py-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-slate-300 font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flush Cache & Reload</span>
          </button>
        </div>
      </div>

      {/* Production Persistent Cloud Storage (Firebase Firestore) Card */}
      <div className="border-t border-slate-800/80 pt-6 mt-6 space-y-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Production Persistent Database</span>
          </h4>
          <p className="text-xs text-slate-400">
            Your portfolio website supports automatic, persistent cloud synchronization using **Google Cloud Firebase Firestore**. When configured, any updates saved in the admin panel are immediately published to visitors without requiring code changes or manual Vercel redeployments.
          </p>
        </div>

        <div className="bg-slate-900/20 border border-slate-800/60 p-6 rounded-xl space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-cyan-500" />
              <span>How to Enable Instant Synchronization in Vercel</span>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Since serverless environments like Vercel have a read-only, temporary filesystem, local file storage resets frequently. Setting up a free Firestore database provides infinite, 100% stable cloud persistence.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-lg space-y-2.5">
              <p className="text-[11px] font-bold text-cyan-400">Step 1: Get Firebase Config</p>
              <ol className="list-decimal list-inside text-[10px] text-slate-400 space-y-1.5 pl-1 leading-relaxed">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Firebase Console</a> and create a free project.</li>
                <li>Under project settings, note your <strong>Project ID</strong>.</li>
                <li>Go to <strong>Build &gt; Firestore Database</strong> and click <strong>Create Database</strong> (enable test mode or configure rules for `configs/portfolio`).</li>
              </ol>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-lg space-y-2.5">
              <p className="text-[11px] font-bold text-cyan-400">Step 2: Add Environment Variables in Vercel</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Log into your Vercel Dashboard, select your project, navigate to <strong>Settings &gt; Environment Variables</strong>, and add:
              </p>
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-md font-mono text-[9px] text-slate-300 space-y-1.5 overflow-x-auto select-all">
                <div>FIREBASE_PROJECT_ID = <span className="text-cyan-400">"your-firebase-project-id"</span></div>
                <div>FIREBASE_API_KEY = <span className="text-cyan-400">"your-firebase-api-key"</span> <span className="text-slate-500">(optional, recommended)</span></div>
              </div>
            </div>

            <p className="text-[10px] text-emerald-400 font-medium">
              ✓ Once these environment variables are set in Vercel, the API instantly switches to persistent Cloud Database storage automatically. No code updates required!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
