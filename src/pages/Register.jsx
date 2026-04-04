import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, FileText, ArrowRight, User, AtSign, Mail, Lock, ShieldCheck } from 'lucide-react';
import { registerSchema } from '../lib/validations/auth';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    document.title = 'Sign Up - CollabDocs';
  }, []);

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const parsed = registerSchema.safeParse(registerData);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await signup(
        parsed.data.fullName,
        parsed.data.username,
        parsed.data.email,
        parsed.data.password,
      );
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Sign up error', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg py-3 pl-11 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm';

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="w-full max-w-[480px] z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 bg-primary-container p-3 rounded-xl shadow-lg shadow-primary-container/20">
            <FileText size={28} className="text-on-primary-container" fill="currentColor" />
          </div>
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface mb-1">
            CollabDocs
          </h1>
          <p className="text-on-surface-variant/80 text-sm tracking-wide">
            The Cinematic Workspace
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-high/40 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-8 md:p-10 shadow-2xl">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-1">
            Create your account
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Join thousands of teams crafting beautiful documents.
          </p>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterInputChange}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              {fieldErrors.fullName?.[0] && (
                <p className="text-sm text-error">{fieldErrors.fullName[0]}</p>
              )}
            </div>

            {/* Username + Email grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                  Username
                </label>
                <div className="relative">
                  <AtSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterInputChange}
                    placeholder="johndoe"
                    className={inputClass}
                  />
                </div>
                {fieldErrors.username?.[0] && (
                  <p className="text-sm text-error">{fieldErrors.username[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                {fieldErrors.email?.[0] && (
                  <p className="text-sm text-error">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password?.[0] && (
                <p className="text-sm text-error">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest px-1">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword?.[0] && (
                <p className="text-sm text-error">{fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary-container to-blue-700 hover:from-primary hover:to-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-xs text-on-surface-variant">
              By signing up, you agree to our{' '}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
            </p>
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-primary-fixed-dim transition-colors ml-1 underline underline-offset-4 decoration-primary/30"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-outline/50 font-medium">
          <span className="hover:text-outline transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-outline transition-colors cursor-pointer">Terms of Service</span>
          <Link to="/" className="hover:text-outline transition-colors">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Register;