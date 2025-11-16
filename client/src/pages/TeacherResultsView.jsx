import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Download, Eye, Award, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';

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
      const data = await api.teacher.getExamSummary(examId);
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
      const data = await api.results.getStudentResults(studentId);
      setSelectedStudent(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to fetch student details');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-700 border-green-300',
      'A': 'bg-green-50 text-green-700 border-green-200',
      'B+': 'bg-[#9ECFD4] text-[#014B43] border-[#70B2B2]',
      'B': 'bg-[#D9F2F2] text-[#014B43] border-[#70B2B2]',
      'C': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'F': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[grade] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loading/>
      </div>
    );
  }

  if (!summary || !summary.exam_info) {
    return (
      <div className="text-center p-12 bg-[#F0F4F4] border border-[#9ECFD4] rounded-lg">
        <p className="text-gray-700">No results available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER – THEMED */}
      <div className="rounded-lg p-6 shadow-md bg-[#016B61] text-white">
        <h2 className="text-2xl font-bold mb-2">{summary.exam_info.exam_name}</h2>

        <div className="flex items-center space-x-6 text-sm opacity-90">
          <span>📚 {summary.exam_info.subject_name}</span>
          <span>👥 {summary.exam_info.total_students} Students</span>
          <span>📝 {summary.exam_info.total_questions} Questions</span>
          <span>🎯 {summary.exam_info.total_marks} Total Marks</span>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white border border-[#9ECFD4] shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#014B43]">Average Score</h3>
            <TrendingUp className="w-6 h-6 text-[#016B61]" />
          </div>
          <p className="text-3xl font-bold text-[#016B61]">
            {summary.statistics.average_score.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            out of {summary.exam_info.total_marks}
          </p>
        </div>

        <div className="bg-white border border-[#9ECFD4] shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#014B43]">Top Grade</h3>
            <Award className="w-6 h-6 text-[#70B2B2]" />
          </div>
          <p className="text-3xl font-bold text-[#70B2B2]">
            {Object.keys(summary.statistics.grade_distribution).find(
              grade => summary.statistics.grade_distribution[grade] > 0
            ) || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {(summary.statistics.grade_distribution['A+'] || 0) +
              (summary.statistics.grade_distribution['A'] || 0)} students
          </p>
        </div>

        <div className="bg-white border border-[#9ECFD4] shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#014B43]">Need Review</h3>
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {summary.statistics.students_needing_review}
          </p>
          <p className="text-sm text-gray-600 mt-1">students</p>
        </div>

      </div>

      {/* GRADE DISTRIBUTION */}
      <div className="bg-white border border-[#9ECFD4] shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#014B43] mb-4">📊 Grade Distribution</h3>

        <div className="grid grid-cols-6 gap-3">
          {Object.entries(summary.statistics.grade_distribution).map(
            ([grade, count]) => (
              <div
                key={grade}
                className={`p-4 rounded-lg border text-center ${getGradeColor(grade)}`}
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm font-medium">{grade}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* STUDENT RESULTS TABLE */}
      <div className="bg-white border border-[#9ECFD4] shadow rounded-lg overflow-hidden">

        <div className="p-6 border-b border-[#9ECFD4] bg-[#F8FCFC]">
          <h3 className="text-lg font-semibold text-[#014B43]">👥 Student Results</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-[#E5E9C5] text-[#014B43]">
              <tr>
                {['Student', 'Marks Obtained', 'Percentage', 'Grade', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-[#9ECFD4]">
              {summary.students.map((student, idx) => (
                <tr key={idx} className="hover:bg-[#F0FAF9]">
                  <td className="px-6 py-4 text-sm font-medium text-[#014B43]">
                    {student.student_name}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#014B43]">
                    {student.obtained_marks.toFixed(1)} / {summary.exam_info.total_marks}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#014B43]">
                    {student.percentage.toFixed(1)}%
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getGradeColor(
                        student.grade
                      )}`}
                    >
                      {student.grade}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {student.needs_review ? (
                      <span className="flex items-center text-orange-600">
                        <Clock className="w-4 h-4 mr-1" /> Needs review
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" /> Complete
                      </span>
                    )}
                  </td>

                
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white border border-[#9ECFD4] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b border-[#9ECFD4] flex justify-between">
              <h3 className="text-xl font-bold text-[#014B43]">Detailed Results</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-500">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {selectedStudent.exams.map((exam, idx) => (
                <div key={idx} className="space-y-4">

                  <div className="bg-[#F8FCFC] border border-[#9ECFD4] p-4 rounded-lg">
                    <h4 className="font-semibold text-[#014B43] mb-2">{exam.exam_name}</h4>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Marks</p>
                        <p className="font-bold text-lg text-[#016B61]">
                          {exam.obtained_marks} / {exam.total_marks}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600">Percentage</p>
                        <p className="font-bold text-lg text-[#016B61]">
                          {exam.percentage}%
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600">Grade</p>
                        <p
                          className={`font-bold text-lg px-3 py-1 rounded border ${getGradeColor(
                            exam.grade
                          )}`}
                        >
                          {exam.grade}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PER QUESTION */}
                  <div className="space-y-3">
                    {exam.questions.map((q, index) => (
                      <div
                        key={index}
                        className="border border-[#9ECFD4] rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-[#014B43]">
                            Question {q.question_number}
                          </h5>
                          <span className="text-sm font-semibold text-[#016B61]">
                            {q.obtained_marks} / {q.max_marks}
                          </span>
                        </div>

                        {q.ai_feedback && (
                          <div className="mt-2 bg-[#D9F7FF] p-3 rounded text-sm text-[#014B43]">
                            <p className="font-medium mb-1">AI Feedback:</p>
                            <p>{q.ai_feedback}</p>
                          </div>
                        )}

                        {q.ai_confidence && (
                          <p className="mt-2 text-xs text-gray-600">
                            AI Confidence: {(q.ai_confidence * 100).toFixed(0)}%
                          </p>
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
