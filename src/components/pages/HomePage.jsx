import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import HeroSection from "@/components/organisms/HeroSection"
import QuizCard from "@/components/organisms/QuizCard"
import ShlokCard from "@/components/organisms/ShlokCard"
import PanchangCard from "@/components/organisms/PanchangCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { quizService } from "@/services/api/quizService"
import { shlokService } from "@/services/api/shlokService"
import { panchangService } from "@/services/api/panchangService"

const HomePage = () => {
  const [featuredQuizzes, setFeaturedQuizzes] = useState([])
  const [todayShlok, setTodayShlok] = useState(null)
  const [todayPanchang, setTodayPanchang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [quizzes, shlok, panchang] = await Promise.all([
        quizService.getFeatured(),
        shlokService.getTodayShlok(),
        panchangService.getTodayPanchang()
      ])

      setFeaturedQuizzes(quizzes)
setTodayShlok(shlok)
      setTodayPanchang(panchang)
    } catch (err) {
      console.error("Error loading home data:", err);
      setError("Failed to load content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="section-padding">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="section-padding">
          <Error message={error} onRetry={loadHomeData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Explore Hindu Wisdom
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover ancient knowledge through interactive experiences and daily spiritual guidance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Quizzes */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Featured Quizzes</h3>
                  <Link to="/quiz">
                    <Button variant="ghost" className="flex items-center gap-2">
                      View All
                      <ApperIcon name="ArrowRight" className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz.Id} quiz={quiz} index={index} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Today's Shlok */}
              {todayShlok && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <ShlokCard shlok={todayShlok} />
                </motion.div>
              )}

              {/* Today's Panchang */}
              {todayPanchang && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <PanchangCard panchang={todayPanchang} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-saffron-900 via-orange-800 to-saffron-800 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Growing Community</h2>
            <p className="text-xl opacity-90">Join thousands of people exploring Hindu culture</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "Users", number: "10,000+", label: "Active Learners" },
              { icon: "Brain", number: "500+", label: "Quiz Questions" },
              { icon: "BookOpen", number: "365", label: "Daily Shlokas" },
              { icon: "Calendar", number: "100%", label: "Accurate Panchang" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-r from-gold-50 to-saffron-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="card-spiritual p-8">
              <h3 className="text-3xl font-bold text-gradient mb-4">
                Stay Connected with Hindu Wisdom
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Get daily Shlokas, festival updates, and spiritual insights delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Join our community and never miss spiritual wisdom
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage