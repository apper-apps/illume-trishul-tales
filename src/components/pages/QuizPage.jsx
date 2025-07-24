import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import QuizOption from "@/components/molecules/QuizOption"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { quizService } from "@/services/api/quizService"

const QuizPage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    if (quizId) {
      loadQuiz()
    } else {
      loadRandomQuiz()
    }
  }, [quizId])

  useEffect(() => {
    if (timeLeft === null || quizCompleted) return

    if (timeLeft <= 0) {
      handleSubmitQuiz()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, quizCompleted])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError(null)

      const [quizData, questionsData] = await Promise.all([
        quizService.getById(parseInt(quizId)),
        quizService.getQuestions(parseInt(quizId))
      ])

      setQuiz(quizData)
      setQuestions(questionsData)
      setTimeLeft(quizData.duration * 60) // Convert minutes to seconds
    } catch (err) {
      setError("Failed to load quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadRandomQuiz = async () => {
    try {
      setLoading(true)
      setError(null)

      const questionsData = await quizService.getRandomQuestions(20)
      
      setQuestions(questionsData)
      setQuiz({
        title: "Hindu Mythology Quiz",
        description: "Test your knowledge of Hindu traditions and mythology",
        duration: 20,
        questionCount: questionsData.length
      })
      setTimeLeft(20 * 60) // 20 minutes
    } catch (err) {
      setError("Failed to load quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    
    setSelectedAnswer(answerIndex)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(answers[currentQuestion + 1] || null)
      setShowResult(false)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || null)
      setShowResult(false)
    }
  }

  const handleSubmitQuiz = async () => {
    setQuizCompleted(true)
    
    let calculatedScore = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore++
      }
    })

    setScore(calculatedScore)

    // Save score
    try {
      await quizService.saveScore({
        userName: "Anonymous User",
        score: calculatedScore,
        totalQuestions: questions.length,
        category: quiz?.category || "General"
      })
    } catch (err) {
      console.error("Failed to save score:", err)
    }

    toast.success(`Quiz completed! You scored ${calculatedScore}/${questions.length}`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 90) return "Excellent! You're a Hindu culture expert! 🎉"
    if (percentage >= 70) return "Great job! You have good knowledge! 👏"
    if (percentage >= 50) return "Good effort! Keep learning! 📚"
    return "Don't worry, keep exploring to improve! 💪"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Loading type="quiz" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Error message={error} onRetry={quizId ? loadQuiz : loadRandomQuiz} />
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-spiritual p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Trophy" className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient mb-4">Quiz Completed!</h2>
                <p className="text-xl text-gray-600 mb-6">{getScoreMessage()}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-saffron-50 rounded-lg">
                  <div className="text-3xl font-bold text-saffron-600 mb-2">{score}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center p-4 bg-gold-50 rounded-lg">
                  <div className="text-3xl font-bold text-gold-600 mb-2">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.reload()}>
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button variant="secondary" onClick={() => navigate("/quiz")}>
                  <ApperIcon name="List" className="w-4 h-4 mr-2" />
                  More Quizzes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const text = `I scored ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%) on the Hindu Culture Quiz at Trishul Tales! Test your knowledge too: ${window.location.origin}/quiz`
                    navigator.share ? navigator.share({ text }) : navigator.clipboard.writeText(text)
                    toast.success("Results shared!")
                  }}
                >
                  <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">{quiz?.title}</h1>
          <p className="text-gray-600">{quiz?.description}</p>
        </div>

        {/* Progress and Timer */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <ApperIcon name="Clock" className="w-4 h-4 text-saffron-600" />
                <span className={timeLeft < 300 ? "text-red-600" : "text-gray-600"}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-saffron h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-spiritual p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                {currentQ?.question}
              </h2>

              <div className="space-y-3">
                {currentQ?.options.map((option, index) => (
                  <QuizOption
                    key={index}
                    option={option}
                    index={index}
                    selected={selectedAnswer === index}
                    onClick={() => handleAnswerSelect(index)}
                    showResult={showResult}
                    isCorrect={index === currentQ.correctAnswer}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {Object.keys(answers).length} of {questions.length} answered
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              className="flex items-center gap-2"
              disabled={Object.keys(answers).length === 0}
            >
              <ApperIcon name="Check" className="w-4 h-4" />
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex items-center gap-2"
            >
              Next
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPage