import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Car, Lock, Mail, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email or username');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(email, password);
      showToast('Welcome back to Apex Motors Dealership Portal', 'success');
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
      showToast('Authentication failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-xl">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">
            APEX MOTORS
          </h1>
          <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest font-mono">
            Executive Dealership Portal
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-xl font-light text-white mb-1">Sign In</h2>
          <p className="text-xs opacity-40 mb-6 font-mono">
            Access inventory management & order operations
          </p>

          {errorMsg && (
            <div className="p-3 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@apexmotors.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>



          {/* Register Link */}
          <div className="mt-6 text-center text-xs opacity-50">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">
              Register Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
