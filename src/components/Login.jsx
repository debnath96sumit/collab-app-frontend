import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
const Login = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = 'Sign In - Collab App';
  }, []);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleLoginInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      if (response.success) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "48px",
            width: "100%",
            maxWidth: "440px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#4f46e5",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "32px",
              }}
            >
              📄
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              Welcome back
            </h2>

            <p style={{ color: "#6b7280" }}>
              Log in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px", position: "relative" }}>
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

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#4f46e5",
                }}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div style={{ marginBottom: "24px", cursor: "pointer" }}>
              <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me for 30 days
              </label>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
              >
                Sign up
              </Link>
            </p>
          </form>

          <Link
            to="/"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#6b7280",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  )
}

export default Login