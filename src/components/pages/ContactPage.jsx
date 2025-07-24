import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import TrishulIcon from "@/components/molecules/TrishulIcon"
import OmSymbol from "@/components/molecules/OmSymbol"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: "Mail",
      title: "Email Us",
      description: "Send us your questions or feedback",
      contact: "info@trishultales.com",
      action: "mailto:info@trishultales.com"
    },
    {
      icon: "MapPin",
      title: "Location",
      description: "Serving the global Hindu community",
      contact: "India & Worldwide",
      action: null
    },
    {
      icon: "Clock",
      title: "Response Time",
      description: "We typically respond within",
      contact: "24-48 hours",
      action: null
    }
  ]

  const socialLinks = [
    { icon: "Twitter", name: "Twitter", url: "#" },
    { icon: "Instagram", name: "Instagram", url: "#" },
    { icon: "Facebook", name: "Facebook", url: "#" },
    { icon: "Youtube", name: "YouTube", url: "#" }
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
          <TrishulIcon size={60} className="text-saffron-600 mx-auto mb-6" animated />
          <h1 className="text-4xl font-bold text-gradient mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or suggestions, 
            feel free to reach out to our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={info.title} className="card-spiritual p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name={info.icon} className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{info.description}</p>
                        {info.action ? (
                          <a
                            href={info.action}
                            className="text-saffron-600 font-medium hover:text-saffron-700 transition-colors duration-200"
                          >
                            {info.contact}
                          </a>
                        ) : (
                          <p className="text-gray-800 font-medium">{info.contact}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <Card className="card-spiritual p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 bg-gradient-saffron rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    aria-label={social.name}
                  >
                    <ApperIcon name={social.icon} className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="card-spiritual p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-5">
                <OmSymbol size={80} className="text-saffron-400" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <FormField
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this about?"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 p-4 bg-saffron-50 rounded-lg border border-saffron-200">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-saffron-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-saffron-800">
                        <strong>Quick Response:</strong> For urgent queries, you can also reach us through our social media channels. 
                        We're active on all platforms and respond quickly to messages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="card-spiritual p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "How accurate is the Panchang data?",
                  answer: "Our Panchang data is sourced from authentic Hindu calendar calculations and is regularly updated to ensure accuracy."
                },
                {
                  question: "Can I suggest new quiz questions?",
                  answer: "Absolutely! We welcome suggestions for new quiz questions. Please use the contact form to share your ideas."
                },
                {
                  question: "Is the content suitable for beginners?",
                  answer: "Yes, our content is designed for all levels, from beginners to advanced learners of Hindu culture."
                },
                {
                  question: "How often is new content added?",
                  answer: "We add new Shlokas daily and regularly update our quiz database with fresh questions and blog articles."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <ApperIcon name="HelpCircle" className="w-5 h-5 text-saffron-600" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage