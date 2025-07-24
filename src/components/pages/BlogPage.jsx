import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import LotusDecoration from "@/components/molecules/LotusDecoration"

const BlogPage = () => {
  const [articles, setArticles] = useState([])
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { value: "all", label: "All Articles" },
    { value: "festivals", label: "Festivals" },
    { value: "mythology", label: "Mythology" },
    { value: "traditions", label: "Traditions" },
    { value: "spirituality", label: "Spirituality" },
    { value: "philosophy", label: "Philosophy" }
  ]

  const mockArticles = [
    {
      Id: 1,
      title: "The Significance of Diwali: Festival of Lights",
      excerpt: "Explore the deep spiritual meaning behind Diwali celebrations and how this ancient festival continues to illuminate lives across the world.",
      content: "Diwali, also known as Deepavali, is one of the most celebrated festivals in Hinduism...",
      category: "festivals",
      author: "Spiritual Scholar",
      publishedDate: "2024-01-15",
      readTime: 8,
      imageUrl: "/blog/diwali.jpg",
      tags: ["Diwali", "Festivals", "Light", "Celebration"]
    },
    {
      Id: 2,
      title: "Lord Rama: The Ideal King and Divine Avatar",
      excerpt: "Discover the timeless teachings of Lord Rama from the Ramayana and their relevance in modern life.",
      content: "Lord Rama, the seventh avatar of Lord Vishnu, exemplifies the perfect human being...",
      category: "mythology",
      author: "Mythology Expert",
      publishedDate: "2024-01-10",
      readTime: 12,
      imageUrl: "/blog/rama.jpg",
      tags: ["Rama", "Ramayana", "Avatar", "Dharma"]
    },
    {
      Id: 3,
      title: "The Art of Meditation in Hindu Tradition",
      excerpt: "Learn about the ancient practice of meditation as described in Hindu scriptures and its modern applications.",
      content: "Meditation, or Dhyana, has been a cornerstone of Hindu spiritual practice for millennia...",
      category: "spirituality",
      author: "Meditation Teacher",
      publishedDate: "2024-01-05",
      readTime: 10,
      imageUrl: "/blog/meditation.jpg",
      tags: ["Meditation", "Dhyana", "Spirituality", "Practice"]
    },
    {
      Id: 4,
      title: "Understanding Karma: The Law of Cause and Effect",
      excerpt: "Delve into the profound concept of Karma and how it shapes our spiritual journey.",
      content: "Karma, derived from the Sanskrit word meaning 'action', is one of the fundamental principles...",
      category: "philosophy",
      author: "Philosophy Scholar",
      publishedDate: "2024-01-01",
      readTime: 15,
      imageUrl: "/blog/karma.jpg",
      tags: ["Karma", "Philosophy", "Action", "Spirituality"]
    },
    {
      Id: 5,
      title: "Sacred Traditions of Hindu Wedding Ceremonies",
      excerpt: "Explore the beautiful rituals and their meanings in traditional Hindu wedding ceremonies.",
      content: "Hindu weddings are rich tapestries of ancient traditions, each ritual carrying deep spiritual significance...",
      category: "traditions",
      author: "Cultural Expert",
      publishedDate: "2023-12-25",
      readTime: 9,
      imageUrl: "/blog/wedding.jpg",
      tags: ["Wedding", "Traditions", "Ceremony", "Culture"]
    },
    {
      Id: 6,
      title: "The Mahabharata: Lessons for Modern Life",
      excerpt: "Discover how the epic Mahabharata provides guidance for navigating contemporary challenges.",
      content: "The Mahabharata, often called the greatest epic ever written, contains profound wisdom...",
      category: "mythology",
      author: "Epic Scholar",
      publishedDate: "2023-12-20",
      readTime: 18,
      imageUrl: "/blog/mahabharata.jpg",
      tags: ["Mahabharata", "Epic", "Wisdom", "Life Lessons"]
    }
  ]

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setArticles(mockArticles)
      setFeaturedArticle(mockArticles[0])
    } catch (err) {
      setError("Failed to load articles. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => 
    selectedCategory === "all" || article.category === selectedCategory
  ).filter(article => article.Id !== featuredArticle?.Id)

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
          <Error message={error} onRetry={loadArticles} />
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
            Cultural Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Hindu culture, traditions, mythology, and spiritual wisdom through our carefully curated articles
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-gradient-saffron text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-saffron-50 hover:text-saffron-600 border border-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="card-spiritual overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto bg-gradient-saffron flex items-center justify-center">
                  <LotusDecoration size={100} className="text-white opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-medium px-3 py-1 bg-white/20 rounded-full">
                      Featured Article
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-saffron-100 text-saffron-700 text-xs font-medium rounded-full capitalize">
                      {featuredArticle.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(featuredArticle.publishedDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="User" className="w-4 h-4" />
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        {featuredArticle.readTime} min read
                      </span>
                    </div>
                    <Link to={`/blog/${featuredArticle.Id}`}>
                      <Button size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Empty
            title="No articles found"
            description="Try selecting a different category to see more articles"
            actionText="View All Articles"
            onAction={() => setSelectedCategory("all")}
            icon="BookOpen"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="card-spiritual h-full flex flex-col overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center">
                      <LotusDecoration size={60} className="text-saffron-300 opacity-50" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-2 py-1 bg-saffron-100 text-saffron-700 text-xs font-medium rounded-full capitalize">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(article.publishedDate).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ApperIcon name="User" className="w-3 h-3" />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <ApperIcon name="Clock" className="w-3 h-3" />
                            {article.readTime} min
                          </span>
                        </div>
                        <Link to={`/blog/${article.Id}`}>
                          <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700">
                            Read
                            <ApperIcon name="ArrowRight" className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="card-spiritual p-8 text-center">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Stay Updated with Hindu Wisdom
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles on Hindu culture, spirituality, and traditions delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none"
              />
              <Button>Subscribe</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default BlogPage