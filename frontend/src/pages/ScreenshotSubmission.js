import React, { useState } from 'react';
import { screenshotService } from '../services/api';
import './ScreenshotSubmission.css';

function ScreenshotSubmission() {
  const [formData, setFormData] = useState({
    imageUrl: '',
    description: '',
    kills: '',
    headshots: '',
    damageDealt: '',
    survival: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await screenshotService.submit(formData);
      setMessage('Screenshot submitted successfully! It will appear on dashboard after admin approval.');
      setFormData({
        imageUrl: '',
        description: '',
        kills: '',
        headshots: '',
        damageDealt: '',
        survival: ''
      });
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting screenshot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screenshot-submission">
      <div className="container">
        <div className="submission-card">
          <h1>📸 Submit Screenshot</h1>
          <p className="subtitle">Share your gameplay performance with the guild</p>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="submission-form">
            <div className="form-group">
              <label>Screenshot Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {formData.imageUrl && (
                <div className="image-preview">
                  <img src={formData.imageUrl} alt="preview" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kills</label>
                <input
                  type="number"
                  name="kills"
                  value={formData.kills}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Headshots</label>
                <input
                  type="number"
                  name="headshots"
                  value={formData.headshots}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Damage Dealt</label>
                <input
                  type="number"
                  name="damageDealt"
                  value={formData.damageDealt}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Survival Time</label>
                <input
                  type="text"
                  name="survival"
                  placeholder="e.g., 15:30"
                  value={formData.survival}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell the guild about this gameplay..."
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit Screenshot'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScreenshotSubmission;
