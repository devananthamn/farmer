import React from 'react';
import { ClipboardList, Cpu, Award, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

export default function HowItWorks({ onGetStarted, language }) {
  const t = translations[language] || translations.en;

  const steps = [
    {
      number: t.step1Number,
      title: t.step1Title,
      subtitle: t.step1Subtitle,
      description: t.step1Desc,
      icon: <ClipboardList size={32} color="#15803d" />,
      color: "#dcfce7"
    },
    {
      number: t.step2Number,
      title: t.step2Title,
      subtitle: t.step2Subtitle,
      description: t.step2Desc,
      icon: <Cpu size={32} color="#15803d" />,
      color: "#eaf5e9"
    },
    {
      number: t.step3Number,
      title: t.step3Title,
      subtitle: t.step3Subtitle,
      description: t.step3Desc,
      icon: <Award size={32} color="#15803d" />,
      color: "#fef3c7"
    }
  ];

  return (
    <section style={{ padding: '4.5rem 0', background: '#ffffff', borderBottom: '1px solid #d7e6d5' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
          <div className="badge badge-green" style={{ marginBottom: '0.85rem' }}>
            {t.howItWorksBadge}
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f3d1f', marginBottom: '0.75rem' }}>
            {t.howItWorksTitle}
          </h2>
          <p style={{ color: '#4b6352', fontSize: '1.05rem', lineHeight: 1.5 }}>
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid-3" style={{ position: 'relative' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="card card-hover"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2.2rem 1.8rem',
                backgroundColor: '#fbfdfa',
                borderRadius: '20px'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#d1e5ce',
                fontFamily: 'var(--font-heading)'
              }}>
                {step.number}
              </div>

              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {step.icon}
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  {step.subtitle}
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#14532d', marginBottom: '0.85rem' }}>
                  {step.title}
                </h3>

                <p style={{ color: '#3e5a43', fontSize: '0.98rem', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>

              <div style={{
                marginTop: '1.8rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5efe3',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#15803d'
              }}>
                <span>{t.stepOf} {idx + 1} {t.of3}</span>
                <ArrowRight size={16} />
              </div>

            </div>
          ))}
        </div>

        {/* Callout Box */}
        <div style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 16px 32px -6px rgba(20, 83, 45, 0.25)'
        }}>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ffffff' }}>
              {t.readyBannerTitle}
            </h4>
            <p style={{ color: '#bbf7d0', fontSize: '1.05rem', maxWidth: '600px' }}>
              {t.readyBannerSubtitle}
            </p>
          </div>
          <button 
            onClick={onGetStarted}
            className="btn btn-secondary"
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              color: '#14532d',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
          >
            <span>{t.readyBannerBtn}</span>
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}
