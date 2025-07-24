import React from "react"
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import HomePage from "@/components/pages/HomePage"
import QuizListPage from "@/components/pages/QuizListPage"
import QuizPage from "@/components/pages/QuizPage"
import ShlokPage from "@/components/pages/ShlokPage"
import PanchangPage from "@/components/pages/PanchangPage"
import BlogPage from "@/components/pages/BlogPage"
import AboutPage from "@/components/pages/AboutPage"
import ContactPage from "@/components/pages/ContactPage"

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