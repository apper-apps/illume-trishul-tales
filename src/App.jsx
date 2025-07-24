import "@/index.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import HomePage from "@/components/pages/HomePage";
import QuizPage from "@/components/pages/QuizPage";
import ContactPage from "@/components/pages/ContactPage";
import PanchangPage from "@/components/pages/PanchangPage";
import AboutPage from "@/components/pages/AboutPage";
import QuizListPage from "@/components/pages/QuizListPage";
import ShlokPage from "@/components/pages/ShlokPage";
import LeaderboardPage from "@/components/pages/LeaderboardPage";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

// Redux user slice
const userSlice = {
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
};

const userReducer = (state = userSlice.initialState, action) => {
  switch (action.type) {
    case 'user/setUser':
      return {
        ...state,
        user: JSON.parse(JSON.stringify(action.payload)),
        isAuthenticated: !!action.payload,
      };
    case 'user/clearUser':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const setUser = (payload) => ({ type: 'user/setUser', payload });
const clearUser = () => ({ type: 'user/clearUser' });

// Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Create auth context
export const AuthContext = createContext(null);

// Login component
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showLogin("#authentication");
        setIsInitialized(true);
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);
  
  if (!isInitialized) {
    return <div className="flex items-center justify-center p-6 h-screen"><div>Loading...</div></div>;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-saffron-50 to-gold-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-saffron-500 to-saffron-600 text-white text-2xl font-bold">
            T
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to Trishul Tales
            </div>
            <div className="text-center text-sm text-gray-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
      </div>
    </div>
  );
};

// Signup component  
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showSignup("#authentication");
        setIsInitialized(true);
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);
  
  if (!isInitialized) {
    return <div className="flex items-center justify-center p-6 h-screen"><div>Loading...</div></div>;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-saffron-50 to-gold-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-saffron-500 to-saffron-600 text-white text-2xl font-bold">
            T
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-500">
              Please create an account to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
      </div>
    </div>
  );
};

// Callback component
const Callback = () => {
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showSSOVerify("#authentication-callback");
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);
  
  return <div id="authentication-callback"></div>;
};

// Error page component
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-gold-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">An error occurred during authentication</p>
      </div>
    </div>
  );
};

// Reset password component
const ResetPassword = () => {
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);

  return (
    <div className="flex-1 py-12 px-5 flex justify-center items-center">
      <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl"></div>
    </div>
  );
};

// Prompt password component
const PromptPassword = () => {
  useEffect(() => {
    const checkSDK = () => {
      if (window.ApperSDK) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);

  return (
    <div className="flex-1 py-12 px-5 flex justify-center items-center">
      <div id="authentication-prompt-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl"></div>
    </div>
  );
};

// Main App component
function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  useEffect(() => {
    const initializeAuth = () => {
      if (window.ApperSDK) {
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              if (redirectPath) {
                navigate(redirectPath);
              } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                  navigate(currentPath);
                } else {
                  navigate('/');
                }
              } else {
                navigate('/');
              }
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              if (!isAuthPage) {
                navigate(
                  currentPath.includes('/signup')
                    ? `/signup?redirect=${currentPath}`
                    : currentPath.includes('/login')
                    ? `/login?redirect=${currentPath}`
                    : '/login'
                );
              } else if (redirectPath) {
                if (
                  !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
                ) {
                  navigate(`/login?redirect=${redirectPath}`);
                } else {
                  navigate(currentPath);
                }
              } else if (isAuthPage) {
                navigate(currentPath);
              } else {
                navigate('/login');
              }
              dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            setIsInitialized(true);
          }
        });
      } else {
        setTimeout(initializeAuth, 100);
      }
    };

    initializeAuth();
  }, [navigate, dispatch]);
  
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        if (window.ApperSDK) {
          const { ApperUI } = window.ApperSDK;
          await ApperUI.logout();
        }
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-full w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <HomePage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/quiz" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <QuizListPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/quiz/:quizId" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <QuizPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/quiz/random" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <QuizPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/leaderboard" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <LeaderboardPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/shlok" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ShlokPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/panchang" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <PanchangPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <AboutPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ContactPage />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;