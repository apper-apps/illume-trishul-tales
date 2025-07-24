import panchangData from "@/services/mockData/panchang.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PanchangService {
  async getTodayPanchang() {
    await delay(300)
    const today = new Date().toISOString().split("T")[0]
    return this.getPanchangByDate(new Date(today))
  }

  async getPanchangByDate(date) {
    await delay(250)
    const dateStr = date.toISOString().split("T")[0]
    
    let panchang = panchangData.find(p => p.date === dateStr)
    
    if (!panchang) {
      const baseIndex = Math.floor(Math.random() * panchangData.length)
      const basePanchang = panchangData[baseIndex]
      
      panchang = {
        ...basePanchang,
        Id: Date.now(),
        date: dateStr
      }
    }
    
    return { ...panchang }
  }

  async getWeeklyPanchang(startDate) {
    await delay(400)
    const weekData = []
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dayData = await this.getPanchangByDate(currentDate)
weekData.push(dayData)
    }
    
    return weekData
  }

  async getFestivalMuhurats(date) {
    await delay(200)
    const panchang = await this.getPanchangByDate(date)
    
    if (panchang.festivals && panchang.festivals.length > 0) {
      return panchang.muhurats || []
    }
    
    return []
  }

  async getAuspiciousPeriods(date) {
    await delay(150)
    const panchang = await this.getPanchangByDate(date)
    
    // Return general auspicious periods based on yoga and nakshatra
    const auspiciousPeriods = []
    
    if (panchang.yoga === 'Siddha' || panchang.yoga === 'Siddhi') {
      auspiciousPeriods.push({
        name: 'Siddha Yoga Period',
        time: '06:00 AM - 08:00 AM',
        type: 'general'
      })
    }
    
    if (panchang.nakshatra === 'Rohini' || panchang.nakshatra === 'Pushya') {
      auspiciousPeriods.push({
        name: 'Auspicious Nakshatra',
        time: '10:00 AM - 12:00 PM',
        type: 'nakshatra'
      })
    }
    
    return auspiciousPeriods
  }

  async getMonthlyPanchang(year, month) {
    await delay(600)
    const monthData = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const dayData = await this.getPanchangByDate(currentDate)
      monthData.push(dayData)
    }
    
    return monthData
  }
}

export const panchangService = new PanchangService()