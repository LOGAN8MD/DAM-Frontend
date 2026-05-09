import React, { useState, useRef } from 'react';
import assetService from '../services/assetService';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [uploadedAsset, setUploadedAsset] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTags('');
    setProgress(0);
    setMessage('');
    setStatus('idle');
    setUploadedAsset(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (tags) {
      formData.append('tags', tags);
    }

    setStatus('uploading');

    try {
      const responseData = await assetService.uploadAsset(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      setStatus('success');
      setMessage(responseData.message || 'File uploaded successfully!');
      setUploadedAsset(responseData.asset);
      setFile(null);
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setProgress(0);
      setMessage(
        error.response?.data?.message || 'There was a problem uploading the file.'
      );
    }
  };

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-card-title">Upload Digital Asset</h2>
      
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: '15px' }}>
          <label className="custom-file-upload">
            <span className="custom-file-upload-btn">
              {file ? file.name : "Click here to browse files"}
            </span>
            <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className="dashboard-label">Asset Tags</label>
          <input 
            type="text" 
            className="dashboard-input"
            placeholder="e.g. holiday, work" 
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!file || status === 'uploading'}
          className="dashboard-btn"
        >
          {status === 'uploading' ? 'Uploading...' : 'Upload File'}
        </button>
      </form>

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Status Messages */}
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: status === 'success' ? 'rgba(0, 242, 195, 0.1)' : 'rgba(253, 93, 147, 0.1)',
          color: status === 'success' ? 'var(--success)' : 'var(--danger)',
          borderLeft: `4px solid ${status === 'success' ? 'var(--success)' : 'var(--danger)'}`
        }}>
          {message}
        </div>
      )}

      {/* Uploaded Asset Details */}
      {uploadedAsset && (
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 0 }}>Recently Uploaded:</h3>
          <div className="asset-item" style={{ border: 'none', background: 'transparent', padding: 0 }}>
            <h4 className="asset-item-title">{uploadedAsset.originalName}</h4>
            <p className="asset-item-meta">{uploadedAsset.fileType}</p>
            <a 
              href={uploadedAsset.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="dashboard-btn dashboard-btn-info"
              style={{ marginTop: '10px', display: 'inline-block', width: 'fit-content' }}
            >
              View File
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
