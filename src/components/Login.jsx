import React, { useState } from 'react';
import { login } from '../services/authApi';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
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
      try {
        const response = await login({
          email: loginData.email,
          password: loginData.password,
        });
  
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
  
          navigate("/dashboard");
        }else{
          navigate("/");
        }
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
              Welcome back
            </h2>
            <p style={{ color: '#6b7280' }}>Log in to your account to continue</p>
          </div>

          <div onSubmit={handleLogin}>
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
                value={loginData.email}
                onChange={handleLoginInputChange}
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

            <div style={{ marginBottom: '24px' }}>
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
                value={loginData.password}
                onChange={handleLoginInputChange}
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
              onClick={handleLogin}
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
              Log in
            </button>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              Don't have an account?{' '}
              <span
                // onClick={() => setCurrentPage('signup')}
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
              >
                Sign up
              </span>
            </p>
          </div>

          <button
            // onClick={() => setCurrentPage('landing')}
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

export default Login