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
                Weekly Panchang Calendar
              </h3>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weeklyData.map((dayData, index) => {
                  const dayDate = new Date(dayData.date)
                  const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  const hasFestivals = dayData.festivals && dayData.festivals.length > 0
                  const hasMuhurats = dayData.muhurats && dayData.muhurats.length > 0
                  
                  return (
                    <motion.div
                      key={dayData.date}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                        isToday
                          ? 'border-saffron-500 bg-saffron-50 shadow-md'
                          : hasFestivals
                          ? 'border-gold-400 bg-gold-50 hover:border-gold-500'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Date Header */}
                      <div className="text-center mb-3">
                        <div className={`text-lg font-bold ${
                          isToday ? 'text-saffron-700' : 'text-gray-800'
                        }`}>
                          {format(dayDate, 'EEE')}
                        </div>
                        <div className={`text-sm ${
                          isToday ? 'text-saffron-600' : 'text-gray-600'
                        }`}>
                          {format(dayDate, 'MMM d')}
                        </div>
                      </div>

                      {/* Festival Indicator */}
                      {hasFestivals && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-gradient-saffron rounded-full animate-pulse"></div>
                        </div>
                      )}

                      {/* Festivals */}
                      {hasFestivals && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-saffron-700 bg-saffron-100 px-2 py-1 rounded-full text-center">
                            <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                            {dayData.festivals[0]}
                          </div>
                        </div>
                      )}

                      {/* Key Panchang Info */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tithi:</span>
                          <span className="font-medium text-gray-700 text-right">
                            {dayData.tithi.split(' ')[0]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nakshatra:</span>
                          <span className="font-medium text-gray-700">
                            {dayData.nakshatra}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sunrise:</span>
                          <span className="font-medium text-gray-700">
                            {dayData.sunrise}
                          </span>
                        </div>
                      </div>

                      {/* Muhurat Timings */}
                      {hasMuhurats && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-600 mb-2 font-medium">
                            <ApperIcon name="Clock" className="w-3 h-3 inline mr-1" />
                            Muhurat Times:
                          </div>
                          <div className="space-y-1">
                            {dayData.muhurats.slice(0, 2).map((muhurat, idx) => (
                              <div key={idx} className="text-xs">
                                <div className={`font-medium ${
                                  muhurat.type === 'festival' ? 'text-gold-700' :
                                  muhurat.type === 'spiritual' ? 'text-saffron-600' :
                                  'text-orange-600'
                                }`}>
                                  {muhurat.name}
                                </div>
                                <div className="text-gray-600">
                                  {muhurat.time}
                                </div>
                              </div>
                            ))}
                            {dayData.muhurats.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayData.muhurats.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Weekly Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gradient-to-br from-saffron-50 to-saffron-100 p-4 rounded-lg">
                    <ApperIcon name="Calendar" className="w-6 h-6 mx-auto mb-2 text-saffron-600" />
                    <div className="text-sm font-medium text-saffron-800">
                      {weeklyData.filter(d => d.festivals && d.festivals.length > 0).length} Festivals
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gold-50 to-gold-100 p-4 rounded-lg">
                    <ApperIcon name="Clock" className="w-6 h-6 mx-auto mb-2 text-gold-600" />
                    <div className="text-sm font-medium text-gold-800">
                      {weeklyData.reduce((acc, d) => acc + (d.muhurats ? d.muhurats.length : 0), 0)} Muhurat Times
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <ApperIcon name="Star" className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm font-medium text-orange-800">
                      {new Set(weeklyData.map(d => d.nakshatra)).size} Nakshatras
                    </div>
                  </div>
                </div>
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