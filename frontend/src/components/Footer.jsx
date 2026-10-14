import React from 'react';
import { Sprout, PhoneCall, BookOpen } from 'lucide-react';
import { translations } from '../translations';

export default function Footer({ language }) {
  const t = translations[language] || translations.en;

  return (
    <footer style={{
      background: '#0f3d1f',
      color: '#d1e5ce',
      borderTop: '3px solid #16a34a',
      padding: '3.5rem 0 2rem'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Col 1: System info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                background: '#16a34a',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sprout size={22} />
              </div>
              <span className="brand-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                {t.brandTitle} {t.brandSubtitle}
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#a3c2a0' }}>
              {t.footerDesc}
            </p>
          </div>

          {/* Col 2: Dataset & Machine Learning Documentation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
              <BookOpen size={18} color="#22c55e" />
              <span>{t.footerDatasetTitle}</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#a3c2a0' }}>
              {t.footerDatasetText}
            </p>
          </div>

          {/* Col 3: Government Farmer Helplines */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
              <PhoneCall size={18} color="#22c55e" />
              <span>{t.footerHelplineTitle}</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#a3c2a0', lineHeight: 1.7 }}>
              <div><strong>{t.kisanCallCentre}</strong> <span style={{ color: '#86efac' }}>1800-180-1551</span> {t.tollFreeTime}</div>
              <div><strong>{t.soilHealthPortal}</strong> <span style={{ color: '#86efac' }}>soilhealth.dac.gov.in</span></div>
              <div><strong>{t.kvkDir}</strong> <span style={{ color: '#86efac' }}>kvk.icar.gov.in</span></div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div style={{
          borderTop: '1px solid #1c522f',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#84a880'
        }}>
          <div>
            {t.footerCopyright}
          </div>
          <div>
            {t.footerDisclaimer}
          </div>
        </div>

      </div>
    </footer>
  );
}
