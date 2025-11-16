// src/components/TeacherExamResultsManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Upload,
  Eye,
  Edit2,
  Save,
  X,
  Users,
  TrendingUp,
  Award,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { TeacherBatchUpload } from './TeacherBatchUpload';
import Loading from '@/components/Loading';

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
      const response = await fetch(
        `/api/v1/results/exam/${examId}/student/${studentId}/detailed`
      );
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
    setEditingMarks((prev) => ({
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
      const reviews = detailedQuestions.map((q) => ({
        result_id: q.result_id,
        marks:
          editingMarks[`q${q.question_number}`]?.marks || q.final_marks,
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

      await fetchExamResults();
      await fetchDetailedResults(selectedStudent.student_id);

      alert('Reviews saved successfully!');
    } catch (err) {
      alert(
        'Error saving reviews: ' + (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-700 bg-green-100',
      'A': 'text-green-700 bg-green-100',
      'B+': 'text-[#016B61] bg-[#9ECFD4]',
      'B': 'text-[#016B61] bg-[#9ECFD4]',
      'C+': 'text-yellow-700 bg-yellow-100',
      'C': 'text-yellow-700 bg-yellow-100',
      'F': 'text-red-700 bg-red-100'
    };
    return colors[grade] || 'text-gray-700 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading/>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER — NOW THEMED */}
      <div className="rounded-lg shadow-lg p-6 bg-[#016B61] text-white">
        <h2 className="text-2xl font-bold mb-1">{examName}</h2>
        <p className="opacity-90">Manage answer sheets & student performance</p>
      </div>

      {/* UPLOAD SECTION (Already themed inside its own file) */}
      <TeacherBatchUpload
        examId={examId}
        teacherId={teacherId}
        onUploadComplete={() => {
          fetchExamResults();
          setView('overview');
        }}
      />

      {view === 'review' && selectedStudent && (
        <div className="space-y-6">

          {/* STUDENT HEADER */}
          <div className="bg-white border border-[#9ECFD4] rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#014b43]">
                  {selectedStudent.student_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedStudent.student_id}
                </p>
              </div>

              <button
                onClick={() => setView('overview')}
                className="flex items-center gap-1 text-gray-600 hover:text-[#016B61]"
              >
                <X className="w-5 h-5" />
                Close
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[#E5E9C5] rounded">
                <p className="text-2xl font-bold text-[#014b43]">
                  {selectedStudent.total_marks}
                </p>
                <p className="text-xs text-gray-700">Total Marks</p>
              </div>
              <div className="text-center p-3 bg-[#E5E9C5] rounded">
                <p className="text-2xl font-bold text-[#014b43]">
                  {selectedStudent.max_obtainable}
                </p>
                <p className="text-xs text-gray-700">Max Marks</p>
              </div>
              <div className="text-center p-3 bg-[#E5E9C5] rounded">
                <p className="text-2xl font-bold text-[#014b43]">
                  {selectedStudent.percentage}%
                </p>
                <p className="text-xs text-gray-700">Percentage</p>
              </div>
              <div
                className={`text-center p-3 rounded font-bold ${getGradeColor(
                  selectedStudent.grade
                )}`}
              >
                <p className="text-2xl">{selectedStudent.grade}</p>
                <p className="text-xs">Grade</p>
              </div>
            </div>
          </div>

          {/* QUESTIONS REVIEW */}
          {detailLoading ? (
            <div className="bg-white border border-[#9ECFD4] rounded-lg shadow p-8 flex items-center justify-center">
              <Loading/>
            </div>
          ) : (
            <div className="bg-white border border-[#9ECFD4] rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-[#014b43]">
                  Review Questions
                </h4>

                <button
                  onClick={handleSaveReviews}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#016B61] text-white px-4 py-2 rounded-lg hover:bg-[#014b43] disabled:bg-gray-400"
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save All Reviews
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {detailedQuestions.map((q) => (
                  <div
                    key={q.result_id}
                    className="border border-[#9ECFD4] rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#70B2B2] text-white font-bold">
                          {q.question_number}
                        </span>
                        <span className="text-sm text-[#014b43]">
                          Max Marks: {q.max_marks}
                        </span>

                        {q.is_reviewed && (
                          <CheckCircle
                            className="w-4 h-4 text-green-600"
                            title="Reviewed"
                          />
                        )}

                        {q.needs_review && !q.is_reviewed && (
                          <AlertCircle
                            className="w-4 h-4 text-yellow-600"
                            title="Needs review"
                          />
                        )}
                      </div>
                    </div>

                    {/* STUDENT ANSWER */}
                    <div className="grid gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Student's Answer:
                        </p>
                        <div className="bg-[#E5E9C5] p-3 rounded text-sm text-[#014b43] max-h-32 overflow-y-auto">
                          {q.student_answer || 'No answer provided'}
                        </div>
                      </div>

                      {/* AI & TEACHER INPUT */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* AI FEEDBACK */}
                        <div>
                          <p className="text-xs font-medium text-[#016B61] mb-1">
                            AI Feedback:
                          </p>
                          <div className="bg-[#9ECFD4] p-2 rounded text-xs text-[#014b43]">
                            {q.ai_feedback}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            AI Marks: {q.ai_assigned_marks} | Confidence:{' '}
                            {(q.ai_confidence * 100).toFixed(0)}%
                          </p>
                        </div>

                        {/* TEACHER FEEDBACK */}
                        <div>
                          <label className="text-xs font-medium text-[#014b43] mb-1 block">
                            Your Marks:
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={q.max_marks}
                            step="0.5"
                            value={
                              editingMarks[`q${q.question_number}`]?.marks ||
                              q.final_marks
                            }
                            onChange={(e) =>
                              updateEditingMarks(
                                q.question_number,
                                'marks',
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full border border-[#9ECFD4] rounded px-2 py-1 text-sm"
                          />

                          <label className="text-xs font-medium text-[#014b43] mt-2 mb-1 block">
                            Your Feedback:
                          </label>
                          <textarea
                            value={
                              editingMarks[`q${q.question_number}`]?.feedback ||
                              ''
                            }
                            onChange={(e) =>
                              updateEditingMarks(
                                q.question_number,
                                'feedback',
                                e.target.value
                              )
                            }
                            placeholder="Add your feedback..."
                            className="w-full border border-[#9ECFD4] rounded px-2 py-1 text-sm"
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
