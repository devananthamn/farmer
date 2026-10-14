import React from 'react';
import { Sprout, PhoneCall, Sparkles, Languages } from 'lucide-react';
import { translations } from '../translations';

export default function Navbar({ onStartRecommendation, currentView, language, setLanguage }) {
  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#d7e6d5] shadow-xs">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onStartRecommendation('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)'
          }}>
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-font" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14532d', lineHeight: 1.15 }}>
              {t.brandTitle} <span style={{ color: '#16a34a' }}>{t.brandSubtitle}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4b6352', fontWeight: 600 }}>
              {t.brandTagline}
            </div>
          </div>
        </div>

        {/* Quick Actions & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Language Toggle: English | தமிழ் */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f4f8f3',
            border: '1.5px solid #d7e6d5',
            borderRadius: '9999px',
            padding: '2px',
            gap: '2px'
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: language === 'en' ? '#15803d' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#3e5a43',
                transition: 'all 0.2s ease'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: language === 'ta' ? '#15803d' : 'transparent',
                color: language === 'ta' ? '#ffffff' : '#3e5a43',
                transition: 'all 0.2s ease'
              }}
            >
              தமிழ்
            </button>
          </div>

          {/* Kisan Helpline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#f4f8f3',
            border: '1px solid #d7e6d5',
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: '#166534',
            fontWeight: 600
          }}>
            <PhoneCall size={16} color="#16a34a" />
            <span style={{ display: 'inline-block' }}>
              <span style={{ fontSize: '0.72rem', color: '#627c67', display: 'block', lineHeight: 1 }}>{t.kisanHelpline}</span>
              1800-180-1551
            </span>
          </div>

          {/* Action Button */}
          {currentView !== 'form' && (
            <button 
              onClick={() => onStartRecommendation('form')}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.92rem' }}
            >
              <Sparkles size={17} />
              <span>{t.findSuitableCropBtn}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
