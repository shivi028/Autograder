// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// const getAuthHeader = () => {
//   const token = localStorage.getItem('access_token');
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const handleResponse = async (response) => {
//   if (response.status === 401) {
//     // Token expired, try refresh
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (refreshToken) {
//       try {
//         const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ refresh_token: refreshToken })
//         });
        
//         if (refreshResponse.ok) {
//           const data = await refreshResponse.json();
//           localStorage.setItem('access_token', data.access_token);
//           localStorage.setItem('refresh_token', data.refresh_token);
//           window.location.reload();
//           return;
//         }
//       } catch (error) {
//         console.error('Token refresh failed:', error);
//       }
//     }
    
//     // Refresh failed, logout
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//     throw new Error('Authentication required');
//   }
  
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.detail || 'Request failed');
//   }
  
//   return response.json();
// };

// export const api = {
//   // Auth endpoints
//   auth: {
//     register: async (userData) => {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData)
//       });
//       const data = await handleResponse(response);
      
//       if (data.access_token) {
//         localStorage.setItem('access_token', data.access_token);
//         localStorage.setItem('refresh_token', data.refresh_token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//       }
      
//       return data;
//     },
    
//     login: async (email, password) => {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
//       const data = await handleResponse(response);
      
//       if (data.access_token) {
//         localStorage.setItem('access_token', data.access_token);
//         localStorage.setItem('refresh_token', data.refresh_token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//       }
      
//       return data;
//     },
    
//     logout: async () => {
//       try {
//         await fetch(`${API_BASE_URL}/auth/logout`, {
//           method: 'POST',
//           headers: getAuthHeader()
//         });
//       } finally {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//       }
//     },
    
//     getMe: async () => {
//       const response = await fetch(`${API_BASE_URL}/auth/me`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     }
//   },
  
//   // Student endpoints
//   student: {
//     getAvailableExams: async () => {
//       const response = await fetch(`${API_BASE_URL}/admin/exams/student`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     },
    
//     uploadAnswerSheet: async (examId, file) => {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       const response = await fetch(`${API_BASE_URL}/upload/upload/${examId}`, {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: formData
//       });
//       return handleResponse(response);
//     },
    
//     getUploadStatus: async (uploadId) => {
//       const response = await fetch(`${API_BASE_URL}/upload/upload/status/${uploadId}`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     },
    
//     getMyResults: async () => {
//       const response = await fetch(`${API_BASE_URL}/results/results/student`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     },
    
//     getMyUploads: async () => {
//       const response = await fetch(`${API_BASE_URL}/upload/uploads/student`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     }
//   },
  
//   // Teacher endpoints
//   teacher: {
//     createSubject: async (subjectData) => {
//       const response = await fetch(`${API_BASE_URL}/admin/subjects`, {
//         method: 'POST',
//         headers: {
//           ...getAuthHeader(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(subjectData)
//       });
//       return handleResponse(response);
//     },
    
//     createExam: async (examData) => {
//       const response = await fetch(`${API_BASE_URL}/admin/exams`, {
//         method: 'POST',
//         headers: {
//           ...getAuthHeader(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(examData)
//       });
//       return handleResponse(response);
//     },
    
//     addQuestions: async (examId, questions) => {
//       const response = await fetch(`${API_BASE_URL}/admin/exams/${examId}/questions`, {
//         method: 'POST',
//         headers: {
//           ...getAuthHeader(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(questions)
//       });
//       return handleResponse(response);
//     },
    
//     getMyExams: async () => {
//       const response = await fetch(`${API_BASE_URL}/admin/exams/teacher`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     },
    
//     getExamSummary: async (examId) => {
//       const response = await fetch(`${API_BASE_URL}/results/results/exam/${examId}/summary`, {
//         headers: getAuthHeader()
//       });
//       return handleResponse(response);
//     },

//     // Add this inside the teacher object in api.js
// getExamQuestions: async (examId) => {
//   const response = await fetch(`${API_BASE_URL}/admin/exams/${examId}/questions`, {
//     headers: getAuthHeader()
//   });
//   return handleResponse(response);
// }
//   }
// };




// api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  // Handle 401 by trying refresh once
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          // Reload to retry the previous request with the new token
          window.location.reload();
          return; // stop here; page will reload
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
      }
    }

    // If refresh failed, logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  // Non-OK responses
  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const error = await response.json();
      errorDetail = error.detail || error.message || errorDetail;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorDetail);
  }

  // OK
  return response.json();
};

export const api = {
  // ---------- Auth ----------
  auth: {
    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await handleResponse(res);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },

    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },

    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeader(),
        });
      } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },

  // ---------- Student (pass studentId explicitly) ----------
  student: {
    // Exams available to a student
    getAvailableExams: async (studentId) => {
      const res = await fetch(
        `${API_BASE_URL}/results/student/${studentId}/available-exams`,
        { headers: getAuthHeader() }
      );
      return handleResponse(res);
    },

    // Get student's results (optionally filtered by examId)
    getMyResults: async (studentId, examId = null) => {
      const url = examId
        ? `${API_BASE_URL}/results/student/${studentId}?exam_id=${encodeURIComponent(examId)}`
        : `${API_BASE_URL}/results/student/${studentId}`;
      const res = await fetch(url, { headers: getAuthHeader() });
      return handleResponse(res);
    },

    // Upload history for the student
    getMyUploads: async (studentId) => {
      const res = await fetch(
        `${API_BASE_URL}/upload/student/${studentId}/uploads`,
        { headers: getAuthHeader() }
      );
      return handleResponse(res);
    },

    // Status of a specific upload
    getUploadStatus: async (uploadId) => {
      const res = await fetch(`${API_BASE_URL}/upload/status/${uploadId}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },

  // ---------- Teacher ----------
  teacher: {
    createSubject: async (subjectData) => {
      const res = await fetch(`${API_BASE_URL}/admin/subjects`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData),
      });
      return handleResponse(res);
    },

    createExam: async (examData) => {
      const res = await fetch(`${API_BASE_URL}/admin/exams`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });
      return handleResponse(res);
    },

    addQuestions: async (examId, questions) => {
      const res = await fetch(`${API_BASE_URL}/admin/exams/${examId}/questions`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questions),
      });
      return handleResponse(res);
    },

    getMyExams: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/exams/teacher`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getExamSummary: async (examId) => {
      // Keeping your existing route that includes /results/results/
      const res = await fetch(`${API_BASE_URL}/results/results/exam/${examId}/summary`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getExamQuestions: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/admin/exams/${examId}/questions`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getExamUploads: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/upload/exam/${examId}/status`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    uploadAnswerSheet: async (examId, studentId, file) => {
      const formData = new FormData();
      formData.append('file', file);
      // If your backend needs studentId, include it in FormData or querystring as required.
      const res = await fetch(`${API_BASE_URL}/upload/batch/${examId}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });
      return handleResponse(res);
    },

    startGrading: async (uploadId) => {
      const res = await fetch(`${API_BASE_URL}/grading/grade/${uploadId}`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },

  // ---------- Results ----------
  results: {
    getExamSummary: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/results/results/exam/${examId}/summary`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getStudentResults: async (studentId) => {
      const res = await fetch(`${API_BASE_URL}/results/results/student/${studentId}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getExamResults: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/results/results/exam/${examId}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    reviewResult: async (resultId, teacherMarks, teacherFeedback) => {
      const res = await fetch(`${API_BASE_URL}/results/results/review/${resultId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_marks: teacherMarks,
          teacher_feedback: teacherFeedback,
        }),
      });
      return handleResponse(res);
    },
  },

  // ---------- Debug ----------
  debug: {
    getGradingStatus: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/exam/${examId}/grading-status`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    regradeAll: async (examId) => {
      const res = await fetch(`${API_BASE_URL}/exam/${examId}/regrade-all`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    regradeOne: async (uploadId) => {
      const res = await fetch(`${API_BASE_URL}/upload/${uploadId}/reprocess`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },

  // ---------- Upload ----------
  upload: {
    getStatus: async (uploadId) => {
      const res = await fetch(`${API_BASE_URL}/upload/status/${uploadId}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },
};
