import React, { useState, useEffect, useRef } from 'react';
import assetService from '../services/assetService';

const AssetFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    q: '',
    fileType: '',
    startDate: '',
    endDate: '',
    tags: ''
  });

  const [availableNames, setAvailableNames] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [showQSuggestions, setShowQSuggestions] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const qRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await assetService.searchAssets({});
        const assets = response.assets || [];
        const names = [...new Set(assets.map(a => a.originalName))];
        
        let tags = [];
        assets.forEach(a => {
          if (a.tags && Array.isArray(a.tags)) {
            tags = [...tags, ...a.tags];
          }
        });
        const uniqueTags = [...new Set(tags)];
        
        setAvailableNames(names);
        setAvailableTags(uniqueTags);
      } catch (err) {
        console.error("Could not load autocomplete data");
      }
    };
    fetchMetadata();
    
    const handleClickOutside = (event) => {
      if (qRef.current && !qRef.current.contains(event.target)) setShowQSuggestions(false);
      if (tagRef.current && !tagRef.current.contains(event.target)) setShowTagSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    if (e.target.name === 'q') setShowQSuggestions(true);
    if (e.target.name === 'tags') setShowTagSuggestions(true);
  };

  const handleSelectQ = (value) => {
    setFilters({ ...filters, q: value });
    setShowQSuggestions(false);
  };

  const handleSelectTag = (tag) => {
    const currentTags = filters.tags.split(',').map(t => t.trim());
    currentTags.pop();
    if (currentTags.length > 0) {
      setFilters({ ...filters, tags: currentTags.join(', ') + ', ' + tag + ', ' });
    } else {
      setFilters({ ...filters, tags: tag + ', ' });
    }
    setShowTagSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowQSuggestions(false);
    setShowTagSuggestions(false);
    onFilter(filters);
  };

  const handleClear = () => {
    const emptyFilters = { q: '', fileType: '', startDate: '', endDate: '', tags: '' };
    setFilters(emptyFilters);
    onFilter({});
  };

  const qSuggestions = filters.q 
    ? [...new Set([...availableNames, ...availableTags])].filter(item => item.toLowerCase().includes(filters.q.toLowerCase()) && item.toLowerCase() !== filters.q.toLowerCase()).slice(0, 8)
    : [];

  const currentTagSearch = filters.tags.split(',').pop().trim().toLowerCase();
  const tagSuggestions = currentTagSearch 
    ? availableTags.filter(tag => tag.toLowerCase().includes(currentTagSearch) && tag.toLowerCase() !== currentTagSearch).slice(0, 8)
    : [];

  return (
    <div className="dashboard-card" style={{ marginBottom: '30px' }}>
      <h3 className="dashboard-card-title">Filter & Search Assets</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        
        <div style={{ flex: '1 1 150px', position: 'relative' }} ref={qRef}>
          <label className="dashboard-label">Search Name/Tag</label>
          <input 
            type="text" 
            name="q" 
            value={filters.q} 
            onChange={handleChange} 
            onFocus={() => setShowQSuggestions(true)}
            placeholder="Search keyword..." 
            className="dashboard-input"
            autoComplete="off"
          />
          {showQSuggestions && qSuggestions.length > 0 && (
            <ul className="dashboard-dropdown">
              {qSuggestions.map((suggestion, idx) => (
                <li key={idx} onClick={() => handleSelectQ(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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

        <div style={{ flex: '1 1 150px', position: 'relative' }} ref={tagRef}>
          <label className="dashboard-label">Tags (comma separated)</label>
          <input 
            type="text" 
            name="tags" 
            value={filters.tags} 
            onChange={handleChange} 
            onFocus={() => setShowTagSuggestions(true)}
            placeholder="e.g. holiday, work" 
            className="dashboard-input"
            autoComplete="off"
          />
          {showTagSuggestions && tagSuggestions.length > 0 && (
            <ul className="dashboard-dropdown">
              {tagSuggestions.map((suggestion, idx) => (
                <li key={idx} onClick={() => handleSelectTag(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
