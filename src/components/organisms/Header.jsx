import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TrishulIcon from "@/components/molecules/TrishulIcon";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { logout } = useContext(AuthContext) || {}
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false
  const user = userState?.user

const navigation = [
    { name: "Home", href: "/" },
    { name: "Quiz", href: "/quiz" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Daily Shlok", href: "/shlok" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ]
  
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    return path !== "/" && location.pathname.startsWith(path)
  }
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gold-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <TrishulIcon size={32} className="text-saffron-600" animated />
            <div>
              <h1 className="text-xl font-bold text-gradient">Trishul Tales</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Wisdom of Hindu Traditions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
<div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-saffron-600 border-b-2 border-saffron-600"
                    : "text-gray-700 hover:text-saffron-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

{/* User section and Mobile menu button */}
          <div className="flex items-center gap-4">
            {/* User info and logout for authenticated admin users */}
            {isAuthenticated && user && (
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-600">Welcome, </span>
                  <span className="font-medium text-saffron-600">
                    {user.firstName || user.name || 'Admin'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}

            {/* Admin Login button for unauthenticated users */}
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="LogIn" className="w-4 h-4" />
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-gold-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-saffron-600 bg-saffron-50"
                        : "text-gray-700 hover:text-saffron-600 hover:bg-saffron-50"
                    }`}
>
                    {item.name}
                  </Link>
                ))}
                
{/* Mobile user section */}
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t border-gold-200">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Logged in as: <span className="font-medium text-saffron-600">
                        {user.firstName || user.name || 'Admin'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <ApperIcon name="LogOut" className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gold-200">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-saffron-600 hover:bg-saffron-50 rounded-lg flex items-center gap-2"
                    >
                      <ApperIcon name="LogIn" className="w-4 h-4" />
                      Admin Login
                    </Link>
                  </div>
                )}
</div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header