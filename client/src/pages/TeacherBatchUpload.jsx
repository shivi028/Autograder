// TeacherBatchUpload.jsx - FIXED VERSION
import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const TeacherBatchUpload = ({ examId, teacherId, onUploadComplete }) => {
  const [uploadMode, setUploadMode] = useState('individual');
  const [files, setFiles] = useState([]);
  const [studentIds, setStudentIds] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setError('');
  };

  const handleZipChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setZipFile(file);
      setError('');
    } else {
      setError('Please select a valid ZIP file');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleIndividualUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    const studentIdList = studentIds.split(',').map(id => id.trim()).filter(id => id);
    
    if (studentIdList.length !== files.length) {
      setError(`Number of files (${files.length}) must match number of student IDs (${studentIdList.length})`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all files
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Append student IDs as comma-separated string
      formData.append('student_ids', studentIdList.join(','));
      formData.append('teacher_id', teacherId);

      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:8000/api/v1/upload/batch/${examId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload Result:', result);
      setUploadResults(result);
      
      if (result.successful_uploads > 0) {
        onUploadComplete?.();
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleZipUpload = async () => {
    if (!zipFile) {
      setError('Please select a ZIP file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('zip_file', zipFile);
      formData.append('teacher_id', teacherId);

      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:8000/api/v1/upload/zip/${examId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('ZIP Upload Result:', result);
      setUploadResults(result);
      
      if (result.successful_uploads > 0) {
        onUploadComplete?.();
      }
    } catch (err) {
      console.error('ZIP Upload Error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFiles([]);
    setZipFile(null);
    setStudentIds('');
    setUploadResults(null);
    setError('');
  };

  if (uploadResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Complete</h3>
          <p className="text-gray-600">{uploadResults.message}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{uploadResults.total_files}</p>
            <p className="text-sm text-gray-600">Total Files</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{uploadResults.successful_uploads}</p>
            <p className="text-sm text-gray-600">Successful</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{uploadResults.failed_uploads}</p>
            <p className="text-sm text-gray-600">Failed</p>
          </div>
        </div>

        {uploadResults.uploads && uploadResults.uploads.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Successful Uploads:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadResults.uploads.map((upload, idx) => (
                <div key={idx} className="flex items-center justify-between bg-green-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">{upload.student_id}</p>
                      <p className="text-sm text-gray-600">{upload.file_name}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {upload.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadResults.failures && uploadResults.failures.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Failed Uploads:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadResults.failures.map((failure, idx) => (
                <div key={idx} className="flex items-center justify-between bg-red-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">{failure.student_id || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{failure.file}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-600">{failure.error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={resetUpload}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Upload More Files
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Upload Answer Sheets</h3>

      {/* Upload Mode Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setUploadMode('individual')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            uploadMode === 'individual'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Individual Files
        </button>
        <button
          onClick={() => setUploadMode('zip')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            uploadMode === 'zip'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ZIP Archive
        </button>
      </div>

      {uploadMode === 'individual' ? (
        <div>
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Answer Sheets (PDF/Images)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, TXT up to 10MB each</p>
              </label>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Files ({files.length})</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-800">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student IDs */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student IDs (comma-separated, in same order as files)
            </label>
            <textarea
              value={studentIds}
              onChange={(e) => setStudentIds(e.target.value)}
              placeholder="STU001, STU002, STU003"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter student IDs separated by commas. Must match the number of files selected.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleIndividualUpload}
            disabled={uploading || files.length === 0}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Answer Sheets</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* ZIP Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select ZIP Archive
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".zip"
                onChange={handleZipChange}
                className="hidden"
                id="zip-upload"
              />
              <label htmlFor="zip-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload ZIP file</p>
                <p className="text-xs text-gray-500 mt-1">Files must be named: studentID_filename.ext</p>
              </label>
            </div>
          </div>

          {zipFile && (
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">{zipFile.name}</span>
                </div>
                <button
                  onClick={() => setZipFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">File Naming Convention:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Format: <code className="bg-blue-100 px-1 rounded">studentID_filename.ext</code></li>
              <li>• Example: <code className="bg-blue-100 px-1 rounded">STU001_exam.pdf</code></li>
              <li>• Student ID must exist in the system</li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleZipUpload}
            disabled={uploading || !zipFile}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing ZIP...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload ZIP Archive</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};