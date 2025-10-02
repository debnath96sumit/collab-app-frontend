import React, { useState } from 'react';
import { login } from '../services/authApi';
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('landing');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);

        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup:', formData);
    alert('Connect to your NestJS backend at /api/auth/signup');
  };

  if (currentPage === 'landing') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#4f46e5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📄
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              CollabDocs
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setCurrentPage('login')}
              style={{
                padding: '10px 24px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Log in
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: 'white'
              }}
            >
              Sign up
            </button>
          </div>
        </nav>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 48px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Collaborate in Real-Time,
            <br />
            <span style={{ color: '#4f46e5' }}>Work Seamlessly Together</span>
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            Create, edit, and share documents with your team in real-time. 
            Experience the future of collaborative writing.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('signup')}
              style={{
                padding: '16px 32px',
                backgroundColor: '#4f46e5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Get Started Free →
            </button>
            <button
              style={{
                padding: '16px 32px',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151'
              }}
            >
              Watch Demo
            </button>
          </div>

          <div style={{
            marginTop: '60px',
            backgroundColor: '#f3f4f6',
            borderRadius: '16px',
            padding: '60px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              </div>
              <div style={{ textAlign: 'left' }}>
                {[80, 90, 75, 85].map((width, i) => (
                  <div key={i} style={{ 
                    height: '12px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '4px', 
                    marginBottom: '12px', 
                    width: `${width}%` 
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          padding: '80px 48px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '60px',
              color: '#1f2937'
            }}>
              Everything you need to collaborate
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              {[
                { icon: '⚡', title: 'Real-Time Editing', desc: 'See changes as they happen. Edit documents simultaneously with your team.' },
                { icon: '👥', title: 'Team Collaboration', desc: 'Invite unlimited team members and collaborate without limits.' },
                { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security to keep your documents safe and private.' },
                { icon: '🌍', title: 'Access Anywhere', desc: 'Work from any device, anywhere in the world with cloud sync.' },
                { icon: '🕐', title: 'Version History', desc: 'Never lose work. Track changes and restore previous versions.' },
                { icon: '📝', title: 'Rich Text Editor', desc: 'Format text, add images, and create beautiful documents.' }
              ].map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '32px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#1f2937'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: '80px 48px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#1f2937'
          }}>
            Simple, transparent pricing
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {[
              { name: 'Free', price: '$0', features: ['Up to 3 documents', '5 collaborators', 'Basic features', '1GB storage'], popular: false },
              { name: 'Pro', price: '$12', features: ['Unlimited documents', 'Unlimited collaborators', 'Advanced features', '100GB storage'], popular: true },
              { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'Priority support', 'Custom integrations', 'Unlimited storage'], popular: false }
            ].map((plan, index) => (
              <div key={index} style={{
                backgroundColor: plan.popular ? '#4f46e5' : 'white',
                padding: '40px',
                borderRadius: '12px',
                border: plan.popular ? 'none' : '2px solid #e5e7eb',
                position: 'relative',
                color: plan.popular ? 'white' : '#1f2937'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#fbbf24',
                    color: '#1f2937',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                  {plan.name}
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{plan.price}</span>
                  <span style={{ opacity: 0.8 }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      opacity: 0.9
                    }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setCurrentPage('signup')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: plan.popular ? 'white' : '#4f46e5',
                    color: plan.popular ? '#4f46e5' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: '#4f46e5',
          padding: '80px 48px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px'
          }}>
            Ready to start collaborating?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px'
          }}>
            Join thousands of teams already using CollabDocs
          </p>
          <button
            onClick={() => setCurrentPage('signup')}
            style={{
              padding: '16px 32px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              color: '#4f46e5'
            }}
          >
            Start Free Trial
          </button>
        </div>

        <footer style={{
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '40px 48px',
          textAlign: 'center'
        }}>
          <p style={{ opacity: 0.8 }}>© 2025 CollabDocs. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
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
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.password}
                onChange={handleInputChange}
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
                onClick={() => setCurrentPage('signup')}
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
              >
                Sign up
              </span>
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('landing')}
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
    );
  }

  return (
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
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
              onClick={() => setCurrentPage('login')}
              style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: '500' }}
            >
              Log in
            </span>
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('landing')}
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
  );
};

export default Home;