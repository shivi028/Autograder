// TeacherBatchUpload.jsx - THEMED VERSION
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
      files.forEach(file => formData.append('files', file));
      
      formData.append('student_ids', studentIdList.join(','));
      formData.append('teacher_id', teacherId);

      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://localhost:8000/api/v1/upload/batch/${examId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      setUploadResults(result);
      
      if (result.successful_uploads > 0) {
        onUploadComplete?.();
      }
    } catch (err) {
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
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      setUploadResults(result);
      
      if (result.successful_uploads > 0) {
        onUploadComplete?.();
      }
    } catch (err) {
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

  /* ---------------------------------------------------------
      SUCCESS RESULTS UI
  ----------------------------------------------------------*/
  if (uploadResults) {
    return (
      <div className="bg-white border border-[#9ECFD4] rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-[#016B61] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#014b43] mb-2">Upload Complete</h3>
          <p className="text-gray-600">{uploadResults.message}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#E5E9C5] p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-[#016B61]">{uploadResults.total_files}</p>
            <p className="text-sm text-gray-700">Total Files</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{uploadResults.successful_uploads}</p>
            <p className="text-sm text-gray-700">Successful</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{uploadResults.failed_uploads}</p>
            <p className="text-sm text-gray-700">Failed</p>
          </div>
        </div>

        {uploadResults.uploads?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-[#014b43] mb-2">Successful Uploads:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadResults.uploads.map((u, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#E5E9C5] p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#016B61]" />
                    <div>
                      <p className="font-medium text-[#014b43]">{u.student_id}</p>
                      <p className="text-sm text-gray-600">{u.file_name}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#70B2B2] text-white px-2 py-1 rounded">
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadResults.failures?.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Failed Uploads:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadResults.failures.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between bg-red-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-800">{f.student_id || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{f.file}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-700">{f.error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={resetUpload}
          className="w-full bg-[#016B61] text-white py-2 px-4 rounded-lg hover:bg-[#014b43] transition"
        >
          Upload More Files
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------
      MAIN UPLOAD UI
  ----------------------------------------------------------*/
  return (
    <div className="bg-white border border-[#9ECFD4] rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-[#014b43] mb-6">
        Upload Answer Sheets
      </h3>

      {/* Mode buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setUploadMode('individual')}
          className={`flex-1 py-3 rounded-lg font-medium transition 
            ${uploadMode === 'individual'
              ? 'bg-[#016B61] text-white'
              : 'bg-[#E5E9C5] text-[#014b43] hover:bg-[#dbe3b3]'
            }`}
        >
          Individual Files
        </button>

        <button
          onClick={() => setUploadMode('zip')}
          className={`flex-1 py-3 rounded-lg font-medium transition 
            ${uploadMode === 'zip'
              ? 'bg-[#016B61] text-white'
              : 'bg-[#E5E9C5] text-[#014b43] hover:bg-[#dbe3b3]'
            }`}
        >
          ZIP Archive
        </button>
      </div>

      {/* FILE — INDIVIDUAL MODE */}
      {uploadMode === 'individual' ? (
        <>
          {/* Upload Box */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#014b43] mb-2">
              Select Answer Sheets (PDF/Images)
            </label>

            <div className="border-2 border-dashed border-[#70B2B2] rounded-lg p-6 text-center hover:border-[#016B61] transition">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-[#70B2B2] mx-auto mb-2" />
                <p className="text-[#014b43]">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG, TXT up to 10MB</p>
              </label>
            </div>
          </div>

          {/* Show Files */}
          {files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-[#014b43] mb-2">
                Selected Files ({files.length})
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#E5E9C5] p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#014b43]" />
                      <span className="text-sm text-[#014b43]">{file.name}</span>
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
            <label className="block text-sm font-medium text-[#014b43] mb-2">
              Student IDs (comma-separated)
            </label>
            <textarea
              value={studentIds}
              onChange={(e) => setStudentIds(e.target.value)}
              placeholder="STU001, STU002, STU003"
              className="w-full border border-[#9ECFD4] rounded-lg p-3 focus:ring-2 focus:ring-[#016B61]"
              rows={3}
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleIndividualUpload}
            disabled={uploading || files.length === 0}
            className="w-full bg-[#016B61] text-white py-3 rounded-lg hover:bg-[#014b43] disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? "Uploading..." : "Upload Answer Sheets"}
          </button>
        </>
      ) : (
        <>
          {/* ZIP MODE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#014b43] mb-2">
              Select ZIP Archive
            </label>

            <div className="border-2 border-dashed border-[#70B2B2] rounded-lg p-6 text-center hover:border-[#016B61] transition">
              <input
                type="file"
                accept=".zip"
                onChange={handleZipChange}
                className="hidden"
                id="zip-upload"
              />

              <label htmlFor="zip-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-[#70B2B2] mx-auto mb-2" />
                <p className="text-[#014b43]">Upload ZIP file</p>
              </label>
            </div>
          </div>

          {zipFile && (
            <div className="mb-4 bg-[#E5E9C5] p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#014b43]" />
                  <span className="text-sm font-medium text-[#014b43]">{zipFile.name}</span>
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

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleZipUpload}
            disabled={uploading || !zipFile}
            className="w-full bg-[#016B61] text-white py-3 rounded-lg hover:bg-[#014b43] flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? "Processing ZIP..." : "Upload ZIP Archive"}
          </button>
        </>
      )}
    </div>
  );
};
