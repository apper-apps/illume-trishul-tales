import React from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import TrishulIcon from "@/components/molecules/TrishulIcon"
import OmSymbol from "@/components/molecules/OmSymbol"
import LotusDecoration from "@/components/molecules/LotusDecoration"

const AboutPage = () => {
  const features = [
    {
      icon: "Brain",
      title: "Interactive Learning",
      description: "Engage with Hindu culture through interactive quizzes that test your knowledge of mythology, traditions, and spiritual practices."
    },
    {
      icon: "BookOpen",
      title: "Daily Wisdom",
      description: "Discover profound Sanskrit Shlokas with Hindi and English translations to enrich your spiritual journey every day."
    },
    {
      icon: "Calendar",
      title: "Sacred Calendar",
      description: "Access accurate Panchang data with daily tithi, nakshatra, yoga, karana, and auspicious timings for spiritual practice."
    },
    {
      icon: "Share2",
      title: "Community Sharing",
      description: "Share spiritual wisdom and quiz achievements with friends and family through social media integration."
    }
  ]

  const values = [
    {
      icon: "Heart",
      title: "Authenticity",
      description: "We ensure all content is authentic and sourced from traditional Hindu scriptures and teachings."
    },
    {
      icon: "Users",
      title: "Accessibility",
      description: "Making Hindu wisdom accessible to everyone, regardless of their background or level of knowledge."
    },
    {
      icon: "Sparkles",
      title: "Respect",
      description: "We approach all traditions and practices with deep respect and cultural sensitivity."
    },
    {
      icon: "Globe",
      title: "Global Reach",
      description: "Connecting Hindus worldwide and sharing our beautiful culture with the global community."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-gold-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <TrishulIcon size={80} className="text-saffron-600 mx-auto mb-6" animated />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-6">
            About Trishul Tales
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Trishul Tales is a digital platform dedicated to celebrating and preserving the rich heritage of Hindu culture. 
            We bridge ancient wisdom with modern technology to make Hindu traditions accessible and engaging for everyone.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="card-spiritual p-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <OmSymbol size={60} className="text-saffron-400" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <LotusDecoration size={80} className="text-gold-400" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gradient mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                To preserve, promote, and share the timeless wisdom of Hindu culture through innovative digital experiences. 
                We believe that ancient knowledge should be accessible to all, helping people connect with their spiritual roots 
                and discover the profound teachings that have guided humanity for millennia.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600">
              Discover the features that make Trishul Tales your gateway to Hindu wisdom
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="card-spiritual p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work and shape our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="card-spiritual p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name={value.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <Card className="card-spiritual p-8 bg-gradient-to-br from-saffron-900 via-orange-800 to-saffron-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <TrishulIcon className="absolute top-10 right-10" size={100} />
              <OmSymbol className="absolute bottom-10 left-10" size={80} />
            </div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                <p className="text-lg opacity-90">
                  Growing community of people exploring Hindu culture
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { number: "10,000+", label: "Active Learners" },
                  { number: "500+", label: "Quiz Questions" },
                  { number: "365", label: "Daily Shlokas" },
                  { number: "100%", label: "Authentic Content" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-lg opacity-90">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <Card className="card-spiritual p-8">
            <h2 className="text-3xl font-bold text-gradient mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Start your journey of discovering Hindu wisdom today. Whether you're looking to learn about traditions, 
              test your knowledge, or find daily spiritual guidance, Trishul Tales is here to guide you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-3">
                <ApperIcon name="Brain" className="w-5 h-5" />
                Start Learning
              </Button>
              <Button variant="secondary" size="lg" className="flex items-center gap-3">
                <ApperIcon name="MessageCircle" className="w-5 h-5" />
                Contact Us
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage