import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { quizService } from "@/services/api/quizService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import QuizOption from "@/components/molecules/QuizOption";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

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
  const [showNameModal, setShowNameModal] = useState(false)
  const [userName, setUserName] = useState("")
  const [showAgeSelection, setShowAgeSelection] = useState(false)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null)
useEffect(() => {
    if (quizId) {
      setShowAgeSelection(true)
    } else {
      setShowAgeSelection(true)
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

const loadRandomQuiz = async (ageGroup) => {
    try {
      setLoading(true)
      setError(null)

      const questionsData = await quizService.getRandomQuestions(20, ageGroup)
      
      setQuestions(questionsData)
      setQuiz({
        title: `Hindu Mythology Quiz - ${ageGroup === 'kids' ? 'Kids' : 'Adults'}`,
        description: `Test your knowledge of Hindu traditions and mythology`,
        duration: ageGroup === 'kids' ? 15 : 20,
        questionCount: questionsData.length,
        ageGroup: ageGroup
      })
      setTimeLeft((ageGroup === 'kids' ? 15 : 20) * 60)
    } catch (err) {
      setError("Failed to load quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAgeSelection = (ageGroup) => {
    setSelectedAgeGroup(ageGroup)
    setShowAgeSelection(false)
    
    if (quizId) {
      loadQuizWithAge(ageGroup)
    } else {
      loadRandomQuiz(ageGroup)
    }
  }

  const loadQuizWithAge = async (ageGroup) => {
    try {
      setLoading(true)
      setError(null)

      const [quizData, questionsData] = await Promise.all([
        quizService.getById(parseInt(quizId)),
        quizService.getQuestionsByAge(parseInt(quizId), ageGroup)
      ])

      setQuiz({...quizData, ageGroup})
      setQuestions(questionsData)
      setTimeLeft(quizData.duration * 60)
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
    let calculatedScore = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore++
      }
    })

    setScore(calculatedScore)
    setShowNameModal(true)
  }

  const handleNameSubmit = async () => {
    if (!userName.trim()) {
      toast.error("कृपया अपना नाम दर्ज करें")
      return
    }

    setShowNameModal(false)
    setQuizCompleted(true)
setQuizCompleted(true)

    // Save score
    try {
      await quizService.saveScore({
        userName: userName.trim(),
        score: score,
        totalQuestions: questions.length,
        category: quiz?.category || "General",
        ageGroup: selectedAgeGroup || "General"
      })
    } catch (err) {
      console.error("Failed to save score:", err)
    }
    toast.success(`Quiz completed! You scored ${score}/${questions.length}`)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

const getCertificateMessage = () => {
    const percentage = (score / questions.length) * 100
    let emoji, title, message

    if (percentage >= 90) {
      emoji = '🏆'
      title = 'शास्त्रों के मर्मज्ञ!'
      message = 'आपकी शास्त्रों में गहरी समझ और भक्ति अद्भुत है। आपने अध्यात्म में वह ऊँचाई छू ली है जो साधना और अध्ययन से ही संभव है। इसे दोस्तों व परिवार से जरूर साझा करें!'
    } else if (percentage >= 70) {
      emoji = '🌟'
      title = 'समर्पित साधक!'
      message = 'आपने शास्त्रों का अच्छा ज्ञान अर्जित किया है। निरंतर अभ्यास और पढ़ाई से आप और भी ऊँचाइयाँ प्राप्त कर सकते हैं। इसे मित्रों में साझा करें और उन्हें भी प्रेरित करें।'
    } else if (percentage >= 50) {
      emoji = '📚'
      title = 'अध्ययनरत भक्त!'
      message = 'आपको शास्त्रों की आधारभूत जानकारी है। और अधिक पढ़ाई व मनन से आप भी गहराई तक पहुँच सकते हैं। अपने दोस्तों को भी प्रेरित करने के लिए इसे शेयर करें।'
    } else {
      emoji = '🙏'
      title = 'आरंभिक साधक!'
      message = 'हर यात्रा की शुरुआत एक छोटे कदम से होती है। शास्त्रों को पढ़ते रहें, सीखते रहें और इस ज्ञान यात्रा में आगे बढ़ें। इसे अपने प्रियजनों संग शेयर करें ताकि वे भी इस मार्ग पर चलें।'
}

    return { emoji, title, message, percentage }
  }

  // Age selection screen
  if (showAgeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-spiritual p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Users" className="w-8 h-8 text-white" />
                </div>
<h2 className="text-2xl font-bold text-gradient mb-2">Select Age Group</h2>
                <p className="text-gray-600">Choose your age group for appropriate questions</p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => handleAgeSelection('kids')}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                >
                  <ApperIcon name="Baby" className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">👶 Kids</div>
                    <div className="text-xs opacity-90">Fun and simple questions</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => handleAgeSelection('adults')}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                >
                  <ApperIcon name="GraduationCap" className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">👨‍🎓 Adults</div>
                    <div className="text-xs opacity-90">Advanced questions</div>
                  </div>
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/quiz')}
                  className="text-gray-600"
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Back to Quiz List
                </Button>
              </div>
            </Card>
</motion.div>
        </div>
      </div>
    )
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

// Name input modal
  if (showNameModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="card-spiritual p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="User" className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gradient mb-2">परीक्षा पूर्ण!</h2>
                <p className="text-gray-600">कृपया अपना नाम दर्ज करें</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="आपका नाम"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                <Button 
                  onClick={handleNameSubmit}
                  className="w-full"
                  disabled={!userName.trim()}
                >
                  प्रमाणपत्र देखें
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const { emoji, title, message, percentage } = getCertificateMessage()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* WhatsApp-style Certificate */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-white via-gold-50 to-saffron-50 border-2 border-gold-300 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
                <div className="w-full h-full bg-gradient-saffron rounded-full transform -translate-x-16 -translate-y-16"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                <div className="w-full h-full bg-gradient-gold rounded-full transform translate-x-12 translate-y-12"></div>
              </div>

              <div className="relative p-8 text-center">
                {/* Header */}
                <div className="mb-6">
                  <div className="text-6xl mb-4">{emoji}</div>
                  <h1 className="text-2xl font-bold text-gradient mb-2">प्रमाणपत्र</h1>
                  <div className="w-16 h-1 bg-gradient-saffron mx-auto rounded-full"></div>
                </div>

                {/* User name */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">यह प्रमाणित किया जाता है कि</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{userName}</h2>
                  <p className="text-gray-600 text-sm">ने सफलतापूर्वक पूर्ण किया है</p>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gradient mb-4">{title}</h3>
                  <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4 border border-gold-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-saffron-600">{score}</div>
                        <div className="text-xs text-gray-600">सही उत्तर</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-gold-600">{Math.round(percentage)}%</div>
                        <div className="text-xs text-gray-600">सटीकता</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-orange-600">{questions.length}</div>
                        <div className="text-xs text-gray-600">कुल प्रश्न</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-8">
                  <p className="text-sm text-gray-700 leading-relaxed px-2">{message}</p>
                </div>

                {/* Footer */}
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500">Trishul Tales - Hindu Culture Quiz</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleDateString('hi-IN')}</p>
                </div>

{/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={async () => {
                      try {
                        // Generate certificate image
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        
                        // Mobile-friendly A4 size (794x1123px for better WhatsApp display)
                        canvas.width = 794
                        canvas.height = 1123
                        
                        // Create gradient background
                        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
                        gradient.addColorStop(0, '#FFF8F3')
                        gradient.addColorStop(0.5, '#FFF0E6')
                        gradient.addColorStop(1, '#FFE0CC')
                        ctx.fillStyle = gradient
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        
                        // Add decorative border
                        ctx.strokeStyle = '#FF6B35'
                        ctx.lineWidth = 8
                        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
                        
                        // Add inner border
                        ctx.strokeStyle = '#FFD700'
                        ctx.lineWidth = 4
                        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
                        
                        // Set text properties
                        ctx.textAlign = 'center'
                        ctx.fillStyle = '#1f2937'
                        
                        // Title with emoji
                        ctx.font = 'bold 36px Arial'
                        ctx.fillText('🏆 प्रमाणपत्र 🏆', canvas.width / 2, 120)
                        ctx.font = '24px Arial'
                        ctx.fillStyle = '#6b7280'
                        ctx.fillText('Hindu Culture Quiz Certificate', canvas.width / 2, 160)
                        
                        // User name section
                        ctx.fillStyle = '#1f2937'
                        ctx.font = '20px Arial'
                        ctx.fillText('यह प्रमाणित किया जाता है कि', canvas.width / 2, 220)
                        ctx.font = 'bold 32px Arial'
                        ctx.fillText(userName, canvas.width / 2, 270)
                        ctx.font = '20px Arial'
                        ctx.fillText('ने सफलतापूर्वक पूर्ण किया है', canvas.width / 2, 310)
                        
                        // Achievement title with emoji
                        ctx.font = 'bold 28px Arial'
                        ctx.fillStyle = '#FF6B35'
                        ctx.fillText(`${emoji} ${title}`, canvas.width / 2, 380)
                        
                        // Score section
                        ctx.fillStyle = '#1f2937'
                        ctx.font = 'bold 24px Arial'
                        ctx.fillText(`स्कोर: ${score}/${questions.length} (${Math.round(percentage)}%)`, canvas.width / 2, 440)
                        
                        // Message section (wrapped text)
                        ctx.font = '18px Arial'
                        ctx.fillStyle = '#374151'
                        const lines = wrapText(ctx, message, canvas.width - 120)
                        let yPos = 500
                        lines.forEach(line => {
                          ctx.fillText(line, canvas.width / 2, yPos)
                          yPos += 30
                        })
                        
                        // Footer with emojis
                        ctx.font = '20px Arial'
                        ctx.fillStyle = '#9ca3af'
                        ctx.fillText('🕉️ Trishul Tales 🕉️', canvas.width / 2, canvas.height - 100)
                        ctx.fillText('Hindu Culture & Wisdom', canvas.width / 2, canvas.height - 70)
                        ctx.font = '16px Arial'
                        ctx.fillText(new Date().toLocaleDateString('hi-IN'), canvas.width / 2, canvas.height - 40)
                        
                        // Helper function for text wrapping
                        function wrapText(ctx, text, maxWidth) {
                          const words = text.split(' ')
                          const lines = []
                          let currentLine = words[0]
                          
                          for (let i = 1; i < words.length; i++) {
                            const word = words[i]
                            const width = ctx.measureText(currentLine + ' ' + word).width
                            if (width < maxWidth) {
                              currentLine += ' ' + word
                            } else {
                              lines.push(currentLine)
                              currentLine = word
                            }
                          }
                          lines.push(currentLine)
                          return lines
                        }
                        
                        // Try to share image + text
                        canvas.toBlob(async (blob) => {
                          const text = `🏆 ${title}\n\n${userName} जी ने हिंदू संस्कृति प्रश्नोत्तरी में ${score}/${questions.length} अंक (${Math.round(percentage)}%) प्राप्त किए! ${emoji}\n\n✨ ${message}\n\n🔗 आप भी करें: ${window.location.origin}/quiz\n\n🕉️ #TrishulTales #HinduCulture #Quiz`
                          
                          try {
                            // Try Web Share API with image (best for mobile)
                            if (navigator.share && navigator.canShare) {
                              const file = new File([blob], 'certificate.png', { type: 'image/png' })
                              const canShareFiles = await navigator.canShare({ files: [file] })
                              
                              if (canShareFiles) {
                                await navigator.share({
                                  title: 'Hindu Culture Quiz Certificate',
                                  text: text,
                                  files: [file]
                                })
                                toast.success("🎉 प्रमाणपत्र शेयर हो गया!")
                                return
                              }
                            }
                            
                            // Fallback to WhatsApp direct link (mobile-friendly)
                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
                            const newWindow = window.open(whatsappUrl, '_blank')
                            
                            if (newWindow) {
                              // Also download image for manual sharing
                              const link = document.createElement('a')
                              link.download = `certificate-${Date.now()}.png`
                              link.href = URL.createObjectURL(blob)
                              link.click()
                              toast.success("📱 WhatsApp खुल गया! Image भी download हो गई है!")
                            } else {
                              // Final fallback to clipboard
                              await navigator.clipboard.writeText(text)
                              const link = document.createElement('a')
                              link.download = `certificate-${Date.now()}.png`
                              link.href = URL.createObjectURL(blob)
                              link.click()
                              toast.success("📋 Text copy और image download हो गई! WhatsApp में paste करें")
                            }
                          } catch (error) {
                            console.error('Sharing failed:', error)
                            toast.error("❌ शेयर नहीं हो सका। कृपया फिर से कोशिश करें")
                          }
                        }, 'image/png')
                      } catch (error) {
                        console.error('Certificate generation failed:', error)
                        toast.error("❌ प्रमाणपत्र बनाने में समस्या हुई")
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                    📱 WhatsApp पर शेयर करें
                  </Button>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                      className="flex-1"
                    >
                      <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                      फिर से करें
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate("/quiz")}
                      className="flex-1"
                    >
                      <ApperIcon name="List" className="w-4 h-4 mr-2" />
                      और Quiz
                    </Button>
                  </div>
                </div>
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