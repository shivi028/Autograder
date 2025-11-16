import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import Loading from '@/components/Loading';

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
          headers: { 'Authorization': `Bearer ${token}` }
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
          headers: { 'Authorization': `Bearer ${token}` }
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
          headers: { 'Authorization': `Bearer ${token}` }
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
      <div className="bg-white rounded-lg shadow p-6 border border-[#9ECFD4]">
        <div className="flex items-center justify-center">
          <Loading/>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-[#9ECFD4]">
        <p className="text-[#014B43]">No status available</p>
      </div>
    );
  }

  const gradedCount = status.uploads.filter(u => u.is_graded).length;
  const processedCount = status.uploads.filter(u => u.processing_status === 'processed').length;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-[#9ECFD4]">
          <p className="text-sm text-[#014B43] mb-1">Total Uploads</p>
          <p className="text-2xl font-bold text-[#016B61]">{status.total_uploads}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-[#9ECFD4]">
          <p className="text-sm text-[#014B43] mb-1">Processed</p>
          <p className="text-2xl font-bold text-[#70B2B2]">{processedCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-[#9ECFD4]">
          <p className="text-sm text-[#014B43] mb-1">Graded</p>
          <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-[#9ECFD4]">
          <p className="text-sm text-[#014B43] mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{processedCount - gradedCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6 border border-[#9ECFD4]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#014B43]">🔧 Debug Actions</h3>

          <button
            onClick={fetchGradingStatus}
            className="text-[#016B61] hover:text-[#014B43] flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={regradeAll}
            disabled={regrading}
            className="w-full bg-[#016B61] text-white py-3 px-4 rounded-lg hover:bg-[#014B43] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-700" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Action Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {processedCount} uploads are processed but not graded.  
                    Click **Regrade All** to start.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Details Table */}
      <div className="bg-white rounded-lg shadow border border-[#9ECFD4] overflow-hidden">
        <div className="p-6 border-b border-[#9ECFD4] bg-[#E5E9C5]">
          <h3 className="text-lg font-semibold text-[#014B43]">📊 Upload Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-[#F0F7F7] text-[#014B43]">
              <tr>
                {['Student', 'Status', 'OCR', 'Answers', 'Results', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-[#9ECFD4]">
              {status.uploads.map((upload, idx) => (
                <tr key={idx} className="hover:bg-[#F6FCFC]">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#014B43]">{upload.student_name}</div>
                    <div className="text-xs text-gray-500">{upload.student_id}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      upload.processing_status === 'processed'
                        ? 'bg-green-100 text-green-700'
                        : upload.processing_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
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

                  <td className="px-6 py-4 whitespace-nowrap text-[#014B43]">
                    {upload.student_answers_count}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      upload.grading_results_count > 0
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}>
                      {upload.grading_results_count}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => regradeOne(upload.upload_id)}
                      className="text-[#016B61] hover:text-[#014B43] flex items-center space-x-1"
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

      {/* Tips Panel */}
      <div className="bg-[#DFF6F6] border border-[#9ECFD4] rounded-lg p-4">
        <p className="text-sm text-[#014B43] font-medium mb-2">💡 Debugging Tips:</p>
        <ul className="text-xs text-[#014B43] space-y-1">
          <li>• Watch backend logs during grading</li>
          <li>• Look for "AUTO-GRADING UPLOAD" markers</li>
          <li>• Ensure each question exists in the DB</li>
          <li>• OCR text must not be empty before grading</li>
        </ul>
      </div>

    </div>
  );
}
