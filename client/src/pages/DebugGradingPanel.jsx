import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

export default function DebugGradingPanel({ examId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [regrading, setRegrading] = useState(false);

  useEffect(() => {
    fetchGradingStatus();
  }, [examId]);

  const fetchGradingStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/exam/${examId}/grading-status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const regradeAll = async () => {
    if (!confirm('This will regrade all uploads. Continue?')) return;

    setRegrading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/exam/${examId}/regrade-all`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Regraded ${data.successful}/${data.total_uploads} uploads successfully!`);
        fetchGradingStatus();
      } else {
        const error = await response.json();
        alert(`❌ Failed: ${error.detail}`);
      }
    } catch (error) {
      console.error('Regrade error:', error);
      alert('❌ Regrade failed');
    } finally {
      setRegrading(false);
    }
  };

  const regradeOne = async (uploadId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/upload/${uploadId}/reprocess`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        alert('✅ Reprocessed successfully!');
        fetchGradingStatus();
      } else {
        const error = await response.json();
        alert(`❌ Failed: ${error.detail}`);
      }
    } catch (error) {
      console.error('Reprocess error:', error);
      alert('❌ Reprocess failed');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading status...</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No status available</p>
      </div>
    );
  }

  const gradedCount = status.uploads.filter(u => u.is_graded).length;
  const processedCount = status.uploads.filter(u => u.processing_status === 'processed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Total Uploads</p>
          <p className="text-2xl font-bold text-gray-900">{status.total_uploads}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Processed</p>
          <p className="text-2xl font-bold text-blue-600">{processedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Graded</p>
          <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{processedCount - gradedCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔧 Debug Actions</h3>
          <button
            onClick={fetchGradingStatus}
            className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={regradeAll}
            disabled={regrading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {regrading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Regrading All...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Regrade All Uploads</span>
              </>
            )}
          </button>

          {gradedCount === 0 && processedCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Action Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {processedCount} uploads are processed but not graded. Click "Regrade All" to start grading.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Details Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">📊 Upload Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">OCR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Results</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {status.uploads.map((upload, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{upload.student_name}</div>
                    <div className="text-xs text-gray-500">{upload.student_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      upload.processing_status === 'processed' 
                        ? 'bg-green-100 text-green-800'
                        : upload.processing_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {upload.processing_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {upload.has_ocr_text ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{upload.student_answers_count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      upload.grading_results_count > 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {upload.grading_results_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => regradeOne(upload.upload_id)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Regrade</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Console Log Reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 font-medium mb-2">💡 Debugging Tips:</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Check backend console for detailed logs during regrading</li>
          <li>• Look for "AUTO-GRADING UPLOAD" messages</li>
          <li>• Verify questions exist for this exam in database</li>
          <li>• Ensure OCR text is not empty before grading</li>
        </ul>
      </div>
    </div>
  );
}