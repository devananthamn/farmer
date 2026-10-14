import React from 'react';
import { Sparkles, Droplets, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

export default function AlternativeCrops({ alternatives, onSelectAlternative, language }) {
  if (!alternatives || alternatives.length === 0) return null;

  const t = translations[language] || translations.en;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto 3rem' }}>
      
      {/* Section Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>{t.altSectionTitle}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
              {alternatives.length} {t.altChoicesTag}
            </span>
          </h3>
          <p style={{ color: '#4b6352', fontSize: '0.92rem', margin: 0 }}>
            {t.altSubtitle}
          </p>
        </div>
      </div>

      {/* Alternatives Grid (up to 3) */}
      <div className="grid-3">
        {alternatives.slice(0, 3).map((crop) => {
          const cropTitle = language === 'ta' && crop.name_ta 
            ? `${crop.name_ta} (${crop.name_en || crop.id})`
            : crop.name;

          return (
            <div
              key={crop.id}
              className="card card-hover"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                border: '1.5px solid #d7e6d5'
              }}
            >
              {/* Crop Image */}
              <div style={{ position: 'relative', height: '175px', background: '#f4f8f3' }}>
                <img
                  src={crop.image}
                  alt={cropTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/crops/rice.jpg';
                  }}
                />
                
                {/* Match Score Floating Badge */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(21, 128, 61, 0.92)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Sparkles size={13} />
                  <span>{crop.match_score}% {t.highMatch}</span>
                </div>

                {/* Category Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#14532d',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px'
                }}>
                  {crop.category}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14532d', marginBottom: '0.45rem' }}>
                    {cropTitle}
                  </h4>

                  <p style={{ color: '#4b6352', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {language === 'ta' && crop.why_suitable_ta ? crop.why_suitable_ta : crop.description}
                  </p>
                </div>

                {/* Water Requirement & Button */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    color: '#0369a1',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontWeight: 600
                  }}>
                    <Droplets size={14} />
                    <span>{crop.water_level} {t.altWaterReq}</span>
                  </div>

                  {onSelectAlternative && (
                    <button
                      onClick={() => onSelectAlternative(crop)}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        padding: '0.55rem 1rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                        justifyContent: 'center'
                      }}
                    >
                      <span>{t.viewDetailsBtn}</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
