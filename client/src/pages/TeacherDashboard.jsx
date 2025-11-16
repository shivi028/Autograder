import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import TeacherResultsView from "./TeacherResultsView";
import toast from "react-hot-toast";

import {
  AcademicCapIcon,
  DocumentTextIcon,
  UsersIcon,
  PlusIcon,
  XMarkIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  Cog8ToothIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { TeacherExamResultsManagement } from "./TeacherExamResultsManagement";
import DebugGradingPanel from "./DebugGradingPanel";
import { Loader } from "lucide-react";
import Loading from "@/components/Loading";

// Color theme constants
const PRIMARY = "bg-[#016B61] text-white hover:bg-[#014b43]";
const PRIMARY_SOFT = "bg-[#70B2B2] text-white hover:bg-[#5c9595]";
const OUTLINE =
  "border border-[#016B61] text-[#016B61] hover:bg-[#016B61] hover:text-white";
const CARD_BG = "bg-white border border-[#9ECFD4]";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForManagement, setSelectedExamForManagement] =
    useState(null);
  const [showViewQuestions, setShowViewQuestions] = useState(false);
  const [viewingQuestions, setViewingQuestions] = useState([]);
  const [selectedExamForResults, setSelectedExamForResults] = useState(null);
  const [selectedExamForDebug, setSelectedExamForDebug] = useState(null);

  const [subjectForm, setSubjectForm] = useState({
    subject_code: "",
    subject_name: "",
    department: "",
    credits: 3,
    semester: "",
    description: "",
  });

  const [examForm, setExamForm] = useState({
    exam_code: "",
    subject_code: "",
    exam_name: "",
    exam_type: "midterm",
    exam_date: "",
    start_time: "10:00",
    duration_minutes: 180,
    total_marks: 100,
    passing_marks: 40,
    instructions: "",
  });

  const [questions, setQuestions] = useState([
    {
      question_number: 1,
      question_text: "",
      max_marks: 10,
      sample_answer: "",
      keywords: [],
    },
  ]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await api.teacher.getMyExams();
      setExams(data.exams || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.teacher.createSubject(subjectForm);
      toast.success("Subject created successfully!");
      setShowCreateSubject(false);
      setSubjectForm({
        subject_code: "",
        subject_name: "",
        department: "",
        credits: 3,
        semester: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const viewStudentDetails = async (student) => {
    try {
      setSelectedStudent({
        student_id: student.student_id,
        student_name: student.student_name,
        exams: [
          {
            exam_name: summary.exam_info.exam_name,
            obtained_marks: student.obtained_marks,
            total_marks: summary.exam_info.total_marks,
            percentage: student.percentage,
            grade: student.grade,
            questions: [],
          },
        ],
      });
    } catch (error) {
      console.error("Error viewing student details:", error);
      toast.error("Failed to view student details");
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await api.teacher.createExam(examForm);
      toast.success("Exam created successfully!");
      setShowCreateExam(false);
      fetchExams();
      setExamForm({
        exam_code: "",
        subject_code: "",
        exam_name: "",
        exam_type: "midterm",
        exam_date: "",
        start_time: "10:00",
        duration_minutes: 180,
        total_marks: 100,
        passing_marks: 40,
        instructions: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddQuestions = async (e) => {
    e.preventDefault();
    try {
      const hasExistingQuestions = selectedExam.question_count > 0;
      let shouldReplace = false;

      if (hasExistingQuestions) {
        shouldReplace = window.confirm(
          "This exam already has questions. Do you want to replace them?\n\n" +
            "Click OK to replace existing questions\n" +
            "Click Cancel to keep existing and add new ones"
        );
      }

      await api.teacher.addQuestions(selectedExam.id, questions);
      toast.success("Questions added successfully!");
      setShowAddQuestions(false);
      setSelectedExam(null);
      setQuestions([
        {
          question_number: 1,
          question_text: "",
          max_marks: 10,
          sample_answer: "",
          keywords: [],
        },
      ]);
      fetchExams();
    } catch (error) {
      console.error("Error adding questions:", error);

      if (
        error.message.includes("already exist") ||
        error.message.includes("duplicate")
      ) {
        toast.error(
          "Some question numbers already exist. Please use different question numbers or delete existing questions first.",
          { duration: 6000 }
        );
      } else {
        toast.error(error.message || "Failed to add questions");
      }
    }
  };

  const handleViewQuestions = async (exam) => {
    try {
      const data = await api.teacher.getExamQuestions(exam.id);
      setViewingQuestions(data.questions || []);
      setSelectedExam(exam);
      setShowViewQuestions(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch questions");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_number: questions.length + 1,
        question_text: "",
        max_marks: 10,
        sample_answer: "",
        keywords: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  if (selectedExamForManagement) {
    return (
      <div className="min-h-[78%] bg-[#E5E9C5]">
        <header className="bg-[#016B61] text-white py-4 shadow mt-7">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedExamForManagement(null)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Exams</span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherExamResultsManagement
            examId={selectedExamForManagement.id}
            examName={selectedExamForManagement.exam_name}
            teacherId={user?.id}
          />
        </div>
      </div>
    );
  }

  if (selectedExamForResults) {
    return (
      <div className="min-h-[78%] bg-[#E5E9C5]">
        <header className="bg-[#016B61] text-white py-4 shadow mt-7">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedExamForResults(null)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Exams</span>
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherResultsView examId={selectedExamForResults.id} />
        </div>
      </div>
    );
  }

  if (selectedExamForDebug) {
    return (
      <div className="min-h-[78%] bg-[#E5E9C5]">
        <header className="bg-[#016B61] text-white py-4 shadow mt-7">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedExamForDebug(null)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Exams</span>
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DebugGradingPanel examId={selectedExamForDebug.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[78%] bg-[#E5E9C5]">
      {/* Header */}
      <header className="bg-[#016B61] text-white py-6 shadow-lg mb-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="opacity-90 mt-1">Welcome back, {user?.full_name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#016B61] text-white rounded-xl p-6 shadow-lg">
            <DocumentTextIcon className="h-8 w-8 opacity-80 mb-2" />
            <div className="text-4xl font-bold mb-1">{exams.length}</div>
            <div className="opacity-90">Total Exams</div>
          </div>

          <div className="bg-[#70B2B2] text-white rounded-xl p-6 shadow-lg">
            <ChartBarIcon className="h-8 w-8 opacity-80 mb-2" />
            <div className="text-4xl font-bold mb-1">
              {exams.filter((e) => e.status === "active").length}
            </div>
            <div className="opacity-90">Active Exams</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateSubject(true)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-md transition transform hover:scale-105 ${PRIMARY}`}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Subject</span>
          </button>

          <button
            onClick={() => setShowCreateExam(true)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-md transition transform hover:scale-105 ${PRIMARY_SOFT}`}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Exam</span>
          </button>
        </div>

        {/* Exams List */}
        <div className={`${CARD_BG} rounded-2xl shadow-sm p-6`}>
          <h2 className="text-xl font-semibold text-[#014b43] mb-6">
            My Exams
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading/>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No exams created yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="
    group 
    bg-white 
    border border-[#9ECFD4] 
    rounded-xl 
    p-6 
    shadow-[0_4px_16px_rgba(0,0,0,0.04)]
    transition-all 
    duration-300
    hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]
    hover:border-[#70B2B2]
    hover:-translate-y-1
    animate-fadeInUp
  "
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    {/* SUBJECT ICON — ANIMATED */}
                    <div className="flex items-center justify-center"></div>

                    {/* LEFT SIDE DETAILS */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#014B43] mb-1 group-hover:text-[#016B61] transition">
                        {exam.exam_name}
                      </h3>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-3 mt-2 mb-3">
                        <span className="px-3 py-1 bg-[#E5E9C5] text-[#014B43] font-medium rounded-full border border-[#D6DEAF] shadow-sm">
                          {exam.exam_type}
                        </span>

                        <span className="px-3 py-1 bg-[#F4FFFD] text-[#014B43] rounded-full border border-[#9ECFD4] shadow-sm">
                          {new Date(exam.exam_date).toLocaleDateString()}
                        </span>

                        <span className="px-3 py-1 bg-[#9ECFD4] text-[#014B43] rounded-full font-medium shadow-sm">
                          {exam.total_marks} marks
                        </span>

                        <span
                          className={`
            px-3 py-1 rounded-full font-medium shadow-sm border
            ${
              exam.status === "active"
                ? "bg-green-100 border-green-200 text-green-800"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }
          `}
                        >
                          {exam.status}
                        </span>
                      </div>

                      {/* unable to fetch */}
                      {/* <p className="text-gray-700 mt-2">
                        <span className="font-medium text-[#014B43]">
                          {exam.subjects.subject_name}
                        </span>{" "}
                        ({exam.subjects.subject_code})
                      </p> */}
                    </div>

                    {/* ACTION BUTTON BAR — PREMIUM */}
                    <div
                      className="
        flex flex-wrap gap-2
        md:flex-row md:flex-nowrap
        md:gap-3
        md:justify-end
      "
                    >
                      {/* PRIMARY BUTTONS */}

                      <button
                        onClick={() => setSelectedExamForManagement(exam)}
                        className="
          px-4 py-2 rounded-full text-sm font-medium 
          flex items-center gap-2
          shadow-sm hover:shadow-md transition-all
          bg-[#016B61] text-white hover:bg-[#014B43]
        "
                      >
                        <ClipboardDocumentListIcon className="h-4 w-4" />
                        Manage Results
                      </button>

                      <button
                        onClick={() => setSelectedExamForResults(exam)}
                        className="
          px-4 py-2 rounded-full text-sm font-medium 
          flex items-center gap-2
          bg-[#0c8d7e] text-white 
          hover:bg-[#0a7468] 
          shadow-sm hover:shadow-md transition-all
        "
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Results
                      </button>

                      <button
                        onClick={() => setSelectedExamForDebug(exam)}
                        className="
          px-4 py-2 rounded-full text-sm font-medium 
          flex items-center gap-2
          bg-[#C39B32] text-white 
          hover:bg-[#a78329] 
          shadow-sm hover:shadow-md transition-all
        "
                      >
                        <WrenchScrewdriverIcon className="h-4 w-4" />
                        Debug
                      </button>

                      {/* SECONDARY BUTTONS */}

                      <button
                        onClick={() => handleViewQuestions(exam)}
                        className="
          px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
          border border-[#016B61] text-[#016B61]
          hover:bg-[#016B61] hover:text-white
          shadow-sm hover:shadow-md transition-all
        "
                      >
                        <MagnifyingGlassIcon className="h-4 w-4" />
                        View Questions
                      </button>

                      <button
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowAddQuestions(true);
                        }}
                        className="
          px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
          border border-[#016B61] text-[#016B61]
          hover:bg-[#016B61] hover:text-white
          shadow-sm hover:shadow-md transition-all
        "
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add Questions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Modal */}
      {showCreateSubject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#9ECFD4]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#014b43]">
                Create Subject
              </h3>
              <button
                onClick={() => setShowCreateSubject(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectForm.subject_code}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        subject_code: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                    placeholder="CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjectForm.subject_name}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        subject_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={subjectForm.department}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        department: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Credits
                  </label>
                  <input
                    type="number"
                    value={subjectForm.credits}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        credits: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={subjectForm.semester}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        setSubjectForm({ ...subjectForm, semester: value });
                      } else {
                        setSubjectForm({ ...subjectForm, semester: 1 });
                      }
                    }}
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#014b43] mb-2">
                  Description
                </label>
                <textarea
                  value={subjectForm.description}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  rows="3"
                  placeholder="Subject description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateSubject(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${PRIMARY}`}
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#9ECFD4]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#014b43]">
                Create Exam
              </h3>
              <button
                onClick={() => setShowCreateExam(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Exam Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={examForm.exam_code}
                    onChange={(e) =>
                      setExamForm({ ...examForm, exam_code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                    placeholder="EXAM001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={examForm.subject_code}
                    onChange={(e) =>
                      setExamForm({ ...examForm, subject_code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                    placeholder="CS101"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#014b43] mb-2">
                  Exam Name *
                </label>
                <input
                  type="text"
                  required
                  value={examForm.exam_name}
                  onChange={(e) =>
                    setExamForm({ ...examForm, exam_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  placeholder="Midterm Examination"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Exam Type *
                  </label>
                  <select
                    required
                    value={examForm.exam_type}
                    onChange={(e) =>
                      setExamForm({ ...examForm, exam_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={examForm.exam_date}
                    onChange={(e) =>
                      setExamForm({ ...examForm, exam_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={examForm.start_time}
                    onChange={(e) =>
                      setExamForm({ ...examForm, start_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={examForm.duration_minutes}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.total_marks}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        total_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#014b43] mb-2">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.passing_marks}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        passing_marks: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#014b43] mb-2">
                  Instructions
                </label>
                <textarea
                  value={examForm.instructions}
                  onChange={(e) =>
                    setExamForm({ ...examForm, instructions: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                  rows="3"
                  placeholder="Exam instructions..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateExam(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${PRIMARY}`}
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Questions Modal */}
      {showAddQuestions && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#9ECFD4]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-[#014b43]">
                  Add Questions
                </h3>
                <p className="text-gray-600">{selectedExam.exam_name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAddQuestions(false);
                  setSelectedExam(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddQuestions} className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#F5FAFA] rounded-xl border border-[#9ECFD4]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-[#014b43]">
                      Question {index + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">
                        Question Text *
                      </label>
                      <textarea
                        required
                        value={question.question_text}
                        onChange={(e) =>
                          updateQuestion(index, "question_text", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                        rows="2"
                        placeholder="Enter question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">
                        Max Marks *
                      </label>
                      <input
                        type="number"
                        required
                        value={question.max_marks}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "max_marks",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#014b43] mb-2">
                        Sample Answer
                      </label>
                      <textarea
                        value={question.sample_answer}
                        onChange={(e) =>
                          updateQuestion(index, "sample_answer", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-[#9ECFD4] rounded-lg focus:ring-2 focus:ring-[#016B61] focus:border-transparent"
                        rows="3"
                        placeholder="Model answer for AI reference..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="w-full px-4 py-2 border-2 border-dashed border-[#016B61] text-[#016B61] rounded-lg hover:bg-[#E5E9C5] transition"
              >
                + Add Another Question
              </button>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddQuestions(false);
                    setSelectedExam(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${PRIMARY}`}
                >
                  Add Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Questions Modal */}
      {showViewQuestions && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#9ECFD4]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-[#014b43]">
                  View Questions
                </h3>
                <p className="text-gray-600">{selectedExam.exam_name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Total Questions: {viewingQuestions.length}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewQuestions(false);
                  setSelectedExam(null);
                  setViewingQuestions([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {viewingQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No questions added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewingQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 bg-[#F6FFFF] rounded-xl border border-[#9ECFD4]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-[#014b43]">
                        Question {question.question_number}
                      </h4>
                      <span className="px-3 py-1 bg-[#70B2B2] text-white rounded-full text-sm font-medium">
                        {question.max_marks} marks
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-[#014b43] mb-1">
                          Question:
                        </label>
                        <p className="text-gray-900 bg-white p-3 rounded-lg border border-[#9ECFD4]">
                          {question.question_text}
                        </p>
                      </div>

                      {question.sample_answer && (
                        <div>
                          <label className="block text-sm font-medium text-[#014b43] mb-1">
                            Sample Answer:
                          </label>
                          <p className="text-gray-700 bg-white p-3 rounded-lg border border-[#9ECFD4] text-sm">
                            {question.sample_answer}
                          </p>
                        </div>
                      )}

                      {question.keywords &&
                        Object.keys(question.keywords).length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-[#014b43] mb-1">
                              Keywords:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(question.keywords).map(
                                ([key, values]) =>
                                  Array.isArray(values)
                                    ? values.map((keyword, idx) => (
                                        <span
                                          key={`${key}-${idx}`}
                                          className="px-2 py-1 bg-[#9ECFD4] text-[#014b43] rounded text-xs"
                                        >
                                          {keyword}
                                        </span>
                                      ))
                                    : null
                              )}
                            </div>
                          </div>
                        )}

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(question.created_at).toLocaleDateString()}
                        </span>
                        {question.question_type && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {question.question_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowViewQuestions(false);
                  setSelectedExam(null);
                  setViewingQuestions([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewQuestions(false);
                  setShowAddQuestions(true);
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${PRIMARY}`}
              >
                Add More Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
