import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../admin/components/Button';
import Input from '../admin/components/Input';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validatePassword = (pass) => {
    const hasLength = pass.length >= 12;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      isValid: hasLength && hasUpper && hasLower && hasNumber && hasSymbol,
      checks: { hasLength, hasUpper, hasLower, hasNumber, hasSymbol }
    };
  };

  const checks = validatePassword(formData.newPassword).checks;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!validatePassword(formData.newPassword).isValid) {
      setError('Password does not meet security requirements.');
      return;
    }

    setIsLoading(true);
    try {
      // API Call Mockup
      // const response = await fetch('/api/auth/change-password', { ... });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
      setSuccess(true);
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 p-10 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Password Secured!</h2>
          <p className="text-slate-500 font-medium mb-8">Your account security has been updated. Redirecting to your dashboard...</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full animate-progress-fast"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-xl w-full grid md:grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 overflow-hidden border border-slate-100">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Your Account</h1>
            <p className="text-slate-500 font-medium leading-relaxed">To complete your onboarding, please update your temporary password to a secure one.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Current Temporary Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
              />

              <div className="relative">
                <Input
                  label="New Strong Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="Create new password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Repeat new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security Requirements</p>
              <div className="grid grid-cols-2 gap-3">
                <RequirementItem met={checks.hasLength} text="12+ Characters" />
                <RequirementItem met={checks.hasUpper} text="Uppercase Letter" />
                <RequirementItem met={checks.hasLower} text="Lowercase Letter" />
                <RequirementItem met={checks.hasNumber} text="Number (0-9)" />
                <RequirementItem met={checks.hasSymbol} text="Special Symbol" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-lg group"
            >
              {isLoading ? 'Updating Security...' : (
                <span className="flex items-center gap-2">
                  Update Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${met ? 'text-green-600' : 'text-slate-400'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-slate-300'}`}></div>
    {text}
  </div>
);

export default ChangePassword;
