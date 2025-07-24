import React from "react"

const Loading = ({ type = "default" }) => {
  if (type === "quiz") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-saffron-200 to-gold-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gradient-to-r from-saffron-100 to-gold-100 rounded-lg"></div>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <div className="h-10 w-24 bg-gradient-to-r from-saffron-200 to-gold-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gradient-to-r from-saffron-200 to-gold-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "shlok") {
    return (
      <div className="card-spiritual p-8">
        <div className="animate-pulse text-center">
          <div className="h-6 bg-gradient-to-r from-saffron-200 to-gold-200 rounded mb-4"></div>
          <div className="h-4 bg-gradient-to-r from-saffron-100 to-gold-100 rounded mb-3"></div>
          <div className="h-4 bg-gradient-to-r from-saffron-100 to-gold-100 rounded mb-6"></div>
          <div className="h-8 w-32 bg-gradient-to-r from-saffron-200 to-gold-200 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-saffron-200 border-t-saffron-600 rounded-full mx-auto mb-4"></div>
        <p className="text-saffron-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loading