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
      
      const params = {
fields: this.fields,
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
    
    if (!response.success) {
      const errorMessage = response.message || "Failed to fetch panchang data";
      console.error("Error fetching panchang in panchang service:", errorMessage);
      const { toast } = await import('react-toastify');
      toast.error(errorMessage);
      return null;
    }
    
    if (!response.data || response.data.length === 0) {
      console.log("No panchang data found for date:", dateStr);
      return null;
    }
      
      if (response.data && response.data.length > 0) {
        const panchang = response.data[0];
        // Parse festivals and muhurats if they are strings
        return {
          ...panchang,
          festivals: typeof panchang.festivals === 'string' ? 
            panchang.festivals.split(',').map(f => f.trim()).filter(f => f) : 
            panchang.festivals || [],
          muhurats: typeof panchang.muhurats === 'string' ? 
            JSON.parse(panchang.muhurats || '[]') : 
            panchang.muhurats || []
        };
      }
      
      // If no panchang for the date, get a random one and use it as base
      const randomParams = {
        fields: this.fields,
        pagingInfo: {
          limit: 1,
          offset: Math.floor(Math.random() * 10)
        }
      };
      
      const randomResponse = await apperClient.fetchRecords(this.tableName, randomParams);
      
      if (randomResponse.success && randomResponse.data && randomResponse.data.length > 0) {
        const basePanchang = randomResponse.data[0];
        return {
          ...basePanchang,
          Id: Date.now(),
          date: dateStr,
          festivals: typeof basePanchang.festivals === 'string' ? 
            basePanchang.festivals.split(',').map(f => f.trim()).filter(f => f) : 
            basePanchang.festivals || [],
          muhurats: typeof basePanchang.muhurats === 'string' ? 
            JSON.parse(basePanchang.muhurats || '[]') : 
            basePanchang.muhurats || []
        };
      }
      
      return null;
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