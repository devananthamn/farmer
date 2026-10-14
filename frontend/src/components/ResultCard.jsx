import React from 'react';
import { 
  Award, 
  RotateCcw, 
  Layers, 
  Calendar, 
  Droplet, 
  Info, 
  Printer, 
  Sparkles, 
  Sprout, 
  CheckCircle2
} from 'lucide-react';
import { translations } from '../translations';

export default function ResultCard({ result, onTryAgain, language }) {
  if (!result || !result.best_crop) return null;

  const t = translations[language] || translations.en;
  const { best_crop, mode, farmer_inputs } = result;

  const handlePrint = () => {
    window.print();
  };

  const cropTitle = language === 'ta' && best_crop.name_ta 
    ? `${best_crop.name_ta} (${best_crop.name_en || best_crop.id})`
    : best_crop.name;

  const whySuitableText = language === 'ta' && best_crop.why_suitable_ta 
    ? best_crop.why_suitable_ta 
    : best_crop.why_suitable_en || best_crop.why_suitable;

  const soilSuitabilityText = language === 'ta' && best_crop.soil_suitability_ta
    ? best_crop.soil_suitability_ta
    : best_crop.soil_suitability_en || best_crop.soil_suitability;

  const seasonSuitabilityText = language === 'ta' && best_crop.season_suitability_ta
    ? best_crop.season_suitability_ta
    : best_crop.season_suitability_en || best_crop.season_suitability;

  const waterReqText = language === 'ta' && best_crop.water_requirement_ta
    ? best_crop.water_requirement_ta
    : best_crop.water_requirement_en || best_crop.water_requirement;

  const assumptionsText = language === 'ta' && best_crop.assumptions_and_notes_ta
    ? best_crop.assumptions_and_notes_ta
    : best_crop.assumptions_and_notes_en || best_crop.assumptions_and_notes;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      
      {/* Top Navigation & Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        
        {/* Mode & Match Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.45rem 1rem' }}>
            <Award size={18} />
            <span>{t.bestMatchBadge}</span>
          </div>

          <div style={{
            background: mode === 'ml_with_soil_test' ? '#e0f2fe' : '#fef3c7',
            color: mode === 'ml_with_soil_test' ? '#0369a1' : '#92400e',
            border: `1px solid ${mode === 'ml_with_soil_test' ? '#bae6fd' : '#fde68a'}`,
            borderRadius: '9999px',
            padding: '0.45rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            {mode === 'ml_with_soil_test' ? `🧪 ${t.modeMlBadge}` : `🌾 ${t.modeAgroBadge}`}
          </div>
        </div>

        {/* Action Buttons: Try Again & Print */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.92rem' }}
          >
            <Printer size={16} />
            <span>{t.printReport}</span>
          </button>

          <button
            onClick={onTryAgain}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.3rem', fontSize: '0.95rem' }}
          >
            <RotateCcw size={16} />
            <span>{t.tryAgainBtn}</span>
          </button>
        </div>

      </div>

      {/* Main Prominent Recommendation Hero Card */}
      <div className="card" style={{
        background: '#ffffff',
        border: '2px solid #86efac',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px -10px rgba(20, 83, 45, 0.12)',
        marginBottom: '2.5rem'
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) 1fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          {/* Crop Image & Visual Frame */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(20, 83, 45, 0.18)',
              border: '4px solid #ffffff',
              aspectRatio: '4/3',
              background: '#eaf5e9'
            }}>
              <img
                src={best_crop.image}
                alt={cropTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/crops/rice.jpg';
                }}
              />
            </div>

            {/* Match Score Badge Floating on Image */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(21, 128, 61, 0.95)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <Sparkles size={16} />
              <span>{best_crop.match_score}% {t.highMatch}</span>
            </div>
          </div>

          {/* Crop Details & Why Suitable */}
          <div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
                {best_crop.category}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#627c67', fontWeight: 600 }}>
                {t.idealFor} {farmer_inputs?.state}
              </span>
            </div>

            {/* Crop Name */}
            <h1 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: '#0f3d1f',
              lineHeight: 1.2,
              marginBottom: '1rem'
            }}>
              {cropTitle}
            </h1>

            {/* Why This Crop is Recommended Highlight Box */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '16px',
              padding: '1.25rem 1.4rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#15803d',
                marginBottom: '0.4rem'
              }}>
                <CheckCircle2 size={20} />
                <span>{t.whyRecommendedTitle}</span>
              </div>
              <p style={{ color: '#166534', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
                {whySuitableText}
              </p>
            </div>

            {/* Quick Summary Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}>
              <span style={{ background: '#f4f8f3', padding: '0.35rem 0.75rem', borderRadius: '8px', color: '#166534', border: '1px solid #d7e6d5' }}>
                📍 {farmer_inputs?.state} {farmer_inputs?.district ? `(${farmer_inputs.district})` : ''}
              </span>
              <span style={{ background: '#f4f8f3', padding: '0.35rem 0.75rem', borderRadius: '8px', color: '#166534', border: '1px solid #d7e6d5' }}>
                🌱 {farmer_inputs?.soil_type?.toUpperCase()}
              </span>
              <span style={{ background: '#f4f8f3', padding: '0.35rem 0.75rem', borderRadius: '8px', color: '#166534', border: '1px solid #d7e6d5' }}>
                ☀️ {farmer_inputs?.season?.toUpperCase()}
              </span>
              <span style={{ background: '#f4f8f3', padding: '0.35rem 0.75rem', borderRadius: '8px', color: '#166534', border: '1px solid #d7e6d5' }}>
                💧 {farmer_inputs?.water_availability?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 4 Detailed Suitability Factors Grid */}
      <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#14532d', marginBottom: '1.25rem' }}>
        {t.breakdownTitle}
      </h3>

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        
        {/* Factor 1: Soil Suitability */}
        <div className="card" style={{ borderRadius: '18px', padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>{t.soilSuitTitle}</h4>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.soilSuitSub}</span>
            </div>
          </div>
          <p style={{ color: '#3e5a43', fontSize: '0.96rem', lineHeight: 1.6 }}>
            {soilSuitabilityText}
          </p>
        </div>

        {/* Factor 2: Season Suitability */}
        <div className="card" style={{ borderRadius: '18px', padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>{t.seasonSuitTitle}</h4>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.seasonSuitSub}</span>
            </div>
          </div>
          <p style={{ color: '#3e5a43', fontSize: '0.96rem', lineHeight: 1.6 }}>
            {seasonSuitabilityText}
          </p>
        </div>

        {/* Factor 3: Water Requirement */}
        <div className="card" style={{ borderRadius: '18px', padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplet size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>{t.waterReqTitle}</h4>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.waterReqSub}</span>
            </div>
          </div>
          <p style={{ color: '#3e5a43', fontSize: '0.96rem', lineHeight: 1.6 }}>
            {waterReqText}
          </p>
        </div>

        {/* Factor 4: Assumptions & Important Notes */}
        <div className="card" style={{ borderRadius: '18px', padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Info size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#14532d' }}>{t.assumptionsTitle}</h4>
              <span style={{ fontSize: '0.82rem', color: '#627c67' }}>{t.assumptionsSub}</span>
            </div>
          </div>
          <p style={{ color: '#3e5a43', fontSize: '0.96rem', lineHeight: 1.6 }}>
            {assumptionsText}
          </p>
        </div>

      </div>

      {/* Rotation Synergy Card if Available */}
      {best_crop.rotation_advice && (
        <div style={{
          background: '#fbfdfa',
          border: '1.5px solid #d7e6d5',
          borderRadius: '16px',
          padding: '1.25rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <Sprout size={24} color="#15803d" />
          <div style={{ fontSize: '0.96rem', color: '#166534' }}>
            <strong>{t.rotationAdviceTitle}</strong> {language === 'ta' && best_crop.rotation_advice_ta ? best_crop.rotation_advice_ta : best_crop.rotation_advice}
          </div>
        </div>
      )}

      {/* Bottom Try Again Bar */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={onTryAgain}
          className="btn btn-primary btn-pulse"
          style={{
            padding: '1rem 3rem',
            fontSize: '1.15rem',
            fontWeight: 700,
            borderRadius: '9999px'
          }}
        >
          <RotateCcw size={20} />
          <span>{t.tryAnotherPlot}</span>
        </button>
      </div>

    </div>
  );
}
