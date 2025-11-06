import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Download, Eye, Award, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function TeacherResultsView({ examId }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchExamSummary();
  }, [examId]);

  const fetchExamSummary = async () => {
    try {
      setLoading(true);
      // Use the existing teacher.getExamSummary method
      const data = await api.teacher.getExamSummary(examId);
      console.log('Exam summary data:', data); // Debug log
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error(error.message || 'Failed to fetch exam summary');
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (studentId) => {
    try {
      // Use the results.getStudentResults method
      const data = await api.results.getStudentResults(studentId);
      setSelectedStudent(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to fetch student details');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800 border-green-300',
      'A': 'bg-green-50 text-green-700 border-green-200',
      'B+': 'bg-blue-100 text-blue-800 border-blue-300',
      'B': 'bg-blue-50 text-blue-700 border-blue-200',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'F': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!summary || !summary.exam_info) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No results available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{summary.exam_info.exam_name}</h2>
        <div className="flex items-center space-x-6 text-sm">
          <span>📚 {summary.exam_info.subject_name}</span>
          <span>👥 {summary.exam_info.total_students} Students</span>
          <span>📝 {summary.exam_info.total_questions} Questions</span>
          <span>🎯 {summary.exam_info.total_marks} Total Marks</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Average Score</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {summary.statistics.average_score.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            out of {summary.exam_info.total_marks}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Top Grade</h3>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {Object.keys(summary.statistics.grade_distribution).find(
              grade => summary.statistics.grade_distribution[grade] > 0
            ) || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {(summary.statistics.grade_distribution['A+'] || 0) + (summary.statistics.grade_distribution['A'] || 0)} students
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Need Review</h3>
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {summary.statistics.students_needing_review}
          </p>
          <p className="text-sm text-gray-600 mt-1">students</p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Grade Distribution</h3>
        <div className="grid grid-cols-6 gap-3">
          {Object.entries(summary.statistics.grade_distribution).map(([grade, count]) => (
            <div key={grade} className={`p-4 rounded-lg border-2 text-center ${getGradeColor(grade)}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm font-medium">{grade}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">👥 Student Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks Obtained
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {summary.students && summary.students.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.student_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.obtained_marks.toFixed(1)} / {summary.exam_info.total_marks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.percentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.needs_review ? (
                      <span className="flex items-center text-sm text-orange-600">
                        <Clock className="w-4 h-4 mr-1" />
                        Needs review
                      </span>
                    ) : (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => viewStudentDetails(student.student_id)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Detailed Results</h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedStudent.exams && selectedStudent.exams.map((exam, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{exam.exam_name}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Marks</p>
                        <p className="font-bold text-lg">{exam.obtained_marks} / {exam.total_marks}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Percentage</p>
                        <p className="font-bold text-lg">{exam.percentage}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Grade</p>
                        <p className={`font-bold text-lg px-3 py-1 rounded ${getGradeColor(exam.grade)}`}>
                          {exam.grade}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {exam.questions.map((q, qIdx) => (
                      <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            Question {q.question_number}
                          </h5>
                          <span className="text-sm font-semibold text-indigo-600">
                            {q.obtained_marks} / {q.max_marks}
                          </span>
                        </div>
                        {q.ai_feedback && (
                          <div className="mt-2 bg-blue-50 p-3 rounded text-sm text-blue-900">
                            <p className="font-medium mb-1">AI Feedback:</p>
                            <p>{q.ai_feedback}</p>
                          </div>
                        )}
                        {q.ai_confidence && (
                          <div className="mt-2 flex items-center text-xs text-gray-600">
                            <span>Confidence: {(q.ai_confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}