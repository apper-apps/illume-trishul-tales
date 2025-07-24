import React, { useState } from "react"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import LotusDecoration from "@/components/molecules/LotusDecoration"

const ShlokCard = ({ shlok }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const textToCopy = `${shlok.sanskrit}\n\n${shlok.hindi}\n\n${shlok.english}\n\n- ${shlok.source}`
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success("Shlok copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy shlok")
    }
  }

  const handleShare = (platform) => {
    const text = `${shlok.sanskrit}\n\n${shlok.hindi}\n\n${shlok.english}\n\n- ${shlok.source}\n\nFrom Trishul Tales`
    const url = window.location.href
    
    let shareUrl = ""
    
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
        break
      default:
        return
    }
    
    window.open(shareUrl, "_blank")
  }

  return (
    <Card className="card-spiritual p-8 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 opacity-10">
        <LotusDecoration size={60} className="text-saffron-400" />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gradient mb-2">आज का श्लोक</h3>
          <p className="text-sm text-gray-600">Today's Spiritual Wisdom</p>
        </div>

        {/* Sanskrit */}
        <div className="mb-6 p-4 bg-saffron-50 rounded-lg border-l-4 border-saffron-500">
          <p className="text-lg font-semibold text-gray-800 leading-relaxed" dir="ltr">
            {shlok.sanskrit}
          </p>
        </div>

        {/* Hindi */}
        <div className="mb-6 p-4 bg-gold-50 rounded-lg border-l-4 border-gold-500">
          <p className="text-base text-gray-700 leading-relaxed" dir="ltr">
            {shlok.hindi}
          </p>
        </div>

        {/* English */}
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
          <p className="text-base text-gray-700 leading-relaxed italic">
            "{shlok.english}"
          </p>
        </div>

        {/* Meaning */}
        {shlok.meaning && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Meaning:</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {shlok.meaning}
            </p>
          </div>
        )}

        {/* Source */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            — {shlok.source}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <ApperIcon name={copied ? "Check" : "Copy"} className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("whatsapp")}
            className="flex items-center gap-2 text-green-600 border-green-500 hover:bg-green-50"
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4" />
            WhatsApp
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 text-blue-600 border-blue-500 hover:bg-blue-50"
          >
            <ApperIcon name="Twitter" className="w-4 h-4" />
            Twitter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 text-blue-800 border-blue-800 hover:bg-blue-50"
          >
            <ApperIcon name="Facebook" className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ShlokCard