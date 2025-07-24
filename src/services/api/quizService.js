import quizData from "@/services/mockData/quizzes.json"
import questionData from "@/services/mockData/questions.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuizService {
  async getAll() {
    await delay(300)
    return [...quizData]
  }

  async getById(id) {
    await delay(200)
    const quiz = quizData.find(q => q.Id === id)
    if (!quiz) {
      throw new Error("Quiz not found")
    }
    return { ...quiz }
  }

  async getFeatured() {
    await delay(250)
    return quizData.filter(quiz => quiz.featured).slice(0, 4).map(q => ({ ...q }))
  }

  async getQuestions(quizId) {
    await delay(400)
    const questions = questionData.filter(q => q.quizId === quizId)
    return questions.map(q => ({ ...q }))
}

  async getRandomQuestions(count = 20, ageGroup = null) {
    await delay(500)
    let questions = [...questionData]
    
    if (ageGroup) {
      questions = questions.filter(q => q.ageGroup === ageGroup)
    }
    
    const shuffled = questions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count).map(q => ({ ...q }))
  }

  async getQuestionsByAge(quizId, ageGroup) {
    await delay(400)
    let questions = questionData.filter(q => q.quizId === quizId)
    
    if (ageGroup) {
      questions = questions.filter(q => q.ageGroup === ageGroup)
    }
    
    return questions.map(q => ({ ...q }))
  }

  async saveScore(scoreData) {
await delay(300)
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]")
    const newScore = {
      Id: scores.length + 1,
      userName: scoreData.userName || "Anonymous User",
      score: scoreData.score,
      totalQuestions: scoreData.totalQuestions,
      category: scoreData.category || "General",
      ageGroup: scoreData.ageGroup || "General",
      completedAt: new Date().toISOString()
    }
    scores.push(newScore)
    localStorage.setItem("quizScores", JSON.stringify(scores))
    return newScore
  }
async getLeaderboard() {
    await delay(200)
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]")
    return scores
      .sort((a, b) => (b.score / b.totalQuestions) - (a.score / a.totalQuestions))
      .slice(0, 10)
  }

  async getRealTimeLeaderboard() {
    // For real-time updates, we'll use the same method but with shorter delay
    await delay(100)
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]")
    return scores
      .sort((a, b) => (b.score / b.totalQuestions) - (a.score / a.totalQuestions))
      .slice(0, 10)
      .map((score, index) => ({
        ...score,
        rank: index + 1,
        percentage: Math.round((score.score / score.totalQuestions) * 100)
      }))
  }
}

export const quizService = new QuizService()