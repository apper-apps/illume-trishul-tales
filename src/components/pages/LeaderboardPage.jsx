import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { quizService } from "@/services/api/quizService"

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)

  useEffect(() => {
    loadLeaderboard()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isRealTimeActive) {
        updateLeaderboard()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isRealTimeActive])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await quizService.getRealTimeLeaderboard()
      setLeaderboard(data)
    } catch (err) {
      setError("Failed to load leaderboard. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateLeaderboard = async () => {
    try {
      const data = await quizService.getRealTimeLeaderboard()
      const prevLeaderboard = [...leaderboard]
      
      // Check for changes and show toast for new high scores
      if (data.length > 0 && prevLeaderboard.length > 0) {
        const newTopScore = data[0]
        const prevTopScore = prevLeaderboard[0]
        
        if (newTopScore?.Id !== prevTopScore?.Id) {
          toast.success(`🏆 New leader: ${newTopScore.userName}!`)
        }
      }
      
      setLeaderboard(data)
    } catch (err) {
      console.error("Failed to update leaderboard:", err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "Crown"
      case 2: return "Medal"
      case 3: return "Award"
      default: return "User"
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "text-yellow-500"
      case 2: return "text-gray-400"
      case 3: return "text-orange-500"
      default: return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Error message={error} onRetry={loadLeaderboard} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ApperIcon name="Trophy" className="w-8 h-8 text-gold-500" />
            <h1 className="text-4xl font-bold text-gradient">Quiz Leaderboard</h1>
            <ApperIcon name="Trophy" className="w-8 h-8 text-gold-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Top performers in Hindu culture and mythology quizzes
          </p>
          
          {/* Real-time indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full ${isRealTimeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isRealTimeActive ? 'Live updates active' : 'Updates paused'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className="ml-2"
            >
              <ApperIcon name={isRealTimeActive ? "Pause" : "Play"} className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {leaderboard.length === 0 ? (
          <Empty
            title="No scores yet"
            description="Be the first to complete a quiz and claim the top spot!"
            actionText="Take a Quiz"
            onAction={() => window.location.href = "/quiz"}
            icon="Trophy"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <Card className={`p-6 ${entry.rank <= 3 ? 'card-spiritual' : 'card'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center gap-2">
                          <ApperIcon 
                            name={getRankIcon(entry.rank)} 
                            className={`w-6 h-6 ${getRankColor(entry.rank)}`} 
                          />
                          <span className="text-2xl font-bold text-gray-800">
                            #{entry.rank}
                          </span>
                        </div>

                        {/* User info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {entry.userName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(entry.completedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-saffron-600">
                            {entry.percentage}%
                          </span>
                          <ApperIcon name="Star" className="w-5 h-5 text-gold-500" />
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.score}/{entry.totalQuestions} correct
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {entry.category}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar for top 3 */}
                    {entry.rank <= 3 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                              'bg-gradient-to-r from-orange-400 to-orange-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Button onClick={() => window.location.href = "/quiz"}>
            <ApperIcon name="PlayCircle" className="w-4 h-4 mr-2" />
            Take a Quiz
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = "/quiz/random"}>
            <ApperIcon name="Shuffle" className="w-4 h-4 mr-2" />
            Random Challenge
          </Button>
          <Button variant="outline" onClick={loadLeaderboard}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default LeaderboardPage