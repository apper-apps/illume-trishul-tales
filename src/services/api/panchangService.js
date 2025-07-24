const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PanchangService {
  constructor() {
    this.tableName = 'panchang';
    this.fields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "date" } },
      { "field": { "Name": "tithi" } },
      { "field": { "Name": "nakshatra" } },
      { "field": { "Name": "yoga" } },
      { "field": { "Name": "karana" } },
      { "field": { "Name": "sunrise" } },
      { "field": { "Name": "sunset" } },
      { "field": { "Name": "moonrise" } },
      { "field": { "Name": "moonset" } },
      { "field": { "Name": "festivals" } },
      { "field": { "Name": "muhurats" } }
    ];
  }

  async getTodayPanchang() {
    try {
      await delay(300);
      const today = new Date().toISOString().split("T")[0];
      return this.getPanchangByDate(new Date(today));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's panchang:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async getPanchangByDate(date) {
    try {
      await delay(250);
      const dateStr = date.toISOString().split("T")[0];
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Query for specific date first
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "tithi" } },
          { "field": { "Name": "nakshatra" } },
          { "field": { "Name": "yoga" } },
          { "field": { "Name": "karana" } },
          { "field": { "Name": "sunrise" } },
          { "field": { "Name": "sunset" } },
          { "field": { "Name": "moonrise" } },
          { "field": { "Name": "moonset" } },
          { "field": { "Name": "festivals" } },
          { "field": { "Name": "muhurats" } }
        ],
        where: [
          {
            "FieldName": "date",
            "Operator": "EqualTo",
            "Values": [dateStr]
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
// Handle response error
      if (!response.success) {
        console.error("Error fetching panchang in panchang service:", response.message);
        return null; // Return null instead of throwing to allow graceful handling
      }
      
      // If we found data for the specific date, return it
      if (response.data && response.data.length > 0) {
        const panchang = response.data[0];
        // Parse festivals and muhurats if they are strings
        return {
          ...panchang,
          festivals: typeof panchang.festivals === 'string' ? 
            panchang.festivals.split(',').map(f => f.trim()).filter(f => f) : 
            panchang.festivals || [],
          muhurats: typeof panchang.muhurats === 'string' ? 
            (() => {
              try {
                return JSON.parse(panchang.muhurats || '[]');
              } catch (e) {
                console.warn("Failed to parse muhurats JSON:", e);
                return [];
              }
            })() : 
            panchang.muhurats || []
        };
      }
      
      console.log("No panchang data found for date:", dateStr);
      
      // If no panchang for the date, get a random one and use it as base
      const randomParams = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "tithi" } },
          { "field": { "Name": "nakshatra" } },
          { "field": { "Name": "yoga" } },
          { "field": { "Name": "karana" } },
          { "field": { "Name": "sunrise" } },
          { "field": { "Name": "sunset" } },
          { "field": { "Name": "moonrise" } },
          { "field": { "Name": "moonset" } },
          { "field": { "Name": "festivals" } },
          { "field": { "Name": "muhurats" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: Math.floor(Math.random() * 10)
        }
      };
      
      const randomResponse = await apperClient.fetchRecords(this.tableName, randomParams);
      
// Handle random response error
      if (!randomResponse.success) {
        console.error("Error fetching fallback panchang in panchang service:", randomResponse.message);
        return null; // Return null instead of throwing to allow graceful handling
      }
      
      if (randomResponse.data && randomResponse.data.length > 0) {
        const basePanchang = randomResponse.data[0];
        return {
          ...basePanchang,
          Id: Date.now(),
          date: dateStr,
          festivals: typeof basePanchang.festivals === 'string' ? 
            basePanchang.festivals.split(',').map(f => f.trim()).filter(f => f) : 
            basePanchang.festivals || [],
          muhurats: typeof basePanchang.muhurats === 'string' ? 
            (() => {
              try {
                return JSON.parse(basePanchang.muhurats || '[]');
              } catch (e) {
                console.warn("Failed to parse muhurats JSON:", e);
                return [];
              }
            })() : 
            basePanchang.muhurats || []
        };
      }
      
      // If both queries fail, throw error
      throw new Error("No panchang data available");
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching panchang by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getWeeklyPanchang(startDate) {
    try {
      await delay(400);
      const weekData = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayData = await this.getPanchangByDate(currentDate);
        if (dayData) {
          weekData.push(dayData);
        }
      }
      
      return weekData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching weekly panchang:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getFestivalMuhurats(date) {
    try {
      await delay(200);
      const panchang = await this.getPanchangByDate(date);
      
      if (panchang && panchang.festivals && panchang.festivals.length > 0) {
        return panchang.muhurats || [];
      }
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching festival muhurats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getAuspiciousPeriods(date) {
    try {
      await delay(150);
      const panchang = await this.getPanchangByDate(date);
      
      if (!panchang) return [];
      
      const auspiciousPeriods = [];
      
      if (panchang.yoga === 'Siddha' || panchang.yoga === 'Siddhi') {
        auspiciousPeriods.push({
          name: 'Siddha Yoga Period',
          time: '06:00 AM - 08:00 AM',
          type: 'general'
        });
      }
      
      if (panchang.nakshatra === 'Rohini' || panchang.nakshatra === 'Pushya') {
        auspiciousPeriods.push({
          name: 'Auspicious Nakshatra',
          time: '10:00 AM - 12:00 PM',
          type: 'nakshatra'
        });
      }
      
      return auspiciousPeriods;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching auspicious periods:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getMonthlyPanchang(year, month) {
    try {
      await delay(600);
      const monthData = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayData = await this.getPanchangByDate(currentDate);
        if (dayData) {
          monthData.push(dayData);
        }
      }
      
      return monthData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching monthly panchang:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const panchangService = new PanchangService()