import "@/index.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import HomePage from "@/components/pages/HomePage";
import QuizPage from "@/components/pages/QuizPage";
import ContactPage from "@/components/pages/ContactPage";
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
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';

export const AuthContext = createContext(null);

// Login component

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
  const [isInitialized, setIsInitialized] = useState(true); // Always initialized for normal users
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
// Initialize authentication system once for the entire app
  useEffect(() => {
    const initializeAuth = () => {
      if (window.ApperSDK) {
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Setup authentication handlers centrally
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                               currentPath.includes('/callback') || currentPath.includes('/error') || 
                               currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
            
            if (user) {
              // User successfully authenticated
              if (redirectPath) {
                navigate(redirectPath);
              } else if (isAuthPage) {
                navigate('/');
              }
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
          }
        });
      }
    };

    // Initialize auth system
    if (window.ApperSDK) {
      initializeAuth();
    }
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
  
  // No loading screen needed - app is always ready for normal users
  
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