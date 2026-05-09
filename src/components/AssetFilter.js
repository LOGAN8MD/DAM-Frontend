import React, { useState } from 'react';

const AssetFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    q: '',
    fileType: '',
    startDate: '',
    endDate: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const emptyFilters = { q: '', fileType: '', startDate: '', endDate: '', tags: '' };
    setFilters(emptyFilters);
    onFilter({});
  };

  return (
    <div className="dashboard-card" style={{ marginBottom: '30px' }}>
      <h3 className="dashboard-card-title">Filter & Search Assets</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        
        <div style={{ flex: '1 1 150px' }}>
          <label className="dashboard-label">Search Name/Tag</label>
          <input 
            type="text" 
            name="q" 
            value={filters.q} 
            onChange={handleChange} 
            placeholder="Search keyword..." 
            className="dashboard-input"
          />
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <label className="dashboard-label">File Type</label>
          <select 
            name="fileType" 
            value={filters.fileType} 
            onChange={handleChange} 
            className="dashboard-input dashboard-select"
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div style={{ flex: '1 1 120px' }}>
          <label className="dashboard-label">Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange} 
            className="dashboard-input"
          />
        </div>

        <div style={{ flex: '1 1 120px' }}>
          <label className="dashboard-label">End Date</label>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange} 
            className="dashboard-input"
          />
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <label className="dashboard-label">Tags (comma separated)</label>
          <input 
            type="text" 
            name="tags" 
            value={filters.tags} 
            onChange={handleChange} 
            placeholder="e.g. holiday, work" 
            className="dashboard-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flex: '1 1 100%', marginTop: '10px' }}>
          <button type="submit" className="dashboard-btn">
            Apply Filters
          </button>
          <button type="button" onClick={handleClear} className="dashboard-btn" style={{ background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--text-main)', boxShadow: 'none' }}>
            Clear
          </button>
        </div>

      </form>
    </div>
  );
};

export default AssetFilter;
