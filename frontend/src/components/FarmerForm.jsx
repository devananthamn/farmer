import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  Calendar, 
  Droplet, 
  History, 
  FlaskConical, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles, 
  Loader2,
  Check,
  Info
} from 'lucide-react';
import { translations } from '../translations';

export default function FarmerForm({ onSubmit, loading, error, language }) {
  const t = translations[language] || translations.en;

  const [metadata, setMetadata] = useState({
    states: [],
    soil_types: [],
    seasons: [],
    water_options: [],
    previous_crops: []
  });

  const [formData, setFormData] = useState({
    state: language === 'ta' ? 'Tamil Nadu' : '',
    district: '',
    village: '',
    soil_type: '',
    season: '',
    water_availability: '',
    previous_crop: 'none',
    n: '',
    p: '',
    k: '',
    ph: ''
  });

  const [districtsList, setDistrictsList] = useState([]);
  const [showSoilHealthCard, setShowSoilHealthCard] = useState(false);
  const [formValidationWarning, setFormValidationWarning] = useState('');

  // Fetch metadata on mount
  useEffect(() => {
    fetch('/api/metadata')
      .then(res => res.json())
      .then(data => {
        setMetadata(data);
        // Default to Tamil Nadu if available
        const defaultState = language === 'ta' ? 'Tamil Nadu' : (formData.state || '');
        if (defaultState) {
          const stateObj = data.states.find(s => s.name === defaultState);
          if (stateObj) {
            setFormData(prev => ({ ...prev, state: defaultState }));
            setDistrictsList(stateObj.districts || []);
          }
        }
      })
      .catch(err => {
        console.error("Error loading metadata:", err);
      });
  }, [language]);

  // Update districts when state changes
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData(prev => ({ ...prev, state: selectedState, district: '' }));
    
    const stateObj = metadata.states.find(s => s.name === selectedState);
    if (stateObj) {
      setDistrictsList(stateObj.districts || []);
    } else {
      setDistrictsList([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formValidationWarning) setFormValidationWarning('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.state) {
      setFormValidationWarning(language === 'ta' ? "தயவுசெய்து உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்." : "Please select your State.");
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    if (!formData.soil_type) {
      setFormValidationWarning(language === 'ta' ? "தயவுசெய்து உங்கள் மண் வகையைத் தேர்ந்தெடுக்கவும்." : "Please select your Soil Type.");
      return;
    }
    if (!formData.season) {
      setFormValidationWarning(language === 'ta' ? "தயவுசெய்து சாகுபடி பருவத்தைத் தேர்ந்தெடுக்கவும்." : "Please select your Current Growing Season.");
      return;
    }
    if (!formData.water_availability) {
      setFormValidationWarning(language === 'ta' ? "தயவுசெய்து உங்கள் நீர் வசதியைத் தேர்ந்தெடுக்கவும்." : "Please select your Water Availability.");
      return;
    }

    setFormValidationWarning('');

    const payload = {
      state: formData.state,
      district: formData.district,
      village: formData.village,
      soil_type: formData.soil_type,
      season: formData.season,
      water_availability: formData.water_availability,
      previous_crop: formData.previous_crop
    };

    if (formData.n !== '') payload.n = Number(formData.n);
    if (formData.p !== '') payload.p = Number(formData.p);
    if (formData.k !== '') payload.k = Number(formData.k);
    if (formData.ph !== '') payload.ph = Number(formData.ph);

    onSubmit(payload);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      
      {/* Friendly Form Introduction */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d7e6d5',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(20, 83, 45, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          background: '#dcfce7',
          color: '#15803d',
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Info size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14532d', marginBottom: '0.25rem' }}>
            {t.formBannerTitle}
          </h2>
          <p style={{ color: '#4b6352', fontSize: '0.98rem', margin: 0 }}>
            {t.formBannerSubtitle}
          </p>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {(formValidationWarning || error) && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '14px',
          padding: '1rem 1.4rem',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.75rem',
          fontSize: '0.98rem',
          fontWeight: 600
        }}>
          <AlertCircle size={22} color="#dc2626" />
          <span>{formValidationWarning || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* SECTION 1: Location */}
        <div className="card" style={{ marginBottom: '1.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', borderBottom: '1px solid #eef5ed', paddingBottom: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14532d' }}>{t.sec1Title}</h3>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.sec1Subtitle}</span>
            </div>
          </div>

          <div className="grid-2">
            {/* State */}
            <div className="form-group">
              <label className="form-label">
                {t.stateLabel} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="form-select"
                value={formData.state}
                onChange={handleStateChange}
                required
              >
                <option value="">{t.stateSelectDefault}</option>
                {metadata.states.map(s => (
                  <option key={s.name} value={s.name}>
                    {s.name} {language === 'ta' && s.name === 'Tamil Nadu' ? '(தமிழ்நாடு)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">
                {t.districtLabel} <span className="form-label-optional">{t.recommendedTag}</span>
              </label>
              <select
                className="form-select"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                disabled={!formData.state}
              >
                <option value="">{formData.state ? t.districtSelectDefault : t.districtSelectFirst}</option>
                {districtsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Village (Optional) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              {t.villageLabel} <span className="form-label-optional">{t.optionalTag}</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t.villagePlaceholder}
              value={formData.village}
              onChange={(e) => handleInputChange('village', e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 2: Soil Type */}
        <div className="card" style={{ marginBottom: '1.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', borderBottom: '1px solid #eef5ed', paddingBottom: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14532d' }}>
                {t.sec2Title} <span style={{ color: '#dc2626' }}>*</span>
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.sec2Subtitle}</span>
            </div>
          </div>

          <div className="selection-grid" style={{ marginBottom: '1rem' }}>
            {metadata.soil_types.map(soil => {
              const isSelected = formData.soil_type === soil.id;
              const title = language === 'ta' && soil.label_ta ? soil.label_ta : soil.label_en || soil.label;
              const desc = language === 'ta' && soil.desc_ta ? soil.desc_ta : soil.desc_en || soil.description;

              return (
                <div
                  key={soil.id}
                  onClick={() => handleInputChange('soil_type', soil.id)}
                  className={`selection-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#15803d' : '#14532d', fontSize: '0.98rem' }}>
                      {title}
                    </span>
                    {isSelected && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#627c67', lineHeight: 1.4, marginTop: '0.2rem' }}>
                    {desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Growing Season */}
        <div className="card" style={{ marginBottom: '1.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', borderBottom: '1px solid #eef5ed', paddingBottom: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14532d' }}>
                {t.sec3Title} <span style={{ color: '#dc2626' }}>*</span>
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.sec3Subtitle}</span>
            </div>
          </div>

          <div className="selection-grid">
            {metadata.seasons.map(s => {
              const isSelected = formData.season === s.id;
              const title = language === 'ta' && s.label_ta ? s.label_ta : s.label_en || s.label;
              const period = language === 'ta' && s.period_ta ? s.period_ta : s.period_en || s.period;
              const desc = language === 'ta' && s.desc_ta ? s.desc_ta : s.desc_en || s.description;

              return (
                <div
                  key={s.id}
                  onClick={() => handleInputChange('season', s.id)}
                  className={`selection-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#15803d' : '#14532d', fontSize: '0.98rem' }}>
                      {title}
                    </span>
                    {isSelected && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                    {period}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#627c67', lineHeight: 1.35 }}>
                    {desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: Water Availability & Previous Crop */}
        <div className="card" style={{ marginBottom: '1.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem', borderBottom: '1px solid #eef5ed', paddingBottom: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14532d' }}>
                {t.sec4Title} <span style={{ color: '#dc2626' }}>*</span>
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.sec4Subtitle}</span>
            </div>
          </div>

          <div className="selection-grid" style={{ marginBottom: '1.75rem' }}>
            {metadata.water_options.map(w => {
              const isSelected = formData.water_availability === w.id;
              const title = language === 'ta' && w.label_ta ? w.label_ta : w.label_en || w.label;
              const desc = language === 'ta' && w.desc_ta ? w.desc_ta : w.desc_en || w.description;

              return (
                <div
                  key={w.id}
                  onClick={() => handleInputChange('water_availability', w.id)}
                  className={`selection-card ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#15803d' : '#14532d', fontSize: '0.98rem' }}>
                      {title}
                    </span>
                    {isSelected && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#627c67', lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previous Crop (Optional) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              {t.prevCropLabel} <span className="form-label-optional">{t.prevCropSubtitle}</span>
            </label>
            <select
              className="form-select"
              value={formData.previous_crop}
              onChange={(e) => handleInputChange('previous_crop', e.target.value)}
            >
              {metadata.previous_crops.map(pc => (
                <option key={pc.id} value={pc.id}>{pc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 5: Optional Soil Test Card (N, P, K, pH) */}
        <div className="card" style={{
          marginBottom: '2.5rem',
          borderRadius: '20px',
          background: showSoilHealthCard ? '#ffffff' : '#fcfdfa',
          border: showSoilHealthCard ? '2px solid #86efac' : '1px dashed #c0dbc0'
        }}>
          
          <div 
            onClick={() => setShowSoilHealthCard(!showSoilHealthCard)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FlaskConical size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>
                  {t.sec5Title} <span style={{ color: '#16a34a', fontSize: '0.88rem' }}>{t.optionalTag}</span>
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#4b6352' }}>
                  {showSoilHealthCard ? t.sec5SubtitleOpen : t.sec5SubtitleClosed}
                </span>
              </div>
            </div>

            <button
              type="button"
              style={{
                background: '#f4f8f3',
                border: '1px solid #d7e6d5',
                borderRadius: '8px',
                padding: '0.4rem 0.65rem',
                cursor: 'pointer',
                color: '#15803d'
              }}
            >
              {showSoilHealthCard ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showSoilHealthCard && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #eef5ed' }}>
              
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                fontSize: '0.88rem',
                color: '#166534',
                marginBottom: '1.5rem',
                lineHeight: 1.5
              }}>
                {t.soilTip}
              </div>

              <div className="grid-4">
                
                {/* Nitrogen (N) */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.88rem' }}>
                    {t.nLabel}
                    <span 
                      style={{ marginLeft: '4px', cursor: 'pointer', color: '#16a34a' }}
                      title={t.nDesc}
                    >
                      <HelpCircle size={14} style={{ display: 'inline' }} />
                    </span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 80"
                    value={formData.n}
                    onChange={(e) => handleInputChange('n', e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#627c67' }}>{t.kgPerHa}</span>
                </div>

                {/* Phosphorus (P) */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.88rem' }}>
                    {t.pLabel}
                    <span 
                      style={{ marginLeft: '4px', cursor: 'pointer', color: '#16a34a' }}
                      title={t.pDesc}
                    >
                      <HelpCircle size={14} style={{ display: 'inline' }} />
                    </span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 45"
                    value={formData.p}
                    onChange={(e) => handleInputChange('p', e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#627c67' }}>{t.kgPerHa}</span>
                </div>

                {/* Potassium (K) */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.88rem' }}>
                    {t.kLabel}
                    <span 
                      style={{ marginLeft: '4px', cursor: 'pointer', color: '#16a34a' }}
                      title={t.kDesc}
                    >
                      <HelpCircle size={14} style={{ display: 'inline' }} />
                    </span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 40"
                    value={formData.k}
                    onChange={(e) => handleInputChange('k', e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#627c67' }}>{t.kgPerHa}</span>
                </div>

                {/* pH */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.88rem' }}>
                    {t.phLabel}
                    <span 
                      style={{ marginLeft: '4px', cursor: 'pointer', color: '#16a34a' }}
                      title={t.phDesc}
                    >
                      <HelpCircle size={14} style={{ display: 'inline' }} />
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="e.g. 6.8"
                    value={formData.ph}
                    onChange={(e) => handleInputChange('ph', e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#627c67' }}>{t.phScale}</span>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-pulse"
            style={{
              padding: '1.15rem 3.5rem',
              fontSize: '1.25rem',
              fontWeight: 800,
              width: '100%',
              maxWidth: '460px',
              borderRadius: '9999px',
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>{t.submitBtnLoading}</span>
              </>
            ) : (
              <>
                <Sparkles size={24} />
                <span>{t.submitBtnIdle}</span>
              </>
            )}
          </button>
          <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#627c67' }}>
            {t.submitNote}
          </div>
        </div>

      </form>
    </div>
  );
}
