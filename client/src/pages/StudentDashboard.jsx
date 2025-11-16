import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
  AcademicCapIcon,
  SparklesIcon,
  ClockIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Loading from "@/components/Loading";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.student_id || user?.id;

  const [activeTab, setActiveTab] = useState("results");
  const [availableExams, setAvailableExams] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [error, setError] = useState("");
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;

  useEffect(() => {
    if (!studentId) {
      toast.error("No student ID found. Please log in again.");
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "results") {
        const res = await fetch(
          `${API_BASE_URL}/results/student/${studentId}/available-exams`
        );
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        setAvailableExams(data.exams || []);
      } else if (activeTab === "uploads") {
        const res = await fetch(
          `${API_BASE_URL}/upload/student/${studentId}/uploads`
        );
        if (!res.ok) throw new Error("Failed to fetch uploads");
        const data = await res.json();
        setUploads(data.uploads || []);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamResults = async (examId) => {
    setDetailsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/results/student/${studentId}?exam_id=${examId}`
      );
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      if (data.exams && data.exams.length > 0) {
        setSelectedExamResults(data.exams[0]);
        setShowMobileModal(true);
      } else {
        setError("No results available for this exam yet");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load exam results");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExamSelect = (exam) => {
    if (exam.has_results) {
      fetchExamResults(exam.exam_id);
    } else {
      toast.info("Results not available yet");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  const getGradeColor = (grade) =>
    ({
      "A+": "text-[#016B61]",
      "A": "text-[#016B61]",
      "B+": "text-[#70B2B2]",
      "B": "text-[#70B2B2]",
      "C+": "text-[#B39200]",
      "C": "text-[#B39200]",
      "F": "text-red-600",
    }[grade] || "text-gray-600");

  const getStatusBadge = (exam) => {
    const statusConfig = {
      uploaded: {
        text: "Uploaded",
        color: "bg-[#9ECFD4] text-[#014B43]",
        icon: ClockIcon,
      },
      processing: {
        text: "Processing",
        color: "bg-yellow-100 text-yellow-800",
        icon: ClockIcon,
      },
      processed: {
        text: "Grading...",
        color: "bg-purple-100 text-purple-800",
        icon: ClockIcon,
      },
      failed: {
        text: "Failed",
        color: "bg-red-100 text-red-800",
        icon: ExclamationCircleIcon,
      },
      pending: {
        text: "Not Uploaded",
        color: "bg-gray-100 text-gray-800",
        icon: DocumentTextIcon,
      },
    };

    if (exam.has_results) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E5E9C5] text-[#016B61] flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" /> Available
        </span>
      );
    }

    const config = statusConfig[exam.upload_status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" /> {config.text}
      </span>
    );
  };

  // Pagination
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = availableExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(availableExams.length / examsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[78%] bg-[#E5E9C5] overflow-hidden mt-8">
      {/* FLOATING ICONS */}
      {Array.from({ length: 10 }).map((_, i) => {
        const icons = ["📄", "📘", "📝", "📚", "🖊️"];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const top = Math.random() * 85 + 5;
        const left = Math.random() * 85 + 5;
        const size = Math.random() * 45 + 55;
        const opacity = Math.random() * 0.16 + 0.06;
        const floatDelay = Math.random() * 2;
        const floatDuration = Math.random() * 4 + 6;

        return (
          <span
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              opacity,
              color: ["#016B61", "#70B2B2", "#9ECFD4"][i % 3],
              filter: "blur(1px)",
              animation: `float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
            }}
          >
            {icon}
          </span>
        );
      })}

     
      {/* HEADER */}
<header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-[#9ECFD4] relative z-20">
  {/* AI Avatar + Welcome Bubble */}
  <div className="md:pl-32 p-1">
<div className=" flex items-center gap-4 pr-2">

  {/* AI Welcome Bubble */}
  <div className="hidden md:block bg-white/90 border border-[#9ECFD4] rounded-2xl px-4 py-2 shadow-md animate-fadeIn">
    <p className="text-lg font-medium text-[#014B43] flex items-center gap-1">
      <span className="text-lg">🤖</span>
      Hello {user?.full_name?.split(" ")[0]}! 
    </p>
    <p className="text-xs text-[#016B61]/70 -mt-1">
      Your performance is improving — keep it up! 🚀
    </p>
  </div>
  <div className="md:hidden pl-2">
             <h1 className="text-2xl font-bold text-gray-900 ">
               Welcome back, {user?.full_name}
             </h1>
             
           </div>

  {/* Avatar Ring Wrapper */}
  <div className="relative">

    {(() => {
      // -------- LEVEL + GRADE LOGIC --------
      const percentage = selectedExamResults?.percentage ?? 50;
      const level = Math.min(Math.max(Math.floor(percentage / 10), 1), 10);

      const grade = selectedExamResults?.grade || "C";
      const circumference = 2 * Math.PI * 28;

      // -------- GRADE COLOR MAP --------
      const gradeRingColor = {
        "A+": "#016B61",
        "A": "#016B61",
        "B+": "#70B2B2",
        "B": "#70B2B2",
        "C+": "#B39200",
        "C": "#B39200",
        "F": "#B91C1C",
      }[grade] || "#70B2B2";

      const progress = (percentage / 100) * circumference;

      return (
        <div className="relative w-16 h-16 flex items-center justify-center">

          {/* Background Ring */}
          <svg className="absolute inset-0" width="64" height="64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#E5E9C5"
              strokeWidth="4"
              fill="none"
            />
          </svg>

          {/* Animated Grade Ring */}
          <svg className="absolute inset-0" width="64" height="64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={gradeRingColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Avatar (Premium AI Face) */}
          <div className="
            w-14 h-14 rounded-full bg-white border-2 border-[#9ECFD4] shadow-lg 
            flex items-center justify-center overflow-hidden relative
          ">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              alt="AI Avatar"
              className="w-12 h-12 object-cover"
            />
          </div>

          {/* Level Tag */}
          <div className="absolute -bottom-2 bg-[#014B43] text-white text-xs px-2 py-0.5 rounded-full shadow">
            Lv {level}
          </div>
        </div>
      );
    })()}

  </div>
</div>
</div>

</header>


      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-10 relative z-20">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#016B61] text-white rounded-xl p-6 shadow-lg">
            <DocumentTextIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{availableExams.length}</p>
            <p className="text-[#9ECFD4]">Available Exams</p>
          </div>

          <div className="bg-[#70B2B2] text-white rounded-xl p-6 shadow-lg">
            <CheckCircleIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">
              {availableExams.filter((e) => e.has_results).length}
            </p>
            <p className="text-[#E5E9C5]">Results Available</p>
          </div>

          <div className="bg-[#9ECFD4] text-[#014B43] rounded-xl p-6 shadow-lg">
            <ChartBarIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">
              {selectedExamResults?.percentage ?? "--"}%
            </p>
            <p className="text-[#014B43]/70">Latest Score</p>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#9ECFD4]">
          <div className="flex border-b border-[#9ECFD4]/40">
            {[
              { id: "results", label: "My Results", icon: AcademicCapIcon },
              { id: "uploads", label: "Upload History", icon: ArrowUpTrayIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-semibold flex items-center gap-2 transition ${
                  activeTab === tab.id
                    ? "text-[#016B61] border-b-2 border-[#016B61]"
                    : "text-gray-500 hover:text-[#016B61]"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
               <Loading/>
              </div>
            ) : activeTab === "results" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* EXAM LIST */}
                <div className="lg:col-span-1">
                  <h3 className="font-semibold text-[#014B43] mb-4">
                    Available Exams
                  </h3>

                  {availableExams.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      No exams available yet
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {currentExams.map((exam) => (
                          <button
                            key={exam.exam_id}
                            onClick={() => handleExamSelect(exam)}
                            disabled={!exam.has_results}
                            className={`w-full p-4 rounded-lg border-2 text-left transition ${
                              selectedExamResults?.exam_id === exam.exam_id
                                ? "border-[#016B61] bg-[#E5E9C5]"
                                : "border-gray-200 hover:border-[#70B2B2]"
                            } ${
                              !exam.has_results && "opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-[#014B43] text-sm">
                                  {exam.exam_code}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {exam.exam_name}
                                </p>
                              </div>
                              {getStatusBadge(exam)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(exam.exam_date)}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-[#9ECFD4] text-[#016B61] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5E9C5] transition"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition ${
                                currentPage === page
                                  ? "bg-[#016B61] text-white"
                                  : "border border-[#9ECFD4] text-[#014B43] hover:bg-[#E5E9C5]"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-[#9ECFD4] text-[#016B61] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5E9C5] transition"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* RESULTS - Desktop Only */}
                <div className="hidden lg:block lg:col-span-2">
                  {detailsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-12 w-12 border-4 border-[#016B61] border-t-transparent rounded-full" />
                    </div>
                  ) : error ? (
                    <p className="text-center text-gray-600 py-8">{error}</p>
                  ) : selectedExamResults ? (
                    <div className="space-y-6">
                      {/* SUMMARY CARD */}
                      <div className="bg-[#EAF7F4] p-6 rounded-xl border border-[#9ECFD4]">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-bold text-[#014B43] text-lg">
                              {selectedExamResults.exam_name}
                            </h3>
                            <p className="text-sm text-[#016B61]/70">
                              {selectedExamResults.exam_code} • {selectedExamResults.exam_type}
                            </p>
                          </div>
                          <p className={`text-3xl font-bold ${getGradeColor(selectedExamResults.grade)}`}>
                            {selectedExamResults.grade}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center bg-white p-3 rounded-lg shadow">
                            <p className="text-2xl font-bold">{selectedExamResults.obtained_marks}</p>
                            <p className="text-xs text-gray-600">Obtained</p>
                          </div>
                          <div className="text-center bg-white p-3 rounded-lg shadow">
                            <p className="text-2xl font-bold">{selectedExamResults.max_obtainable}</p>
                            <p className="text-xs text-gray-600">Total</p>
                          </div>
                          <div className="text-center bg-white p-3 rounded-lg shadow">
                            <p className="text-2xl font-bold">{selectedExamResults.percentage}%</p>
                            <p className="text-xs text-gray-600">Score</p>
                          </div>
                        </div>
                      </div>

                      {/* QUESTION BREAKDOWN */}
                      <div className="bg-white rounded-xl border border-[#9ECFD4] p-6">
                        <h4 className="font-semibold text-[#014B43] mb-4">Question-wise Results</h4>
                        <div className="space-y-3">
                          {selectedExamResults.questions.map((q) => (
                            <div key={q.question_number} className="border border-[#9ECFD4] rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() => {
                                  const newSet = new Set(expandedQuestions);
                                  newSet.has(q.question_number)
                                    ? newSet.delete(q.question_number)
                                    : newSet.add(q.question_number);
                                  setExpandedQuestions(newSet);
                                }}
                                className="w-full flex justify-between items-center p-4 hover:bg-[#E5E9C5]"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9ECFD4] text-[#014B43] font-semibold text-sm">
                                    {q.question_number}
                                  </span>
                                  <p className="font-medium text-[#014B43] text-sm">{q.question_text}</p>
                                </div>
                                <div className="text-right text-sm">
                                  <span className="font-semibold text-[#014B43]">{q.obtained_marks}</span>/{q.max_marks}
                                </div>
                              </button>

                              {expandedQuestions.has(q.question_number) && (
                                <div className="p-4 bg-[#F7FAF9] border-t border-[#9ECFD4] space-y-3">
                                  {q.student_answer?.trim() && (
                                    <div>
                                      <p className="text-sm font-medium text-[#016B61] mb-1">Your Answer:</p>
                                      <div className="bg-white p-3 rounded border border-[#9ECFD4]">
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.student_answer}</p>
                                      </div>
                                    </div>
                                  )}
                                  {q.ai_feedback && (
                                    <div className="bg-[#E0F3FF] p-3 rounded border border-blue-200">
                                      <p className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                                        <SparklesIcon className="w-4 h-4 mr-1" />AI Feedback
                                      </p>
                                      <p className="text-sm text-blue-900">{q.ai_feedback}</p>
                                    </div>
                                  )}
                                  {q.teacher_feedback && (
                                    <div className="bg-[#E1F9E8] p-3 rounded border border-green-200">
                                      <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                                        <AcademicCapIcon className="w-4 h-4 mr-1" />Teacher Feedback
                                      </p>
                                      <p className="text-sm text-green-900">{q.teacher_feedback}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">Select an exam to view results</p>
                  )}
                </div>
              </div>
            ) : (
              /* UPLOAD TAB */
              <div className="grid gap-4">
                {uploads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ArrowUpTrayIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>No uploads yet</p>
                  </div>
                ) : (
                  uploads.map((upload) => (
                    <div key={upload.id} className="bg-white/90 border border-[#9ECFD4] rounded-xl p-6 shadow">
                      <h3 className="font-semibold text-[#014B43]">{upload.exam_name}</h3>
                      <p className="text-sm text-gray-600">{upload.exam_code}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                        <span>Size: {formatFileSize(upload.file_size)}</span>
                        <span>Type: {upload.file_type?.toUpperCase()}</span>
                        <span>Uploaded: {formatDate(upload.uploaded_at)}</span>
                      </div>
                      <p className="mt-2 text-xs text-[#016B61] font-medium">Status: {upload.processing_status}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE MODAL */}
      {showMobileModal && selectedExamResults && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#9ECFD4] p-4 flex justify-between items-center">
              <h3 className="font-bold text-[#014B43] text-lg">Exam Results</h3>
              <button
                onClick={() => {
                  setShowMobileModal(false);
                  setSelectedExamResults(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* SUMMARY */}
              <div className="bg-[#EAF7F4] p-6 rounded-xl border border-[#9ECFD4]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-[#014B43] text-lg">{selectedExamResults.exam_name}</h3>
                    <p className="text-sm text-[#016B61]/70">
                      {selectedExamResults.exam_code} • {selectedExamResults.exam_type}
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${getGradeColor(selectedExamResults.grade)}`}>
                    {selectedExamResults.grade}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-white p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold">{selectedExamResults.obtained_marks}</p>
                    <p className="text-xs text-gray-600">Obtained</p>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold">{selectedExamResults.max_obtainable}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold">{selectedExamResults.percentage}%</p>
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                </div>
              </div>

              {/* QUESTIONS */}
              <div>
                <h4 className="font-semibold text-[#014B43] mb-4">Question-wise Results</h4>
                <div className="space-y-3">
                  {selectedExamResults.questions.map((q) => (
                    <div key={q.question_number} className="border border-[#9ECFD4] rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          const newSet = new Set(expandedQuestions);
                          newSet.has(q.question_number)
                            ? newSet.delete(q.question_number)
                            : newSet.add(q.question_number);
                          setExpandedQuestions(newSet);
                        }}
                        className="w-full flex justify-between items-center p-4 hover:bg-[#E5E9C5]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9ECFD4] text-[#014B43] font-semibold text-sm">
                            {q.question_number}
                          </span>
                          <p className="font-medium text-[#014B43] text-sm text-left">{q.question_text}</p>
                        </div>
                        <div className="text-right text-sm">
                          <span className="font-semibold text-[#014B43]">{q.obtained_marks}</span>/{q.max_marks}
                        </div>
                      </button>

                      {expandedQuestions.has(q.question_number) && (
                        <div className="p-4 bg-[#F7FAF9] border-t border-[#9ECFD4] space-y-3">
                          {q.student_answer?.trim() && (
                            <div>
                              <p className="text-sm font-medium text-[#016B61] mb-1">Your Answer:</p>
                              <div className="bg-white p-3 rounded border border-[#9ECFD4]">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.student_answer}</p>
                              </div>
                            </div>
                          )}
                          {q.ai_feedback && (
                            <div className="bg-[#E0F3FF] p-3 rounded border border-blue-200">
                              <p className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                                <SparklesIcon className="w-4 h-4 mr-1" />AI Feedback
                              </p>
                              <p className="text-sm text-blue-900">{q.ai_feedback}</p>
                            </div>
                          )}
                          {q.teacher_feedback && (
                            <div className="bg-[#E1F9E8] p-3 rounded border border-green-200">
                              <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                                <AcademicCapIcon className="w-4 h-4 mr-1" />Teacher Feedback
                              </p>
                              <p className="text-sm text-green-900">{q.teacher_feedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;