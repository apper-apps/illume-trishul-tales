import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import OmSymbol from "@/components/molecules/OmSymbol"

const PanchangCard = ({ panchang }) => {
  const panchangItems = [
    { label: "Tithi", value: panchang.tithi, icon: "Moon" },
    { label: "Nakshatra", value: panchang.nakshatra, icon: "Star" },
    { label: "Yoga", value: panchang.yoga, icon: "Compass" },
    { label: "Karana", value: panchang.karana, icon: "Circle" },
    { label: "Sunrise", value: panchang.sunrise, icon: "Sunrise" },
    { label: "Sunset", value: panchang.sunset, icon: "Sunset" }
  ]

  return (
    <Card className="card-spiritual p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 opacity-10">
        <OmSymbol size={50} className="text-saffron-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gradient mb-1">Today's Panchang</h3>
            <p className="text-sm text-gray-600">
              {new Date(panchang.date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          <ApperIcon name="Calendar" className="w-8 h-8 text-saffron-600" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {panchangItems.map((item) => (
            <div key={item.label} className="flex items-center space-x-3 p-3 bg-saffron-50 rounded-lg">
              <ApperIcon name={item.icon} className="w-5 h-5 text-saffron-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Festivals */}
        {panchang.festivals && panchang.festivals.length > 0 && (
          <div className="border-t border-gold-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-gold-600" />
              Today's Festivals
            </h4>
            <div className="flex flex-wrap gap-2">
              {panchang.festivals.map((festival, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-gold text-white text-xs font-medium rounded-full"
                >
                  {festival}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PanchangCard