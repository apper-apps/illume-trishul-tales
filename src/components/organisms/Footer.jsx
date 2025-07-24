import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import TrishulIcon from "@/components/molecules/TrishulIcon"
import OmSymbol from "@/components/molecules/OmSymbol"
import LotusDecoration from "@/components/molecules/LotusDecoration"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Quiz", href: "/quiz" },
    { name: "Panchang", href: "/panchang" },
    { name: "Daily Shlok", href: "/shlok" },
    { name: "Blog", href: "/blog" }
  ]

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "YouTube", icon: "Youtube", href: "#" }
  ]

  return (
    <footer className="bg-gradient-to-br from-saffron-900 via-orange-800 to-saffron-800 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <OmSymbol className="absolute top-10 left-10" size={100} />
        <LotusDecoration className="absolute bottom-10 right-10" size={80} />
        <TrishulIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" size={120} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <TrishulIcon size={40} className="text-gold-400" />
              <div>
                <h3 className="text-2xl font-bold">Trishul Tales</h3>
                <p className="text-orange-200">Discover the Wisdom of Hindu Traditions</p>
              </div>
            </div>
            <p className="text-orange-200 mb-6 max-w-md">
              Explore the rich heritage of Hindu culture through interactive quizzes, daily spiritual wisdom, and timeless traditions that connect us to our roots.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-300">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-orange-200 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-300">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4 text-gold-400" />
                <span className="text-orange-200">info@trishultales.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="MapPin" className="w-4 h-4 text-gold-400" />
                <span className="text-orange-200">India</span>
              </li>
              <li>
                <Link 
                  to="/contact"
                  className="text-orange-200 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <ApperIcon name="MessageCircle" className="w-4 h-4 text-gold-400" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-orange-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-orange-200 text-sm mb-4 md:mb-0">
              © {currentYear} Trishul Tales. All rights reserved. | Made with 🙏 for Hindu Culture
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-orange-200 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-orange-200 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer