const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ShlokService {
  constructor() {
    this.tableName = 'shlok';
this.fields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "sanskrit" } },
      { "field": { "Name": "hindi" } },
      { "field": { "Name": "english" } },
      { "field": { "Name": "meaning" } },
      { "field": { "Name": "source" } },
      { "field": { "Name": "date" } },
      { "field": { "Name": "shared_by" } },
      { "field": { "Name": "is_admin" } }
    ];
  }

async getTodayShlok() {
    try {
      await delay(300);
      const today = new Date().toISOString().split("T")[0];
      
      // Check if required environment variables are available
      if (!import.meta.env.VITE_APPER_PROJECT_ID || !import.meta.env.VITE_APPER_PUBLIC_KEY) {
        console.error("Error fetching today's shlok: Missing environment variables VITE_APPER_PROJECT_ID or VITE_APPER_PUBLIC_KEY");
        throw new Error("Application configuration error: Missing required environment variables");
      }
      
      // Check if ApperSDK is available
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        console.error("Error fetching today's shlok: ApperSDK is not loaded or ApperClient is not available");
        throw new Error("ApperSDK is not loaded. Please check if the SDK script is properly included.");
      }
      
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
            "Values": [today]
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching today's shlok:", response.message || "Unknown API error");
        throw new Error(response.message || "Failed to fetch shlok data from server");
      }
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      // If no shlok for today, get a random one
      const randomParams = {
        fields: this.fields,
        pagingInfo: {
          limit: 1,
          offset: Math.floor(Math.random() * 10)
        }
      };
      
      const randomResponse = await apperClient.fetchRecords(this.tableName, randomParams);
      
      if (randomResponse.success && randomResponse.data && randomResponse.data.length > 0) {
        return { ...randomResponse.data[0], date: today };
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's shlok:", error?.response?.data?.message);
      } else {
        console.error("Error fetching today's shlok:", error.message || "Unknown error occurred");
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.fields
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error("Shlok not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching shlok with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Shlok not found");
    }
  }

  async getArchive() {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.fields,
        orderBy: [
          {
            "fieldName": "date",
            "sorttype": "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching shlok archive:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByDate(date) {
    try {
      await delay(200);
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
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching shlok by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
}

export const shlokService = new ShlokService()