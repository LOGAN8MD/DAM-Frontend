import React, { useState, useEffect } from 'react';
import assetService from '../services/assetService';
import AssetFilter from './AssetFilter';

const AssetList = ({ refreshTrigger }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assetToDelete, setAssetToDelete] = useState(null);

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

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    try {
      await assetService.deleteAsset(assetToDelete._id);
      setAssets(assets.filter(asset => asset._id !== assetToDelete._id));
      setAssetToDelete(null);
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Failed to delete asset. Please try again.');
    }
  };

  const cancelDelete = () => {
    setAssetToDelete(null);
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
                <button 
                  onClick={() => setAssetToDelete(asset)}
                  className="dashboard-btn dashboard-btn-danger"
                  style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'var(--gradient-danger)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {assetToDelete && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to completely delete <strong>"{assetToDelete.originalName}"</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={cancelDelete} 
                className="dashboard-btn" 
                style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', boxShadow: 'none' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="dashboard-btn dashboard-btn-danger"
                style={{ background: 'var(--gradient-danger)' }}
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssetList;
