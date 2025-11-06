// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date to short string
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format time
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Calculate grade from percentage
export const calculateGrade = (percentage) => {
  if (percentage >= 85) return 'A+';
  if (percentage >= 75) return 'A';
  if (percentage >= 65) return 'B+';
  if (percentage >= 55) return 'B';
  if (percentage >= 45) return 'C';
  return 'F';
};

// Get grade color
export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'text-green-600 bg-green-100',
    'A': 'text-green-500 bg-green-50',
    'B+': 'text-blue-600 bg-blue-100',
    'B': 'text-blue-500 bg-blue-50',
    'C': 'text-yellow-600 bg-yellow-100',
    'F': 'text-red-600 bg-red-100'
  };
  return colors[grade] || 'text-gray-600 bg-gray-100';
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    uploaded: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    processed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    grading: 'bg-purple-100 text-purple-800'
  };
  return colors[status]   || 'bg-gray-100 text-gray-800';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate file type
export const isValidFileType = (filename, allowedTypes = ['pdf', 'jpg', 'jpeg', 'png']) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Validate file size (default 10MB)
export const isValidFileSize = (size, maxSize = 10485760) => {
  return size <= maxSize;
};

// Get exam type badge color
export const getExamTypeColor = (type) => {
  const colors = {
    midterm: 'bg-blue-100 text-blue-800',
    final: 'bg-purple-100 text-purple-800',
    quiz: 'bg-green-100 text-green-800',
    assignment: 'bg-yellow-100 text-yellow-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

// Calculate percentage
export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Format duration
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

// Get time ago
export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return formatDateShort(dateString);
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate random color
export const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
