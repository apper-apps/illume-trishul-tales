const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuizService {
  constructor() {
    this.quizTableName = 'quiz';
    this.questionTableName = 'question';
    this.scoreTableName = 'quiz_score';
    
    this.quizFields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "title" } },
      { "field": { "Name": "description" } },
      { "field": { "Name": "category" } },
      { "field": { "Name": "difficulty" } },
      { "field": { "Name": "question_count" } },
      { "field": { "Name": "duration" } },
      { "field": { "Name": "icon" } },
      { "field": { "Name": "featured" } }
    ];
    
    this.questionFields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "question" } },
      { "field": { "Name": "options" } },
      { "field": { "Name": "correct_answer" } },
      { "field": { "Name": "category" } },
      { "field": { "Name": "difficulty" } },
      { "field": { "Name": "age_group" } },
      { "field": { "Name": "quiz_id" } }
    ];
    
    this.scoreFields = [
      { "field": { "Name": "Name" } },
      { "field": { "Name": "Tags" } },
      { "field": { "Name": "Owner" } },
      { "field": { "Name": "CreatedOn" } },
      { "field": { "Name": "CreatedBy" } },
      { "field": { "Name": "ModifiedOn" } },
      { "field": { "Name": "ModifiedBy" } },
      { "field": { "Name": "user_name" } },
      { "field": { "Name": "score" } },
      { "field": { "Name": "total_questions" } },
      { "field": { "Name": "category" } },
      { "field": { "Name": "completed_at" } }
    ];
  }

  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.quizFields,
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.quizTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching quizzes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
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
        fields: this.quizFields
      };
      
      const response = await apperClient.getRecordById(this.quizTableName, id, params);
      
      if (!response || !response.data) {
        throw new Error("Quiz not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching quiz with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Quiz not found");
    }
  }

  async getFeatured() {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.quizFields,
        where: [
          {
            "FieldName": "featured",
            "Operator": "EqualTo",
            "Values": [true]
          }
        ],
        pagingInfo: {
          limit: 4,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.quizTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured quizzes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getQuestions(quizId) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.questionFields,
        where: [
          {
            "FieldName": "quiz_id",
            "Operator": "EqualTo",
            "Values": [parseInt(quizId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.questionTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? q.options.split('\n') : q.options
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getRandomQuestions(count = 20) {
    try {
      await delay(500);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.questionFields,
        pagingInfo: {
          limit: count * 2,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.questionTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(q => ({
        ...q,
        options: typeof q.options === 'string' ? q.options.split('\n') : q.options
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching random questions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getQuestionsByAge(quizId, ageGroup) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const whereConditions = [
        {
          "FieldName": "quiz_id",
          "Operator": "EqualTo",
          "Values": [parseInt(quizId)]
        }
      ];
      
      if (ageGroup) {
        whereConditions.push({
          "FieldName": "age_group",
          "Operator": "EqualTo",
          "Values": [ageGroup]
        });
      }
      
      const params = {
        fields: this.questionFields,
        where: whereConditions,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.questionTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? q.options.split('\n') : q.options
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by age:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async saveScore(scoreData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            user_name: scoreData.userName || "Anonymous User",
            score: scoreData.score,
            total_questions: scoreData.totalQuestions,
            category: scoreData.category || "Hindu Culture",
            completed_at: new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord(this.scoreTableName, params);
      
      if (!response.success) {
        console.error("Error saving score:", response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to save score ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error saving score:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getLeaderboard() {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: this.scoreFields,
        orderBy: [
          {
            "fieldName": "score",
            "sorttype": "DESC"
          }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.scoreTableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.sort((a, b) => (b.score / b.total_questions) - (a.score / a.total_questions));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leaderboard:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getRealTimeLeaderboard() {
    try {
      await delay(100);
      
      const scores = await this.getLeaderboard();
      
      return scores.map((score, index) => ({
        ...score,
        rank: index + 1,
        percentage: Math.round((score.score / score.total_questions) * 100),
        userName: score.user_name,
        totalQuestions: score.total_questions,
        completedAt: score.completed_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching real-time leaderboard:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const quizService = new QuizService()