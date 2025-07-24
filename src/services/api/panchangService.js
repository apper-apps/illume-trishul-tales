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