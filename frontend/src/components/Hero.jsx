import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

export default function Hero({ onFindCropClick, language }) {
  const t = translations[language] || translations.en;

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '4.5rem 0 3.5rem',
      background: 'linear-gradient(180deg, #eef7ec 0%, #f7faf5 100%)',
      borderBottom: '1px solid #d7e6d5'
    }}>
      {/* Background agricultural overlay pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.12,
        backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Nature Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#ffffff',
            border: '1.5px solid #bbf7d0',
            color: '#15803d',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.1)'
          }}>
            <Sparkles size={18} color="#16a34a" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#0f3d1f',
            lineHeight: 1.18,
            marginBottom: '1.25rem'
          }}>
            {t.heroTitlePrefix}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t.heroTitleHighlight}
            </span>{' '}
            {t.heroTitleSuffix}
          </h1>

          {/* Short Introduction */}
          <p style={{
            fontSize: '1.15rem',
            color: '#3e5a43',
            lineHeight: 1.6,
            marginBottom: '2.25rem',
            maxWidth: '720px',
            margin: '0 auto 2.25rem'
          }}>
            {t.heroDescription}
          </p>

          {/* Prominent Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={onFindCropClick}
              className="btn btn-primary btn-pulse"
              style={{
                fontSize: '1.2rem',
                padding: '1.05rem 2.4rem',
                borderRadius: '9999px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={22} />
              <span>{t.heroActionBtn}</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Trust Highlights */}
          <div style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.8rem',
            flexWrap: 'wrap',
            padding: '1.1rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            border: '1px solid #d7e6d5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', color: '#166534', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <span>{t.badgeFree}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', color: '#166534', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <span>{t.badgeNoLab}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', color: '#166534', fontWeight: 600 }}>
              <ShieldCheck size={18} color="#16a34a" />
              <span>{t.badgeStateSpecific}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
