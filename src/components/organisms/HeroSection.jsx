import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import TrishulIcon from "@/components/molecules/TrishulIcon"
import OmSymbol from "@/components/molecules/OmSymbol"
import LotusDecoration from "@/components/molecules/LotusDecoration"
import ApperIcon from "@/components/ApperIcon"

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-saffron-50 via-gold-50 to-orange-50">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <OmSymbol className="absolute top-20 left-20 text-saffron-300 animate-float" size={80} />
        <LotusDecoration className="absolute bottom-20 right-20 text-gold-300 animate-float" size={100} />
        <OmSymbol className="absolute top-1/2 right-32 text-orange-300 animate-float" size={60} />
        <LotusDecoration className="absolute bottom-32 left-32 text-saffron-300 animate-float" size={70} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <TrishulIcon 
            size={120} 
            className="text-saffron-600 mx-auto mb-8 animate-glow" 
            animated 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Trishul Tales</span>
          </h1>
          <p className="text-2xl md:text-3xl font-display text-gray-700 mb-4">
            Discover the Wisdom of Hindu Traditions
          </p>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the rich heritage of Hindu culture through interactive quizzes, daily spiritual wisdom, 
            sacred Panchang, and timeless Shlokas that connect us to our ancient roots.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link to="/quiz">
            <Button size="lg" className="flex items-center gap-3 shadow-xl">
              <ApperIcon name="Brain" className="w-5 h-5" />
              Start Quiz Journey
            </Button>
          </Link>
          <Link to="/shlok">
            <Button variant="secondary" size="lg" className="flex items-center gap-3 shadow-xl">
              <ApperIcon name="BookOpen" className="w-5 h-5" />
              Daily Wisdom
            </Button>
          </Link>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ApperIcon name="Brain" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600">Test your knowledge of Hindu mythology, epics, and traditions</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ApperIcon name="Calendar" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sacred Panchang</h3>
            <p className="text-gray-600">Daily Hindu calendar with tithi, nakshatra, and auspicious timings</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ApperIcon name="BookOpen" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Daily Shlokas</h3>
            <p className="text-gray-600">Sanskrit verses with Hindi and English translations</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection