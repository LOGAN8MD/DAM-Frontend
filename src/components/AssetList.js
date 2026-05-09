import React, { useState, useEffect } from 'react';
import assetService from '../services/assetService';
import AssetFilter from './AssetFilter';

const AssetList = ({ refreshTrigger }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch assets on component mount or when refreshTrigger changes
  useEffect(() => {
    fetchAssets();
  }, [refreshTrigger]);

  const fetchAssets = async (filters = {}) => {
    try {
      setLoading(true);
      const responseData = await assetService.searchAssets(filters);
      setAssets(responseData.assets || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets. Please ensure the server is running.');
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading assets...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ margin: '0 auto' }}>
      <AssetFilter onFilter={fetchAssets} />

      {assets.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No assets uploaded yet.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {assets.map((asset) => (
            <div key={asset._id} className="asset-item">
              <h4 className="asset-item-title" title={asset.originalName}>
                {asset.originalName.length > 25 ? `${asset.originalName.substring(0, 25)}...` : asset.originalName}
              </h4>

              {/* Show image preview if the file is an image */}
              {asset.fileType.startsWith('image/') && (
                <div style={{ marginBottom: '15px', textAlign: 'center', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <img 
                    src={asset.fileUrl} 
                    alt={asset.originalName} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
              
              <p className="asset-item-meta">
                <strong>Type:</strong> {asset.fileType.split('/')[1] || asset.fileType}
              </p>
              
              <p className="asset-item-meta">
                <strong>Size:</strong> {(asset.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
              
              <p className="asset-item-meta" style={{ fontSize: '12px' }}>
                {new Date(asset.uploadDate).toLocaleString()}
              </p>

              {/* Render tags if they exist */}
              {asset.tags && asset.tags.length > 0 && (
                <div className="asset-item-tags">
                  {asset.tags.map((tag, idx) => (
                    <span key={idx} className="dashboard-tag">{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: asset.tags && asset.tags.length > 0 ? '0' : 'auto', paddingTop: '15px' }}>
                <a 
                  href={asset.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="dashboard-btn dashboard-btn-info"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                >
                  View
                </a>
                <a 
                  href={assetService.getDownloadUrl(asset.filename)}
                  className="dashboard-btn dashboard-btn-success"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetList;
