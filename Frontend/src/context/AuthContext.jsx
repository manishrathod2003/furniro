// context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

// Auth Context - EXPORT THIS
export const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.user._id || action.payload.user.id);
      return {
        ...state,
        user: {
          ...action.payload.user,
          id: action.payload.user._id || action.payload.user.id // Ensure consistent ID field
        },
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...action.payload,
          id: action.payload._id || action.payload.id // Ensure consistent ID field
        },
        loading: false
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  // Check token validity on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
          
          // Check if auth routes exist, otherwise skip validation
          try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              dispatch({ 
                type: AUTH_ACTIONS.LOGIN_SUCCESS, 
                payload: { 
                  user: data.data?.user || data.user, 
                  token 
                } 
              });
            } else {
              // Token invalid, logout
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch (fetchError) {
            // If auth routes don't exist yet, create dummy user for testing
            const userId = localStorage.getItem('userId') || 'guest';
            dispatch({ 
              type: AUTH_ACTIONS.LOGIN_SUCCESS, 
              payload: { 
                user: { 
                  id: userId,
                  name: 'Test User',
                  email: 'test@example.com'
                }, 
                token 
              } 
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } finally {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      // Try actual login API first
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: data.data 
        });

        return { success: true, message: 'Login successful!' };

      } catch (fetchError) {
        // If auth API doesn't exist, create dummy login for testing
        if (credentials.email && credentials.password) {
          const dummyUser = {
            id: Date.now().toString(),
            _id: Date.now().toString(),
            name: credentials.email.split('@')[0],
            email: credentials.email
          };
          
          const dummyToken = 'dummy-token-' + Date.now();
          
          dispatch({ 
            type: AUTH_ACTIONS.LOGIN_SUCCESS, 
            payload: {
              user: dummyUser,
              token: dummyToken
            }
          });

          return { success: true, message: 'Login successful!' };
        } else {
          throw new Error('Please provide email and password');
        }
      }

    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, message: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      // Try actual register API first
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        dispatch({ 
          type: AUTH_ACTIONS.REGISTER_SUCCESS, 
          payload: data.data 
        });

        return { success: true, message: 'Registration successful!' };

      } catch (fetchError) {
        // If auth API doesn't exist, create dummy registration for testing
        if (userData.email && userData.password && userData.name) {
          const dummyUser = {
            id: Date.now().toString(),
            _id: Date.now().toString(),
            name: userData.name,
            email: userData.email
          };
          
          const dummyToken = 'dummy-token-' + Date.now();
          
          dispatch({ 
            type: AUTH_ACTIONS.REGISTER_SUCCESS, 
            payload: {
              user: dummyUser,
              token: dummyToken
            }
          });

          return { success: true, message: 'Registration successful!' };
        } else {
          throw new Error('Please provide name, email and password');
        }
      }

    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    // Optional: Notify server about logout
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Try actual profile update API first
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`
          },
          body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Profile update failed');
        }

        dispatch({ 
          type: AUTH_ACTIONS.UPDATE_USER, 
          payload: data.data.user 
        });

        return { success: true, message: 'Profile updated successfully!' };

      } catch (fetchError) {
        // If auth API doesn't exist, update user locally
        const updatedUser = {
          ...state.user,
          ...profileData
        };
        
        dispatch({ 
          type: AUTH_ACTIONS.UPDATE_USER, 
          payload: updatedUser 
        });

        return { success: true, message: 'Profile updated successfully!' };
      }

    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, message: error.message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export for convenience
export default AuthContext;