const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      console.log(`[ShlokService] Fetching today's shlok for date: ${today}`);
      
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
      console.log(`[ShlokService] ApperClient initialized successfully`);
      
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
      
console.log(`[ShlokService] Making API call to fetchRecords with params:`, params);
      const response = await apperClient.fetchRecords(this.tableName, params);
      console.log(`[ShlokService] API response received:`, response);
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "API request failed";
        console.error("Error fetching today's shlok - API returned failure:", errorMsg);
        console.error("Full response object:", response);
        throw new Error(errorMsg);
      }
      
      if (response.data && response.data.length > 0) {
        console.log(`[ShlokService] Found today's shlok, returning first result`);
        return response.data[0];
      }
      
      console.log(`[ShlokService] No shlok found for today, fetching random shlok`);
      // If no shlok for today, get a random one
      const randomParams = {
        fields: this.fields,
        pagingInfo: {
          limit: 1,
          offset: Math.floor(Math.random() * 10)
        }
      };
      
      console.log(`[ShlokService] Making API call for random shlok with params:`, randomParams);
      const randomResponse = await apperClient.fetchRecords(this.tableName, randomParams);
      console.log(`[ShlokService] Random shlok API response received:`, randomResponse);
      
      if (randomResponse && randomResponse.success && randomResponse.data && randomResponse.data.length > 0) {
        console.log(`[ShlokService] Found random shlok, returning with today's date`);
        return { ...randomResponse.data[0], date: today };
      }
      
      console.log(`[ShlokService] No shlok data available, returning null`);
      return null;
    } catch (error) {
      let errorMessage = "Unknown error occurred";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error("Error fetching today's shlok from API:", errorMessage);
        console.error("Full error response:", error.response);
      } else if (error.message) {
        errorMessage = error.message;
        console.error("Error fetching today's shlok:", errorMessage);
      } else {
        console.error("Error fetching today's shlok: Unexpected error format", error);
      }
      
      console.error("[ShlokService] getTodayShlok failed with error:", error);
      throw new Error(errorMessage);
    }
  }

async getById(id) {
    try {
      await delay(200);
      console.log(`[ShlokService] Fetching shlok by ID: ${id}`);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.fields
      };
      
      console.log(`[ShlokService] Making getRecordById API call for ID ${id} with params:`, params);
      const response = await apperClient.getRecordById(this.tableName, id, params);
console.log(`[ShlokService] getRecordById API response for ID ${id}:`, response);
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch shlok";
        console.error(`Error fetching shlok with ID ${id} - API returned failure:`, errorMsg);
        console.error("Full response object:", response);
        throw new Error(errorMsg);
      }
      
      if (!response.data) {
        console.error(`Shlok with ID ${id} not found - response.data is empty`);
        throw new Error("Shlok not found");
      }
      
      console.log(`[ShlokService] Successfully retrieved shlok with ID ${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Shlok not found";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error(`Error fetching shlok with ID ${id} from API:`, errorMessage);
        console.error("Full error response:", error.response);
      } else if (error.message) {
        errorMessage = error.message;
        console.error(`Error fetching shlok with ID ${id}:`, errorMessage);
      } else {
        console.error(`Error fetching shlok with ID ${id}: Unexpected error format`, error);
      }
      
      console.error(`[ShlokService] getById failed for ID ${id} with error:`, error);
      throw new Error(errorMessage);
    }
  }

async getArchive() {
    try {
      await delay(400);
      console.log(`[ShlokService] Fetching shlok archive`);
      
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
      
      console.log(`[ShlokService] Making fetchRecords API call for archive with params:`, params);
      const response = await apperClient.fetchRecords(this.tableName, params);
console.log(`[ShlokService] Archive API response received:`, response);
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch archive";
        console.error("Error fetching shlok archive - API returned failure:", errorMsg);
        console.error("Full response object:", response);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        console.log(`[ShlokService] No archive data found, returning empty array`);
        return [];
      }
      
      console.log(`[ShlokService] Successfully retrieved ${response.data.length} shlokas from archive`);
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching shlok archive from API:", error.response.data.message);
        console.error("Full error response:", error.response);
      } else if (error.message) {
        console.error("Error fetching shlok archive:", error.message);
      } else {
        console.error("Error fetching shlok archive: Unexpected error format", error);
      }
      
      console.error("[ShlokService] getArchive failed with error:", error);
      return [];
    }
  }

async getByDate(date) {
    try {
      await delay(200);
      const dateStr = date.toISOString().split("T")[0];
      console.log(`[ShlokService] Fetching shlok by date: ${dateStr}`);
      
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
      
      console.log(`[ShlokService] Making fetchRecords API call for date ${dateStr} with params:`, params);
      const response = await apperClient.fetchRecords(this.tableName, params);
console.log(`[ShlokService] Date API response for ${dateStr}:`, response);
      
      if (!response.success && response.success !== undefined) {
        const errorMsg = response.message || response.error || "Failed to fetch shlok by date";
        console.error("Error fetching shlok by date - API returned failure:", errorMsg);
        console.error("Full response object:", response);
        return null;
      }
      
      if (!response.data || response.data.length === 0) {
        console.log(`[ShlokService] No shlok found for date ${dateStr}`);
        return null;
      }
      
      console.log(`[ShlokService] Successfully retrieved shlok for date ${dateStr}`);
      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching shlok by date from API:", error.response.data.message);
        console.error("Full error response:", error.response);
      } else if (error.message) {
        console.error("Error fetching shlok by date:", error.message);
      } else {
        console.error("Error fetching shlok by date: Unexpected error format", error);
      }
      
      console.error(`[ShlokService] getByDate failed for date ${date} with error:`, error);
      return null;
    }
  }
}

export const shlokService = new ShlokService();