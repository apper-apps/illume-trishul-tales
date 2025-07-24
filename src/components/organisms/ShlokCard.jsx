import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import LotusDecoration from "@/components/molecules/LotusDecoration";

const ShlokCard = ({ shlok }) => {
  if (!shlok) {
    return null;
  }
  
  const [copied, setCopied] = useState(false)
  const [showImageShare, setShowImageShare] = useState(false)
  const [customName, setCustomName] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
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
const generateShlokImage = async () => {
    setIsGeneratingImage(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = 800
      canvas.height = 1000
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#FFF8F3')
      gradient.addColorStop(0.5, '#FFF0E6')
      gradient.addColorStop(1, '#FFE0CC')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add decorative border
      ctx.strokeStyle = '#FF6B35'
      ctx.lineWidth = 8
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
      
      // Add inner border
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
      
      // Set text properties
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1f2937'
      
      // Title
      ctx.font = 'bold 32px Arial'
      ctx.fillText('आज का श्लोक', canvas.width / 2, 120)
      ctx.font = '20px Arial'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('Daily Spiritual Wisdom', canvas.width / 2, 150)
      
      // Sanskrit text
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 24px Arial'
      const sanskritLines = wrapText(ctx, shlok.sanskrit, canvas.width - 120)
      let yPosition = 220
      sanskritLines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, yPosition)
        yPosition += 35
      })
      
      // Hindi text
      yPosition += 20
      ctx.font = '20px Arial'
      ctx.fillStyle = '#374151'
      const hindiLines = wrapText(ctx, shlok.hindi, canvas.width - 120)
      hindiLines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, yPosition)
        yPosition += 30
      })
      
      // English text
      yPosition += 20
      ctx.font = 'italic 18px Arial'
      ctx.fillStyle = '#4b5563'
      const englishLines = wrapText(ctx, `"${shlok.english}"`, canvas.width - 120)
      englishLines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, yPosition)
        yPosition += 28
      })
      
      // Source
      yPosition += 30
      ctx.font = '16px Arial'
      ctx.fillStyle = '#6b7280'
      ctx.fillText(`— ${shlok.source}`, canvas.width / 2, yPosition)
      
      // Custom name (if provided)
      if (customName.trim()) {
        yPosition += 60
        ctx.font = 'bold 20px Arial'
        ctx.fillStyle = '#FF6B35'
        ctx.fillText(`Shared by: ${customName.trim()}`, canvas.width / 2, yPosition)
      }
      
      // Footer
      ctx.font = '16px Arial'
      ctx.fillStyle = '#9ca3af'
      ctx.fillText('🕉️ Trishul Tales', canvas.width / 2, canvas.height - 80)
      ctx.fillText('Hindu Culture & Wisdom', canvas.width / 2, canvas.height - 55)
      
      return canvas
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image')
      return null
    } finally {
      setIsGeneratingImage(false)
    }
  }
  
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  const handleImageShare = async (action) => {
    const canvas = await generateShlokImage()
    if (!canvas) return
    
    try {
      if (action === 'download') {
        const link = document.createElement('a')
        link.download = `shlok-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
        toast.success('Image downloaded successfully!')
} else if (action === 'share') {
        canvas.toBlob(async (blob) => {
          try {
            // Check if File constructor exists and Web Share API supports files
            if (typeof window !== 'undefined' && window.File && navigator.share && navigator.canShare) {
              const file = new window.File([blob], 'shlok.png', { type: 'image/png' })
              const canShareFiles = await navigator.canShare({ files: [file] })
              
              if (canShareFiles) {
                await navigator.share({
                  title: 'Daily Shlok',
                  text: 'Check out this beautiful Shlok!',
                  files: [file]
                })
                toast.success('Image shared successfully!')
                return
              }
            }
            // Fallback to download
            const link = document.createElement('a')
            link.download = `shlok-${Date.now()}.png`
            link.href = URL.createObjectURL(blob)
            link.click()
            toast.success('Image downloaded! You can now share it manually.')
          } catch (error) {
            console.error('Share failed:', error)
            // Fallback to download
            const link = document.createElement('a')
            link.download = `shlok-${Date.now()}.png`
            link.href = URL.createObjectURL(blob)
            link.click()
            toast.success('Image downloaded! You can now share it manually.')
          }
        }, 'image/png')
      }
    } catch (error) {
      console.error('Error handling image:', error)
      toast.error('Failed to process image')
    }
  }

const handleShare = (platform) => {
    const url = window.location.href
    let text = ""
    let shareUrl = ""
    
    switch (platform) {
      case "whatsapp":
        // Special format for WhatsApp to match the desired output
        text = `${shlok.sanskrit}

${shlok.hindi}

${shlok.english}

- ${shlok.source}${customName.trim() ? `

Shared by: ${customName.trim()}` : ''}

From Trishul Tales
${url}`
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        break
      case "twitter":
        text = `${shlok.sanskrit}\n\n${shlok.hindi}\n\n${shlok.english}\n\n- ${shlok.source}${customName.trim() ? `\n\nShared by: ${customName.trim()}` : ''}\n\nFrom Trishul Tales`
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        text = `${shlok.sanskrit}\n\n${shlok.hindi}\n\n${shlok.english}\n\n- ${shlok.source}${customName.trim() ? `\n\nShared by: ${customName.trim()}` : ''}\n\nFrom Trishul Tales`
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

        {/* Custom Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (optional - will appear on shared content)
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border-2 border-saffron-200 rounded-lg focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20"
            maxLength={50}
          />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Text Sharing */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <ApperIcon name={copied ? "Check" : "Copy"} className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Text"}
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

          {/* Image Sharing */}
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageShare(!showImageShare)}
              className="flex items-center gap-2 mx-auto mb-3 text-saffron-600 border-saffron-500 hover:bg-saffron-50"
            >
              <ApperIcon name="Image" className="w-4 h-4" />
              Share as Image
              <ApperIcon name={showImageShare ? "ChevronUp" : "ChevronDown"} className="w-4 h-4" />
            </Button>

            {showImageShare && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageShare('share')}
                  disabled={isGeneratingImage}
                  className="flex items-center gap-2"
                >
                  {isGeneratingImage ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ApperIcon name="Share2" className="w-4 h-4" />
                  )}
                  Share Image
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageShare('download')}
                  disabled={isGeneratingImage}
                  className="flex items-center gap-2"
                >
                  {isGeneratingImage ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ApperIcon name="Download" className="w-4 h-4" />
                  )}
                  Download Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ShlokCard