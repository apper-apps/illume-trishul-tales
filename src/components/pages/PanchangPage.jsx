import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import PanchangCard from "@/components/organisms/PanchangCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { panchangService } from "@/services/api/panchangService"

const PanchangPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [panchangData, setPanchangData] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("daily") // daily or weekly

  useEffect(() => {
    if (viewMode === "daily") {
      loadDailyPanchang()
    } else {
      loadWeeklyPanchang()
    }
  }, [currentDate, viewMode])

  const loadDailyPanchang = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await panchangService.getPanchangByDate(currentDate)
      setPanchangData(data)
    } catch (err) {
      setError("Failed to load Panchang data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadWeeklyPanchang = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
      
      const weeklyPromises = weekDays.map(date => panchangService.getPanchangByDate(date))
      const weeklyResults = await Promise.all(weeklyPromises)
      
      setWeeklyData(weeklyResults)
    } catch (err) {
      setError("Failed to load weekly Panchang data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const navigateDate = (direction) => {
    if (viewMode === "daily") {
      setCurrentDate(prev => direction === "next" ? addDays(prev, 1) : subDays(prev, 1))
    } else {
      setCurrentDate(prev => direction === "next" ? addDays(prev, 7) : subDays(prev, 7))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Error message={error} onRetry={viewMode === "daily" ? loadDailyPanchang : loadWeeklyPanchang} />
        </div>
      </div>
    )
  }

  const formatDateDisplay = () => {
    if (viewMode === "daily") {
      return format(currentDate, "EEEE, MMMM d, yyyy")
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Hindu Panchang
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sacred Hindu calendar with daily tithi, nakshatra, yoga, karana, and auspicious timings
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="card-spiritual p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {formatDateDisplay()}
                  </h2>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                  className="flex items-center gap-2"
                >
                  Next
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  onClick={goToToday}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  Today
                </Button>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("daily")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      viewMode === "daily"
                        ? "bg-white text-saffron-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setViewMode("weekly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      viewMode === "weekly"
                        ? "bg-white text-saffron-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content */}
        {viewMode === "daily" ? (
          /* Daily View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            {panchangData && <PanchangCard panchang={panchangData} />}
          </motion.div>
        ) : (
          /* Weekly View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-spiritual p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Weekly Panchang Overview
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tithi</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nakshatra</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Yoga</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sunrise</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sunset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyData.map((dayData, index) => (
                      <motion.tr
                        key={dayData.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-saffron-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-800">
                              {format(new Date(dayData.date), "EEE, MMM d")}
                            </div>
                            {dayData.festivals && dayData.festivals.length > 0 && (
                              <div className="text-xs text-saffron-600 font-medium">
                                {dayData.festivals[0]}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{dayData.tithi}</td>
                        <td className="py-3 px-4 text-gray-700">{dayData.nakshatra}</td>
                        <td className="py-3 px-4 text-gray-700">{dayData.yoga}</td>
                        <td className="py-3 px-4 text-gray-700">{dayData.sunrise}</td>
                        <td className="py-3 px-4 text-gray-700">{dayData.sunset}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="card-spiritual p-8">
            <h3 className="text-2xl font-bold text-gradient mb-6 text-center">
              Understanding Panchang
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Moon" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Tithi</h4>
                <p className="text-sm text-gray-600">Lunar day based on moon phases</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Star" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Nakshatra</h4>
                <p className="text-sm text-gray-600">Constellation or star group</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Compass" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Yoga</h4>
                <p className="text-sm text-gray-600">Auspicious combination of sun and moon</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Circle" className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Karana</h4>
                <p className="text-sm text-gray-600">Half of a tithi period</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PanchangPage