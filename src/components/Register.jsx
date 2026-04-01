import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerSchema } from '../lib/validations/auth';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  useEffect(() => {
    document.title = 'Sign Up - Collab App';
  }, []);

  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const parsed = registerSchema.safeParse(registerData);
    if (!parsed.success) {
      const nextFieldErrors = parsed.error.flatten().fieldErrors;
      setFieldErrors(nextFieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await signup(parsed.data.fullName, parsed.data.username, parsed.data.email, parsed.data.password);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Sign up error', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '48px',
          width: '100%',
          maxWidth: '440px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#4f46e5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '32px'
            }}>
              📄
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Create your account
            </h2>
            <p style={{ color: '#6b7280' }}>Start collaborating in minutes</p>
          </div>

          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={registerData.fullName}
                onChange={handleRegisterInputChange}
                placeholder="full name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {fieldErrors.fullName?.[0] && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.fullName[0]}</p>
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>

              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                User Name
              </label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterInputChange}
                placeholder="John@dev"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid '#d1d5db'`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {fieldErrors.username?.[0] && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.username[0]}</p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterInputChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid '#d1d5db'`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {fieldErrors.email?.[0] && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div style={{ marginBottom: "20px", position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {fieldErrors.password?.[0] && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div style={{ marginBottom: "24px", position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#818cf8' : '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
              >
                Log in
              </Link>
            </p>
          </div>

          <Link
            to="/"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6b7280',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  )
}

export default Register