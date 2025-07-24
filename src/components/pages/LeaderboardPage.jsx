import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { quizService } from "@/services/api/quizService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadLeaderboard()
  }, [])

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
{/* User info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {entry.userName || entry.user_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(entry.completedAt || entry.completed_at)}
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
                          {entry.score}/{entry.totalQuestions || entry.total_questions} correct
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

{/* Share Leaderboard */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={async () => {
                  try {
                    // Generate leaderboard image
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    
                    // Mobile-friendly size (optimized for WhatsApp)
                    canvas.width = 600
                    canvas.height = 800
                    
                    // Create gradient background
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
                    gradient.addColorStop(0, '#FFF8F3')
                    gradient.addColorStop(0.5, '#FFF0E6')
                    gradient.addColorStop(1, '#FFE0CC')
                    ctx.fillStyle = gradient
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    
                    // Add decorative border
                    ctx.strokeStyle = '#FF6B35'
                    ctx.lineWidth = 6
                    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30)
                    
                    // Add inner border
                    ctx.strokeStyle = '#FFD700'
                    ctx.lineWidth = 3
                    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60)
                    
                    // Title with more emojis
                    ctx.textAlign = 'center'
                    ctx.fillStyle = '#1f2937'
                    ctx.font = 'bold 24px Arial'
                    ctx.fillText('🏆 Hindu Culture Quiz 🏆', canvas.width / 2, 70)
                    ctx.font = 'bold 20px Arial'
                    ctx.fillText('✨ Top 10 Leaderboard ✨', canvas.width / 2, 100)
                    
                    // Leaderboard entries
                    const top10 = leaderboard.slice(0, 10)
                    let yPos = 140
                    
                    top10.forEach((entry, index) => {
                      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`
                      
                      // Background for top 3
                      if (index < 3) {
                        ctx.fillStyle = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
                        ctx.globalAlpha = 0.2
                        ctx.fillRect(45, yPos - 18, canvas.width - 90, 36)
                        ctx.globalAlpha = 1
                      }
                      
                      // Rank and medal
                      ctx.fillStyle = '#1f2937'
                      ctx.font = 'bold 18px Arial'
                      ctx.textAlign = 'left'
                      ctx.fillText(`${medal}`, 60, yPos)
                      
                      // Name
                      ctx.font = '16px Arial'
                      const maxNameWidth = canvas.width - 200
                      const name = entry.userName.length > 15 ? entry.userName.substring(0, 15) + '...' : entry.userName
                      ctx.fillText(name, 100, yPos)
                      
                      // Score
                      ctx.textAlign = 'right'
                      ctx.font = 'bold 16px Arial'
                      ctx.fillStyle = '#FF6B35'
                      ctx.fillText(`${entry.percentage}%`, canvas.width - 60, yPos)
                      ctx.font = '12px Arial'
                      ctx.fillStyle = '#6b7280'
                      ctx.fillText(`(${entry.score}/${entry.totalQuestions})`, canvas.width - 60, yPos + 15)
                      
                      yPos += 50
                    })
                    
                    // Footer with more emojis
                    ctx.textAlign = 'center'  
                    ctx.font = '14px Arial'
                    ctx.fillStyle = '#9ca3af'
                    ctx.fillText('🕉️ Trishul Tales 🌺', canvas.width / 2, canvas.height - 60)
                    ctx.fillText('✨ Hindu Culture Quiz ✨', canvas.width / 2, canvas.height - 40)
                    ctx.font = '12px Arial'
                    ctx.fillText(new Date().toLocaleDateString('hi-IN'), canvas.width / 2, canvas.height - 20)
                    
                    // Share image
                    canvas.toBlob(async (blob) => {
                      const top10 = leaderboard.slice(0, 10)
                      let leaderboardText = "🏆 Hindu Culture Quiz Leaderboard - Top 10 🏆\n\n"
                      
                      top10.forEach((entry, index) => {
                        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`
                        leaderboardText += `${medal} ${entry.userName} - ${entry.percentage}% (${entry.score}/${entry.totalQuestions})\n`
                      })
                      
                      leaderboardText += `\n✨ Take the quiz yourself: ${window.location.origin}/quiz\n\n🕉️ Trishul Tales - Hindu Culture Quiz\nExplore the wisdom of Hindu traditions and mythology! 🌺`
                      
try {
                        // Try Web Share API with image (check File constructor availability)
                        if (navigator.share && navigator.canShare && window.File) {
                          const file = new window.File([blob], 'leaderboard.png', { type: 'image/png' })
                          const canShareFiles = await navigator.canShare({ files: [file] })
                          
                          if (canShareFiles) {
                            await navigator.share({
                              title: 'Hindu Culture Quiz Leaderboard',
                              text: leaderboardText,
                              files: [file]
                            })
                            toast.success("🎉 Leaderboard shared successfully!")
                            return
                          }
                        }
                        
                        // Fallback to WhatsApp with image download
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(leaderboardText)}`
                        const newWindow = window.open(whatsappUrl, '_blank')
                        
                        if (newWindow) {
                          const link = document.createElement('a')
                          link.download = `leaderboard-${Date.now()}.png`
                          link.href = URL.createObjectURL(blob)
                          link.click()
                          toast.success("📱 WhatsApp खुल गया! Image भी download हो गई!")
                        } else {
                          // Final fallback
                          await navigator.clipboard.writeText(leaderboardText)
                          const link = document.createElement('a')
                          link.download = `leaderboard-${Date.now()}.png`
                          link.href = URL.createObjectURL(blob)
                          link.click()
                          toast.success("📋 Text copy और image download हो गई!")
                        }
                      } catch (error) {
                        console.error('Sharing failed:', error)
                        toast.error("❌ Share नहीं हो सका। कृपया फिर से कोशिश करें")
                      }
                    }, 'image/png')
                  } catch (error) {
                    console.error('Image generation failed:', error)
                    toast.error("❌ Image बनाने में समस्या हुई")
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                📱 Share with Image
              </Button>
              
              <Button 
                variant="outline"
                onClick={async () => {
                  try {
                    const top10 = leaderboard.slice(0, 10)
                    let leaderboardText = "🏆 Hindu Culture Quiz Leaderboard - Top 10 🏆\n\n"
                    
                    top10.forEach((entry, index) => {
                      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`
                      leaderboardText += `${medal} ${entry.userName} - ${entry.percentage}% (${entry.score}/${entry.totalQuestions})\n`
                    })
                    
                    leaderboardText += `\n✨ Take the quiz yourself: ${window.location.origin}/quiz\n\n🕉️ Trishul Tales - Hindu Culture Quiz\nExplore the wisdom of Hindu traditions and mythology! 🌺`
                    
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(leaderboardText)}`
                    const newWindow = window.open(whatsappUrl, '_blank')
                    
                    if (newWindow) {
                      toast.success("📱 WhatsApp opened! Please send the message!")
                    } else {
                      await navigator.clipboard.writeText(leaderboardText)
                      toast.success("📋 Leaderboard copied! Paste it on WhatsApp")
                    }
                  } catch (error) {
                    console.error('Text sharing failed:', error)
                    toast.error("❌ Text share नहीं हो सका")
                  }
                }}
                className="text-green-600 border-green-500 hover:bg-green-50"
              >
                <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
                📝 Share Text Only
              </Button>
            </div>
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