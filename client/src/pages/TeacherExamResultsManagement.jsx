// src/components/TeacherExamResultsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Upload, Eye, Edit2, Save, X, Users, TrendingUp, Award, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { TeacherBatchUpload } from './TeacherBatchUpload';

export const TeacherExamResultsManagement = ({ examId, examName, teacherId }) => {
  const [view, setView] = useState('overview');
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailedQuestions, setDetailedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingMarks, setEditingMarks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExamResults();
  }, [examId]);

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/results/exam/${examId}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      
      const data = await response.json();
      setStudents(data.students || []);
      setStatistics(data.statistics || null);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResults = async (studentId) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/v1/results/exam/${examId}/student/${studentId}/detailed`);
      if (!response.ok) throw new Error('Failed to fetch detailed results');
      
      const data = await response.json();
      setDetailedQuestions(data.questions || []);
    } catch (err) {
      console.error('Error fetching detailed results:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReviewStudent = (student) => {
    setSelectedStudent(student);
    setView('review');
    fetchDetailedResults(student.student_id);
    
    // Initialize editing state
    const initialEdits = {};
    student.questions.forEach((q) => {
      initialEdits[`q${q.question_number}`] = {
        marks: q.obtained_marks,
        feedback: ''
      };
    });
    setEditingMarks(initialEdits);
  };

  const updateEditingMarks = (questionNumber, field, value) => {
    setEditingMarks(prev => ({
      ...prev,
      [`q${questionNumber}`]: {
        ...prev[`q${questionNumber}`],
        [field]: value
      }
    }));
  };

  const handleSaveReviews = async () => {
    if (!selectedStudent || detailedQuestions.length === 0) return;

    setSaving(true);
    try {
      const reviews = detailedQuestions.map(q => ({
        result_id: q.result_id,
        marks: editingMarks[`q${q.question_number}`]?.marks || q.final_marks,
        feedback: editingMarks[`q${q.question_number}`]?.feedback || ''
      }));

      const response = await fetch('/api/v1/results/bulk-review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: examId,
          student_id: selectedStudent.student_id,
          reviews,
          teacher_id: teacherId
        })
      });

      if (!response.ok) throw new Error('Failed to save reviews');

      // Refresh data
      await fetchExamResults();
      await fetchDetailedResults(selectedStudent.student_id);
      
      alert('Reviews saved successfully!');
    } catch (err) {
      alert('Error saving reviews: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'F': 'text-red-600 bg-red-100',
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{examName}</h2>
        <p className="text-indigo-100">Manage answer sheets and review student performance</p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setView('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setView('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'upload'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Upload Sheets</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {view === 'overview' && statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Students</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{statistics.total_students}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Graded</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-600">{statistics.graded_students}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Percentage</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{statistics.average_percentage}%</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pass Rate</span>
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {statistics.graded_students > 0
                ? Math.round((statistics.pass_count / statistics.graded_students) * 100)
                : 0}%
            </p>
          </div>
        </div>
      )}

      {/* Content based on view */}
      {view === 'overview' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Marks</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">%</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.student_uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.student_name}</p>
                        <p className="text-sm text-gray-500">{student.student_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.grading_complete ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Loader className="w-3 h-3 mr-1 animate-spin" />
                          {student.upload_status || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-800">
                        {student.total_marks}
                      </span>
                      <span className="text-gray-600">/{student.max_obtainable}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-800">{student.percentage}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.grading_complete && (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.grade)}`}>
                          {student.grade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.grading_complete ? (
                        <button
                          onClick={() => handleReviewStudent(student)}
                          className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'upload' && (
        <TeacherBatchUpload
          examId={examId}
          teacherId={teacherId}
          onUploadComplete={() => {
            fetchExamResults();
            setView('overview');
          }}
        />
      )}

      {view === 'review' && selectedStudent && (
        <div className="space-y-6">
          {/* Student Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedStudent.student_name}</h3>
                <p className="text-sm text-gray-600">{selectedStudent.student_id}</p>
              </div>
              <button
                onClick={() => setView('overview')}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
                <span>Close</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.total_marks}</p>
                <p className="text-xs text-gray-600">Total Marks</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.max_obtainable}</p>
                <p className="text-xs text-gray-600">Max Marks</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-gray-800">{selectedStudent.percentage}%</p>
                <p className="text-xs text-gray-600">Percentage</p>
              </div>
              <div className={`text-center p-3 rounded ${getGradeColor(selectedStudent.grade)}`}>
                <p className="text-2xl font-bold">{selectedStudent.grade}</p>
                <p className="text-xs">Grade</p>
              </div>
            </div>
          </div>

          {/* Questions Review */}
          {detailLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Review Questions</h4>
                <button
                  onClick={handleSaveReviews}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Reviews</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {detailedQuestions.map((question) => (
                  <div key={question.result_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                            {question.question_number}
                          </span>
                          <span className="text-sm text-gray-600">Max Marks: {question.max_marks}</span>
                          {question.is_reviewed && (
                            <CheckCircle className="w-4 h-4 text-green-600" title="Reviewed" />
                          )}
                          {question.needs_review && !question.is_reviewed && (
                            <AlertCircle className="w-4 h-4 text-yellow-600" title="Needs review" />
                          )}
                        </div>
                        <p className="text-sm text-gray-800 font-medium">{question.question_text}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Student Answer */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Student's Answer:</p>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-800 max-h-32 overflow-y-auto">
                          {question.student_answer || 'No answer provided'}
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback:</p>
                          <div className="bg-blue-50 p-2 rounded text-xs text-blue-900">
                            {question.ai_feedback}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            AI Marks: {question.ai_assigned_marks} | Confidence: {(question.ai_confidence * 100).toFixed(0)}%
                          </p>
                        </div>

                        {/* Teacher Input */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Your Marks:
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={question.max_marks}
                            step="0.5"
                            value={editingMarks[`q${question.question_number}`]?.marks || question.final_marks}
                            onChange={(e) => updateEditingMarks(question.question_number, 'marks', parseFloat(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <label className="text-xs font-medium text-gray-700 mt-2 mb-1 block">
                            Your Feedback:
                          </label>
                          <textarea
                            value={editingMarks[`q${question.question_number}`]?.feedback || ''}
                            onChange={(e) => updateEditingMarks(question.question_number, 'feedback', e.target.value)}
                            placeholder="Add your feedback..."
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
