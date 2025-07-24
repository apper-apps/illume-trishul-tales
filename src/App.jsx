import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import HomePage from "@/components/pages/HomePage";
import QuizPage from "@/components/pages/QuizPage";
import ContactPage from "@/components/pages/ContactPage";
import PanchangPage from "@/components/pages/PanchangPage";
import AboutPage from "@/components/pages/AboutPage";
import QuizListPage from "@/components/pages/QuizListPage";
import ShlokPage from "@/components/pages/ShlokPage";
import BlogPage from "@/components/pages/BlogPage";
import LeaderboardPage from "@/components/pages/LeaderboardPage";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/quiz" element={<QuizListPage />} />
    <Route path="/quiz/:quizId" element={<QuizPage />} />
    <Route path="/quiz/random" element={<QuizPage />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/shlok" element={<ShlokPage />} />
    <Route path="/panchang" element={<PanchangPage />} />
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      
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
    </>
  )
}

export default App