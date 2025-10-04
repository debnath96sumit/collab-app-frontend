import React, { useState } from 'react';
import { register } from '../services/authApi';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegisterInputChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      });
      console.log("rrrrrrrrr", response);

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
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
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
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
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
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
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
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
            </div>

            <button
              onClick={handleSignup}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Create account
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
              <span
                onClick={() => navigate('/login')}
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
              >
                Log in
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
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
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default Register