// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { DashboardSidebar } from "../components/dashboard-sidebar";
// import { CheckCircle, Clock, TrendingUp, Award, Calendar } from "lucide-react";

// export default function StudentDashboard() {
//   const { user } = useAuth();

//   // Auth protection
//   if (!user) return <Navigate to="/login" />;
//   if (user.user_metadata.role !== "student") return <Navigate to="/login" />;

//   return (
//     <div className="min-h-screen bg-background">
//       <DashboardSidebar userRole="student" />

//       <div className="md:ml-64">
//         <div className="p-6">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-foreground mb-2">
//               Welcome back, {user.user_metadata.full_name}!
//             </h1>
//             <p className="text-muted-foreground">
//               Here's your learning progress and upcoming assignments.
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Completed</CardTitle>
//                 <CheckCircle className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">24</div>
//                 <p className="text-xs text-muted-foreground">Assignments completed</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Pending</CardTitle>
//                 <Clock className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">3</div>
//                 <p className="text-xs text-muted-foreground">Due this week</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">89.2%</div>
//                 <p className="text-xs text-muted-foreground">+3.2% this month</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Achievements</CardTitle>
//                 <Award className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">7</div>
//                 <p className="text-xs text-muted-foreground">Badges earned</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Upcoming Assignments */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upcoming Assignments</CardTitle>
//                 <CardDescription>Your pending assignments and deadlines</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     { title: "Math Quiz #4", subject: "Mathematics", due: "Tomorrow", status: "pending" },
//                     { title: "Science Lab Report", subject: "Physics", due: "Dec 15", status: "pending" },
//                     { title: "History Essay", subject: "World History", due: "Dec 18", status: "pending" },
//                   ].map((assignment, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//                       <div className="flex-1">
//                         <h4 className="font-medium">{assignment.title}</h4>
//                         <p className="text-sm text-muted-foreground">{assignment.subject}</p>
//                       </div>
//                       <div className="text-right">
//                         <div className="flex items-center text-sm text-muted-foreground mb-2">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           Due {assignment.due}
//                         </div>
//                         <Button size="sm">Start</Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recent Results */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Results</CardTitle>
//                 <CardDescription>Your latest assignment grades and feedback</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {[
//                     { title: "Math Quiz #3", subject: "Mathematics", grade: "95%", feedback: "Excellent work!" },
//                     { title: "English Essay", subject: "Literature", grade: "88%", feedback: "Good analysis, minor grammar issues" },
//                     { title: "Science Test", subject: "Biology", grade: "92%", feedback: "Strong understanding of concepts" },
//                     { title: "History Project", subject: "World History", grade: "85%", feedback: "Well researched, needs more detail" },
//                   ].map((result, index) => (
//                     <div key={index} className="p-4 bg-muted/50 rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h4 className="font-medium">{result.title}</h4>
//                           <p className="text-sm text-muted-foreground">{result.subject}</p>
//                         </div>
//                         <div
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             Number.parseInt(result.grade) >= 90
//                               ? "bg-green-100 text-green-800"
//                               : Number.parseInt(result.grade) >= 80
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {result.grade}
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground">{result.feedback}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Progress Chart */}
//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle>Learning Progress</CardTitle>
//               <CardDescription>Your performance across different subjects</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[
//                   { subject: "Mathematics", progress: 92, color: "bg-blue-500" },
//                   { subject: "Science", progress: 88, color: "bg-green-500" },
//                   { subject: "History", progress: 85, color: "bg-purple-500" },
//                   { subject: "English", progress: 90, color: "bg-orange-500" },
//                 ].map((subject, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">{subject.subject}</span>
//                       <span className="text-sm font-medium">{subject.progress}%</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all duration-500 ${subject.color}`}
//                         style={{ width: `${subject.progress}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../lib/api';
// import toast from 'react-hot-toast';
// import Loading from '../components/Loading';
// import {
//   DocumentTextIcon,
//   ChartBarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   ArrowUpTrayIcon,
//   XMarkIcon,
//   AcademicCapIcon
// } from '@heroicons/react/24/outline';

// const StudentDashboard = () => {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('exams');
//   const [exams, setExams] = useState([]);
//   const [results, setResults] = useState([]);
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [uploadFile, setUploadFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [activeTab]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       if (activeTab === 'exams') {
//         const data = await api.student.getAvailableExams();
//         setExams(data.available_exams || []);
//       } else if (activeTab === 'results') {
//         const data = await api.student.getMyResults();
//         setResults(data.exams || []);
//       } else if (activeTab === 'uploads') {
//         const data = await api.student.getMyUploads();
//         setUploads(data.uploads || []);
//       }
//     } catch (error) {
//       toast.error(error.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
//       if (!validTypes.includes(file.type)) {
//         toast.error('Invalid file type. Please upload PDF, JPG, or PNG');
//         return;
//       }

//       // Validate file size (10MB)
//       const maxSize = 10 * 1024 * 1024;
//       if (file.size > maxSize) {
//         toast.error('File too large. Maximum size is 10MB');
//         return;
//       }

//       setUploadFile(file);
//     }
//   };

//   const handleUpload = async () => {
//     if (!uploadFile || !selectedExam) return;

//     setUploading(true);
//     const loadingToast = toast.loading('Uploading answer sheet...');

//     try {
//       const result = await api.student.uploadAnswerSheet(selectedExam.id, uploadFile);
//       toast.success('Answer sheet uploaded successfully!', { id: loadingToast });
//       setSelectedExam(null);
//       setUploadFile(null);

//       // Refresh data
//       fetchData();
//     } catch (error) {
//       toast.error(error.message || 'Upload failed', { id: loadingToast });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       uploaded: 'bg-blue-100 text-blue-800',
//       processing: 'bg-yellow-100 text-yellow-800',
//       processed: 'bg-green-100 text-green-800',
//       failed: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getGradeColor = (grade) => {
//     const colors = {
//       'A+': 'text-green-600',
//       'A': 'text-green-500',
//       'B+': 'text-blue-600',
//       'B': 'text-blue-500',
//       'C': 'text-yellow-600',
//       'F': 'text-red-600'
//     };
//     return colors[grade] || 'text-gray-600';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
//               <p className="text-gray-600">Welcome back, {user?.full_name || 'Student'}</p>
//             </div>
//             <button
//               onClick={logout}
//               className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
//             <DocumentTextIcon className="h-8 w-8 mb-2 opacity-80" />
//             <div className="text-3xl font-bold mb-1">{exams.length}</div>
//             <div className="text-blue-100">Available Exams</div>
//           </div>

//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
//             <CheckCircleIcon className="h-8 w-8 mb-2 opacity-80" />
//             <div className="text-3xl font-bold mb-1">
//               {uploads.filter(u => u.processing_status === 'processed').length}
//             </div>
//             <div className="text-green-100">Completed</div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
//             <ChartBarIcon className="h-8 w-8 mb-2 opacity-80" />
//             <div className="text-3xl font-bold mb-1">
//               {results.length > 0
//                 ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length)
//                 : 0}%
//             </div>
//             <div className="text-purple-100">Average Score</div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
//           <div className="border-b border-gray-200">
//             <div className="flex space-x-8 px-6">
//               {[
//                 { id: 'exams', label: 'Available Exams', icon: DocumentTextIcon },
//                 { id: 'results', label: 'My Results', icon: AcademicCapIcon },
//                 { id: 'uploads', label: 'Upload History', icon: ArrowUpTrayIcon }
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-4 px-2 font-medium text-sm transition relative flex items-center space-x-2 ${
//                     activeTab === tab.id
//                       ? 'text-indigo-600 border-b-2 border-indigo-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <tab.icon className="h-5 w-5" />
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <Loading message="Loading data..." />
//             ) : (
//               <>
//                 {/* Exams Tab */}
//                 {activeTab === 'exams' && (
//                   <div className="grid gap-4">
//                     {exams.length === 0 ? (
//                       <div className="text-center py-12 text-gray-500">
//                         <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg font-medium">No available exams</p>
//                         <p className="text-sm mt-2">Check back later for new exams</p>
//                       </div>
//                     ) : (
//                       exams.map((exam) => (
//                         <div
//                           key={exam.id}
//                           className="bg-gradient-to-r from-white to-indigo-50 rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition"
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                                 {exam.exam_name}
//                               </h3>
//                               <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
//                                 <span className="flex items-center">
//                                   <ClockIcon className="h-4 w-4 mr-1" />
//                                   {formatDate(exam.exam_date)}
//                                 </span>
//                                 <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
//                                   {exam.exam_type}
//                                 </span>
//                                 <span className="font-medium">{exam.total_marks} marks</span>
//                                 <span className="text-gray-500">
//                                   Duration: {exam.duration_minutes} min
//                                 </span>
//                               </div>
//                               {exam.subjects && (
//                                 <p className="text-gray-600">
//                                   Subject: {exam.subjects.subject_name} ({exam.subjects.subject_code})
//                                 </p>
//                               )}
//                               {exam.instructions && (
//                                 <p className="text-sm text-gray-500 mt-2">
//                                   {exam.instructions}
//                                 </p>
//                               )}
//                             </div>

//                             {exam.already_uploaded ? (
//                               <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center">
//                                 <CheckCircleIcon className="h-5 w-5 mr-2" />
//                                 Uploaded
//                               </span>
//                             ) : (
//                               <button
//                                 onClick={() => setSelectedExam(exam)}
//                                 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5"
//                               >
//                                 Upload Answer
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}

//                 {/* Results Tab */}
//                 {activeTab === 'results' && (
//                   <div className="grid gap-4">
//                     {results.length === 0 ? (
//                       <div className="text-center py-12 text-gray-500">
//                         <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg font-medium">No results available</p>
//                         <p className="text-sm mt-2">Your results will appear here once grading is complete</p>
//                       </div>
//                     ) : (
//                       results.map((result) => (
//                         <div
//                           key={result.exam_id}
//                           className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
//                         >
//                           <div className="flex justify-between items-start mb-4">
//                             <div>
//                               <h3 className="text-xl font-semibold text-gray-900 mb-1">
//                                 {result.exam_name}
//                               </h3>
//                               <p className="text-gray-600">
//                                 {result.exam_type} • {formatDate(result.exam_date)}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <div className={`text-4xl font-bold ${getGradeColor(result.grade)}`}>
//                                 {result.grade}
//                               </div>
//                               <div className="text-gray-600 text-lg">{result.percentage}%</div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                             <span className="text-gray-600">
//                               Score: <span className="font-semibold">{result.obtained_marks}</span> / {result.total_marks}
//                             </span>
//                             {result.questions && result.questions.length > 0 && (
//                               <span className="text-sm text-gray-500">
//                                 {result.questions.length} questions
//                               </span>
//                             )}
//                           </div>

//                           {/* Question-wise breakdown */}
//                           {result.questions && result.questions.length > 0 && (
//                             <details className="mt-4">
//                               <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium">
//                                 View Question-wise Details
//                               </summary>
//                               <div className="mt-4 space-y-3">
//                                 {result.questions.map((q, idx) => (
//                                   <div key={idx} className="bg-gray-50 rounded-lg p-3">
//                                     <div className="flex justify-between items-center">
//                                       <span className="text-sm font-medium text-gray-700">
//                                         Question {q.question_number}
//                                       </span>
//                                       <span className="text-sm font-semibold">
//                                         {q.obtained_marks} / {q.max_marks || 10} marks
//                                       </span>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </details>
//                           )}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}

//                 {/* Uploads Tab */}
//                 {activeTab === 'uploads' && (
//                   <div className="grid gap-4">
//                     {uploads.length === 0 ? (
//                       <div className="text-center py-12 text-gray-500">
//                         <ArrowUpTrayIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg font-medium">No uploads yet</p>
//                         <p className="text-sm mt-2">Upload your first answer sheet from the Exams tab</p>
//                       </div>
//                     ) : (
//                       uploads.map((upload) => (
//                         <div
//                           key={upload.id}
//                           className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                                 {upload.file_name}
//                               </h3>
//                               <div className="flex flex-wrap gap-3 text-sm text-gray-600">
//                                 <span>Size: {formatFileSize(upload.file_size)}</span>
//                                 <span>Type: {upload.file_type.toUpperCase()}</span>
//                                 <span className="text-gray-400">•</span>
//                                 <span>{formatDate(upload.uploaded_at)}</span>
//                               </div>
//                               {upload.error_message && (
//                                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                                   <ExclamationCircleIcon className="h-4 w-4 mr-1" />
//                                   {upload.error_message}
//                                 </p>
//                               )}
//                             </div>
//                             <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(upload.processing_status)}`}>
//                               {upload.processing_status}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Upload Modal */}
//       {selectedExam && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 Upload Answer Sheet
//               </h3>
//               <button
//                 onClick={() => {
//                   setSelectedExam(null);
//                   setUploadFile(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600"
//                 disabled={uploading}
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
//               <p className="font-medium text-gray-900">{selectedExam.exam_name}</p>
//               <p className="text-sm text-gray-600">
//                 {selectedExam.subjects?.subject_name}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selectedExam.total_marks} marks • {selectedExam.duration_minutes} min
//               </p>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select File (PDF, JPG, PNG - Max 10MB)
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileSelect}
//                 disabled={uploading}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//               {uploadFile && (
//                 <div className="mt-2 p-3 bg-green-50 rounded-lg">
//                   <p className="text-sm text-green-800 font-medium">
//                     ✓ Selected: {uploadFile.name}
//                   </p>
//                   <p className="text-xs text-green-600 mt-1">
//                     Size: {formatFileSize(uploadFile.size)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setSelectedExam(null);
//                   setUploadFile(null);
//                 }}
//                 disabled={uploading}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpload}
//                 disabled={!uploadFile || uploading}
//                 className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {uploading ? (
//                   <span className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                     Uploading...
//                   </span>
//                 ) : (
//                   'Upload'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
  AcademicCapIcon,
  EyeIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // real logged-in user
  const studentId = user?.student_id || user?.id;

  const [activeTab, setActiveTab] = useState("results");
  const [availableExams, setAvailableExams] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) {
      toast.error("No student ID found. Please log in again.");
      return;
    }
    fetchData();
  }, [activeTab]);

  // ---------- Fetch Data ----------
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

  // ---------- UI Helpers ----------
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
      "A+": "text-green-600",
      A: "text-green-500",
      "B+": "text-blue-600",
      B: "text-blue-500",
      "C+": "text-yellow-600",
      C: "text-yellow-500",
      F: "text-red-600",
    }[grade] || "text-gray-600");

  const getStatusBadge = (exam) => {
    if (exam.has_results) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" /> Available
        </span>
      );
    }

    const statusConfig = {
      uploaded: {
        text: "Uploaded",
        color: "bg-blue-100 text-blue-800",
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

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.full_name}</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
            <DocumentTextIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{availableExams.length}</p>
            <p className="text-blue-100">Available Exams</p>
          </div>

          <div className="bg-green-600 text-white rounded-xl p-6 shadow-md">
            <CheckCircleIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">
              {availableExams.filter((e) => e.has_results).length}
            </p>
            <p className="text-green-100">Results Available</p>
          </div>

          <div className="bg-purple-600 text-white rounded-xl p-6 shadow-md">
            <ChartBarIcon className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">
              {selectedExamResults?.percentage ?? "--"}%
            </p>
            <p className="text-purple-100">Latest Score</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow border">
          <div className="flex border-b">
            {[
              { id: "results", label: "My Results", icon: AcademicCapIcon },
              { id: "uploads", label: "Upload History", icon: ArrowUpTrayIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-5 w-5" /> <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : activeTab === "results" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Exam list */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Available Exams
                  </h3>
                  {availableExams.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      No exams available yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {availableExams.map((exam) => (
                        <button
                          key={exam.exam_id}
                          onClick={() => handleExamSelect(exam)}
                          disabled={!exam.has_results}
                          className={`w-full p-4 rounded-lg border-2 text-left transition ${
                            selectedExamResults?.exam_id === exam.exam_id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300"
                          } ${
                            !exam.has_results && "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
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
                  )}
                </div>

                {/* Results */}
                <div className="lg:col-span-2">
                  {detailsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
                    </div>
                  ) : error ? (
                    <p className="text-center text-gray-600 py-8">{error}</p>
                  ) : selectedExamResults ? (
                    <div className="space-y-6">
                      {/* Summary */}
                      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {selectedExamResults.exam_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {selectedExamResults.exam_code} •{" "}
                              {selectedExamResults.exam_type}
                            </p>
                          </div>
                          <p
                            className={`text-3xl font-bold ${getGradeColor(
                              selectedExamResults.grade
                            )}`}
                          >
                            {selectedExamResults.grade}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold">
                              {selectedExamResults.obtained_marks}
                            </p>
                            <p className="text-xs text-gray-500">Obtained</p>
                          </div>
                          <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold">
                              {selectedExamResults.max_obtainable}
                            </p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                          <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-2xl font-bold">
                              {selectedExamResults.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Question breakdown */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Question-wise Results
                        </h4>
                        <div className="space-y-3">
                          {selectedExamResults.questions.map((q) => (
                            <div
                              key={q.question_number}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  const newSet = new Set(expandedQuestions);
                                  newSet.has(q.question_number)
                                    ? newSet.delete(q.question_number)
                                    : newSet.add(q.question_number);
                                  setExpandedQuestions(newSet);
                                }}
                                className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                    {q.question_number}
                                  </span>
                                  <p className="font-medium text-gray-800 text-sm">
                                    {q.question_text}
                                  </p>
                                </div>
                                <div className="text-right text-sm">
                                  <span className="font-semibold text-gray-800">
                                    {q.obtained_marks}
                                  </span>
                                  /{q.max_marks}
                                </div>
                              </button>

                              {expandedQuestions.has(q.question_number) && (
                                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                                  <div>
                                    {q.student_answer?.trim() ? (
                                      <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                          Your Answer:
                                        </p>
                                        <div className="bg-white p-3 rounded border border-gray-200">
                                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {q.student_answer}
                                          </p>
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>

                                  {q.ai_feedback && (
                                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                      <p className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                                        <SparklesIcon className="w-4 h-4 mr-1" />{" "}
                                        AI Feedback
                                      </p>
                                      <p className="text-sm text-blue-900">
                                        {q.ai_feedback}
                                      </p>
                                    </div>
                                  )}

                                  {q.teacher_feedback && (
                                    <div className="bg-green-50 p-3 rounded border border-green-200">
                                      <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                                        <AcademicCapIcon className="w-4 h-4 mr-1" />{" "}
                                        Teacher Feedback
                                      </p>
                                      <p className="text-sm text-green-900">
                                        {q.teacher_feedback}
                                      </p>
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
                    <p className="text-center text-gray-500 py-8">
                      Select an exam to view results
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // Upload tab
              <div className="grid gap-4">
                {uploads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ArrowUpTrayIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No uploads yet</p>
                  </div>
                ) : (
                  uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {upload.exam_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {upload.exam_code}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>Size: {formatFileSize(upload.file_size)}</span>
                        <span>Type: {upload.file_type?.toUpperCase()}</span>
                        <span>Uploaded: {formatDate(upload.uploaded_at)}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Status: {upload.processing_status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
