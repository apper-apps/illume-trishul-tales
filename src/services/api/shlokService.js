import shlokData from "@/services/mockData/shlokas.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ShlokService {
  async getTodayShlok() {
    await delay(300)
    const today = new Date().toISOString().split("T")[0]
    let todayShlok = shlokData.find(s => s.date === today)
    
    if (!todayShlok) {
      const randomIndex = Math.floor(Math.random() * shlokData.length)
      todayShlok = { ...shlokData[randomIndex], date: today }
    }
    
    return { ...todayShlok }
  }

  async getById(id) {
    await delay(200)
    const shlok = shlokData.find(s => s.Id === id)
    if (!shlok) {
      throw new Error("Shlok not found")
    }
    return { ...shlok }
  }

  async getArchive() {
    await delay(400)
    return [...shlokData].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getByDate(date) {
    await delay(200)
    const dateStr = date.toISOString().split("T")[0]
    const shlok = shlokData.find(s => s.date === dateStr)
    return shlok ? { ...shlok } : null
  }
}

export const shlokService = new ShlokService()