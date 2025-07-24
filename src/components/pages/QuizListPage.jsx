import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import QuizCard from "@/components/organisms/QuizCard"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { quizService } from "@/services/api/quizService"

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([])
  const [filteredQuizzes, setFilteredQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "mythology", label: "Mythology" },
    { value: "festivals", label: "Festivals" },
    { value: "scriptures", label: "Scriptures" },
    { value: "traditions", label: "Traditions" },
    { value: "philosophy", label: "Philosophy" }
  ]

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" }
  ]

  useEffect(() => {
    loadQuizzes()
  }, [])

  useEffect(() => {
    filterQuizzes()
  }, [selectedCategory, selectedDifficulty, quizzes])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await quizService.getAll()
      setQuizzes(data)
    } catch (err) {
      setError("Failed to load quizzes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterQuizzes = () => {
    let filtered = quizzes

    if (selectedCategory !== "all") {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty)
    }

    setFilteredQuizzes(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Error message={error} onRetry={loadQuizzes} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Hindu Culture Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your knowledge of Hindu mythology, traditions, festivals, and spiritual wisdom
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Button 
            size="lg" 
            onClick={() => window.location.href = "/quiz/random"}
            className="flex items-center gap-3 shadow-xl"
          >
            <ApperIcon name="Zap" className="w-5 h-5" />
            Start Random Quiz
          </Button>
          <p className="text-sm text-gray-600 mt-2">Get 20 random questions from all categories</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <ApperIcon name="Filter" className="w-4 h-4 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ApperIcon name="BarChart3" className="w-4 h-4 text-gray-600" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none bg-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCategory !== "all" || selectedDifficulty !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedDifficulty("all")
                }}
                className="flex items-center gap-2"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="text-gray-600">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </p>
        </motion.div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <Empty
            title="No quizzes found"
            description="Try adjusting your filters to see more quizzes"
            actionText="Clear Filters"
            onAction={() => {
              setSelectedCategory("all")
              setSelectedDifficulty("all")
            }}
            icon="Search"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.Id} quiz={quiz} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default QuizListPage