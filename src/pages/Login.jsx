import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, FileText, ArrowRight, Mail, Lock } from 'lucide-react';
import { loginSchema } from '../lib/validations/auth';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    document.title = 'Sign In - CollabDocs';
  }, []);

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const parsed = loginSchema.safeParse(loginData);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(parsed.data.email, parsed.data.password);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Login error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/5 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center mb-4 border border-outline-variant/20 shadow-lg shadow-blue-500/5">
            <FileText size={24} className="text-primary" fill="currentColor" />
          </Link>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            CollabDocs
          </h1>
        </div>

        {/* Card */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-headline text-2xl font-semibold text-on-surface mb-2">
              Welcome back
            </h2>
            <p className="text-on-surface-variant text-sm">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    className="text-outline group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-4 py-3 bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface placeholder:text-outline/50 transition-all outline-none text-sm"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-error">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-on-surface-variant">
                  Password
                </label>
                <a className="text-xs font-semibold text-primary hover:text-primary-fixed-dim transition-colors cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-outline group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 bg-surface-container-highest/30 border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface placeholder:text-outline/50 transition-all outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-error">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-br from-primary-container to-blue-700 hover:from-primary hover:to-primary-container text-on-primary-container font-headline font-bold rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface-container-low text-on-surface-variant font-medium">
                or
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary-fixed-dim transition-colors ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-outline/50 font-medium">
          <a className="hover:text-outline transition-colors cursor-pointer">Privacy Policy</a>
          <a className="hover:text-outline transition-colors cursor-pointer">Terms of Service</a>
          <Link to="/" className="hover:text-outline transition-colors">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;