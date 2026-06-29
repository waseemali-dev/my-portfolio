import { useState, FormEvent } from "react";
import { Shield, Save, RefreshCw, Key } from "lucide-react";
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
    </div>
  );
}
