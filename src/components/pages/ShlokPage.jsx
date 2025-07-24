import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ShlokCard from "@/components/organisms/ShlokCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { shlokService } from "@/services/api/shlokService"

const ShlokPage = () => {
  const [todayShlok, setTodayShlok] = useState(null)
  const [archiveShlokas, setArchiveShlokas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showArchive, setShowArchive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadShlokData()
  }, [])

  const loadShlokData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [todayData, archiveData] = await Promise.all([
        shlokService.getTodayShlok(),
        shlokService.getArchive()
      ])

      setTodayShlok(todayData)
      setArchiveShlokas(archiveData)
    } catch (err) {
      setError("Failed to load Shlokas. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredShlokas = archiveShlokas.filter(shlok =>
    shlok.sanskrit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shlok.hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shlok.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shlok.source.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Loading type="shlok" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Error message={error} onRetry={loadShlokData} />
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
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Daily Spiritual Wisdom
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover profound Sanskrit Shlokas with Hindi and English translations to enrich your spiritual journey
          </p>
        </motion.div>

        {/* Today's Shlok */}
        {todayShlok && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <ShlokCard shlok={todayShlok} />
          </motion.div>
        )}

        {/* Archive Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="card-spiritual p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Shlok Archive</h2>
                <p className="text-gray-600">Explore our collection of spiritual wisdom</p>
              </div>
              <Button
                onClick={() => setShowArchive(!showArchive)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ApperIcon name={showArchive ? "ChevronUp" : "ChevronDown"} className="w-4 h-4" />
                {showArchive ? "Hide Archive" : "View Archive"}
              </Button>
            </div>

            {showArchive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gold-200 pt-6"
              >
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Shlokas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Archive Grid */}
                {filteredShlokas.length === 0 ? (
                  <Empty
                    title="No Shlokas found"
                    description="Try adjusting your search terms"
                    icon="BookOpen"
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredShlokas.map((shlok, index) => (
                      <motion.div
                        key={shlok.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="border border-gold-200 rounded-lg p-6 bg-white hover:shadow-lg transition-all duration-300">
                          {/* Date */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">
                              {new Date(shlok.date).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                            <span className="text-xs text-saffron-600 font-medium px-2 py-1 bg-saffron-50 rounded-full">
                              {shlok.source}
                            </span>
                          </div>

                          {/* Sanskrit */}
                          <div className="mb-3 p-3 bg-saffron-50 rounded border-l-4 border-saffron-500">
                            <p className="font-semibold text-gray-800 text-sm" dir="ltr">
                              {shlok.sanskrit}
                            </p>
                          </div>

                          {/* Hindi */}
                          <div className="mb-3 p-3 bg-gold-50 rounded border-l-4 border-gold-500">
                            <p className="text-gray-700 text-sm" dir="ltr">
                              {shlok.hindi}
                            </p>
                          </div>

                          {/* English */}
                          <div className="mb-4 p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                            <p className="text-gray-700 text-sm italic">
                              "{shlok.english}"
                            </p>
                          </div>

                          {/* Meaning */}
                          {shlok.meaning && (
                            <div className="p-3 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600 leading-relaxed">
                                <strong>Meaning:</strong> {shlok.meaning}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="card-spiritual p-8 text-center">
            <h3 className="text-2xl font-bold text-gradient mb-6">
              Benefits of Daily Shlok Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Heart" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Inner Peace</h4>
                <p className="text-sm text-gray-600">Find tranquility and spiritual balance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Brain" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Wisdom</h4>
                <p className="text-sm text-gray-600">Gain ancient knowledge and insights</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Sparkles" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Spiritual Growth</h4>
                <p className="text-sm text-gray-600">Deepen your spiritual understanding</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ShlokPage