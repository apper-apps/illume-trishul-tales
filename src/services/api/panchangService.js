const { ApperClient } = window.ApperSDK;

class PanchangService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'panchang';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "tithi" } },
          { field: { Name: "nakshatra" } },
          { field: { Name: "yoga" } },
          { field: { Name: "karana" } },
          { field: { Name: "sunrise" } },
          { field: { Name: "sunset" } },
          { field: { Name: "moonrise" } },
          { field: { Name: "moonset" } },
          { field: { Name: "festivals" } },
          { field: { Name: "muhurats" } },
          { field: { Name: "is_admin" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching panchang records:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching panchang in panchang service:", error?.response?.data?.message);
      } else {
        console.error("Error fetching panchang in panchang service:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "tithi" } },
          { field: { Name: "nakshatra" } },
          { field: { Name: "yoga" } },
          { field: { Name: "karana" } },
          { field: { Name: "sunrise" } },
          { field: { Name: "sunset" } },
          { field: { Name: "moonrise" } },
          { field: { Name: "moonset" } },
          { field: { Name: "festivals" } },
          { field: { Name: "muhurats" } },
          { field: { Name: "is_admin" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error("Error fetching panchang record:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching panchang record with ID ${id} in panchang service:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching panchang record with ID ${id} in panchang service:`, error.message);
      }
      throw error;
    }
  }

async getToday() {
    try {
      // Import toast for notifications
import { toast } from 'react-toastify';
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "tithi" } },
          { field: { Name: "nakshatra" } },
          { field: { Name: "yoga" } },
          { field: { Name: "karana" } },
          { field: { Name: "sunrise" } },
          { field: { Name: "sunset" } },
          { field: { Name: "moonrise" } },
          { field: { Name: "moonset" } },
          { field: { Name: "festivals" } },
          { field: { Name: "muhurats" } },
          { field: { Name: "is_admin" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [today]
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching today's panchang in panchang service:", response.message);
        toast.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's panchang in panchang service:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching today's panchang in panchang service:", error.message);
        toast.error(error.message);
      }
      return null;
    }
  }

  async create(panchangData) {
    try {
      // Only include Updateable fields based on field visibility
      const params = {
        records: [
          {
            Name: panchangData.Name || '',
            Tags: panchangData.Tags || '',
            Owner: parseInt(panchangData.Owner) || null,
            date: panchangData.date || '', // Date format: YYYY-MM-DD
            tithi: panchangData.tithi || '',
            nakshatra: panchangData.nakshatra || '',
            yoga: panchangData.yoga || '',
            karana: panchangData.karana || '',
            sunrise: panchangData.sunrise || '',
            sunset: panchangData.sunset || '',
            moonrise: panchangData.moonrise || '',
            moonset: panchangData.moonset || '',
            festivals: panchangData.festivals || '', // MultiPicklist as comma-separated string
            muhurats: panchangData.muhurats || '',
            is_admin: panchangData.is_admin || false
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating panchang record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} panchang records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating panchang record in panchang service:", error?.response?.data?.message);
      } else {
        console.error("Error creating panchang record in panchang service:", error.message);
      }
      throw error;
    }
  }

  async update(id, panchangData) {
    try {
      // Only include Updateable fields based on field visibility
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: panchangData.Name,
            Tags: panchangData.Tags,
            Owner: panchangData.Owner ? parseInt(panchangData.Owner) : null,
            date: panchangData.date, // Date format: YYYY-MM-DD
            tithi: panchangData.tithi,
            nakshatra: panchangData.nakshatra,
            yoga: panchangData.yoga,
            karana: panchangData.karana,
            sunrise: panchangData.sunrise,
            sunset: panchangData.sunset,
            moonrise: panchangData.moonrise,
            moonset: panchangData.moonset,
            festivals: panchangData.festivals, // MultiPicklist as comma-separated string
            muhurats: panchangData.muhurats,
            is_admin: panchangData.is_admin
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating panchang record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} panchang records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating panchang record with ID ${id} in panchang service:`, error?.response?.data?.message);
      } else {
        console.error(`Error updating panchang record with ID ${id} in panchang service:`, error.message);
      }
      throw error;
    }
  }

  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error deleting panchang records:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} panchang records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length === params.RecordIds.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting panchang records in panchang service:", error?.response?.data?.message);
      } else {
        console.error("Error deleting panchang records in panchang service:", error.message);
      }
      throw error;
    }
  }
}

export const panchangService = new PanchangService();