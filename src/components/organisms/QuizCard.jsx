import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const QuizCard = ({ quiz, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="card-spiritual p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
          </div>
          <div className="ml-4">
            <ApperIcon name={quiz.icon} className="w-8 h-8 text-saffron-600" />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ApperIcon name="HelpCircle" className="w-4 h-4" />
            <span>{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{quiz.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="BarChart3" className="w-4 h-4" />
            <span className="capitalize">{quiz.difficulty}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link to={`/quiz/${quiz.id}`} className="block">
            <Button className="w-full">
              Start Quiz
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

export default QuizCard