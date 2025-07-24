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
      
      if (!response) {
        console.error("Error fetching today's shlok: No response received from server");
        throw new Error("No response received from server");
      }
      
      if (!response.success) {
        const errorMsg = response.message || response.error || "API request failed";
        console.error("Error fetching today's shlok:", errorMsg);
        throw new Error(errorMsg);
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
      let errorMessage = "Unknown error occurred";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error("Error fetching today's shlok from API:", errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        console.error("Error fetching today's shlok:", errorMessage);
      } else {
        console.error("Error fetching today's shlok: Unexpected error format", error);
      }
      
      throw new Error(errorMessage);
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
      
      if (!response) {
        throw new Error("No response received from server");
      }
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch shlok";
        throw new Error(errorMsg);
      }
      
      if (!response.data) {
        throw new Error("Shlok not found");
      }
      
      return response.data;
    } catch (error) {
let errorMessage = "Shlok not found";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error(`Error fetching shlok with ID ${id} from API:`, errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        console.error(`Error fetching shlok with ID ${id}:`, errorMessage);
      } else {
        console.error(`Error fetching shlok with ID ${id}: Unexpected error format`, error);
      }
      
      throw new Error(errorMessage);
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
      
      if (!response) {
        console.error("Error fetching shlok archive: No response received");
        return [];
      }
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch archive";
        console.error("Error fetching shlok archive:", errorMsg);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      return response.data;
    } catch (error) {
if (error?.response?.data?.message) {
        console.error("Error fetching shlok archive from API:", error.response.data.message);
      } else if (error.message) {
        console.error("Error fetching shlok archive:", error.message);
      } else {
        console.error("Error fetching shlok archive: Unexpected error format", error);
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
      
if (!response) {
        console.error("Error fetching shlok by date: No response received");
        return null;
      }
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch shlok by date";
        console.error("Error fetching shlok by date:", errorMsg);
        return null;
      }
      
      if (!response.data || response.data.length === 0) {
        return null;
      }
      
      return response.data[0];
    } catch (error) {
if (error?.response?.data?.message) {
        console.error("Error fetching shlok by date from API:", error.response.data.message);
      } else if (error.message) {
        console.error("Error fetching shlok by date:", error.message);
      } else {
        console.error("Error fetching shlok by date: Unexpected error format", error);
      }
      return null;
    }
  }
}

export const shlokService = new ShlokService()