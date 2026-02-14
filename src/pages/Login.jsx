import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, User, AlertCircle, Globe, Eye, EyeOff } from 'lucide-react';

export default function Login({ setAuth }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.login(credentials);
      const { access_token, role, admin_id, restaurant_id } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      if (role === "admin") localStorage.setItem("admin_id", admin_id);
      if (role === "restaurant") localStorage.setItem("restaurant_id", restaurant_id);

      setAuth(true);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 font-sans relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-900/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center">

          {/* Brand Identity */}
          <div className="mb-12 flex flex-col items-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-500/30 rotate-3 mb-6">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tightest leading-none uppercase italic">Access <span className="text-amber-500 italic-none">Portal</span></h1>
            <p className="mt-3 text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Enterprise Management OS</p>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="w-full bg-rose-50 border border-rose-100 p-4 mb-8 flex items-center rounded-2xl animate-shake">
              <AlertCircle className="h-5 w-5 text-rose-500 mr-3 shrink-0" />
              <p className="text-[11px] font-black text-rose-600 uppercase tracking-tight leading-none">{error}</p>
            </div>
          )}

          <form className="w-full space-y-6" onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Identity Field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-4">Credential Identity</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    required
                    className="input-premium pl-14 h-16 bg-slate-50/50"
                    placeholder="partner_id"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  />
                </div>
              </div>

              {/* Secure Field with Visibility Toggle */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-4">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="input-premium pl-14 pr-14 h-16 bg-slate-50/50"
                    placeholder="••••••••"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-300 hover:text-amber-500 hover:bg-amber-50 transition-all active:scale-90"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="btn-primary w-full h-16 rounded-[2rem] text-xs"
              >
                Authenticate Session
              </button>
            </div>
          </form>

          {/* secondary Navigation */}
          <div className="mt-12 w-full pt-10 border-t border-slate-50 flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Consumer Interface</span>
            <Link
              to="/browse"
              className="group flex items-center gap-2.5 px-6 md:px-8 py-3 bg-slate-50 hover:bg-slate-900 rounded-full transition-all duration-500 border border-slate-100 min-w-fit"
            >
              <Globe size={16} className="text-amber-600 group-hover:rotate-45 transition-transform" />
              <span className="text-[11px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest whitespace-nowrap">Browse Experience</span>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2025 INDIANRESTROS</p>
      </div>
    </div>
  );
}