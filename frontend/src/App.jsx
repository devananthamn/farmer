import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FarmerForm from './components/FarmerForm';
import ResultCard from './components/ResultCard';
import AlternativeCrops from './components/AlternativeCrops';
import Footer from './components/Footer';
import { translations } from './translations';
import { X, ArrowLeft, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'form' | 'results'
  const [language, setLanguage] = useState('en'); // 'en' | 'ta'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [selectedCropModal, setSelectedCropModal] = useState(null);

  const t = translations[language] || translations.en;

  const handleStartRecommendation = (view = 'form') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (payload) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate recommendation. Please check your inputs.');
      }

      setRecommendationResult(data);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || 'Network error occurred. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header with Language Toggle */}
      <Navbar 
        onStartRecommendation={handleStartRecommendation} 
        currentView={currentView}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Body Content based on currentView */}
      <main style={{ flex: 1 }}>
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="animate-fade-in">
            <Hero 
              onFindCropClick={() => handleStartRecommendation('form')} 
              language={language}
            />
            <HowItWorks 
              onGetStarted={() => handleStartRecommendation('form')} 
              language={language}
            />
          </div>
        )}

        {/* VIEW 2: FARMER INFORMATION FORM */}
        {currentView === 'form' && (
          <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
            
            {/* Breadcrumb / Back button */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => handleStartRecommendation('home')}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
              >
                <ArrowLeft size={16} />
                <span>{t.backToHome}</span>
              </button>

              <div style={{ fontSize: '0.88rem', color: '#627c67', fontWeight: 600 }}>
                {t.stepEntry}
              </div>
            </div>

            <FarmerForm 
              onSubmit={handleFormSubmit}
              loading={loading}
              error={error}
              language={language}
            />
          </div>
        )}

        {/* VIEW 3: RECOMMENDATION RESULTS */}
        {currentView === 'results' && recommendationResult && (
          <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
            
            {/* Breadcrumb Navigation */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handleTryAgain}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} />
                <span>{t.adjustParams}</span>
              </button>

              <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 700 }}>
                {t.recommendationComplete}
              </div>
            </div>

            {/* Best Recommended Crop Card */}
            <ResultCard 
              result={recommendationResult}
              onTryAgain={handleTryAgain}
              language={language}
            />

            {/* Alternative Crops (Up to 3) */}
            <AlternativeCrops 
              alternatives={recommendationResult.alternative_crops}
              onSelectAlternative={(crop) => setSelectedCropModal(crop)}
              language={language}
            />

          </div>
        )}

      </main>

      {/* Alternative Crop Details Modal */}
      {selectedCropModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 61, 31, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div 
            className="animate-fade-in card"
            style={{
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              background: '#ffffff'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCropModal(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f4f8f3',
                border: '1px solid #d7e6d5',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#15803d'
              }}
            >
              <X size={20} />
            </button>

            {/* Crop Photo */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', marginBottom: '1.25rem' }}>
              <img
                src={selectedCropModal.image}
                alt={selectedCropModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              {selectedCropModal.category} • {selectedCropModal.match_score}% {t.highMatch}
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532d', marginBottom: '0.75rem' }}>
              {language === 'ta' && selectedCropModal.name_ta 
                ? `${selectedCropModal.name_ta} (${selectedCropModal.name_en || selectedCropModal.id})`
                : selectedCropModal.name}
            </h3>

            <p style={{ color: '#3e5a43', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {language === 'ta' && selectedCropModal.why_suitable_ta 
                ? selectedCropModal.why_suitable_ta 
                : selectedCropModal.why_suitable_en || selectedCropModal.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              
              <div style={{ background: '#f4f8f3', padding: '0.85rem 1.1rem', borderRadius: '12px' }}>
                <strong style={{ color: '#14532d' }}>🌿 {t.modalSoil}</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#4b6352', fontSize: '0.92rem' }}>
                  {language === 'ta' && selectedCropModal.soil_suitability_ta 
                    ? selectedCropModal.soil_suitability_ta 
                    : selectedCropModal.soil_suitability_en || selectedCropModal.soil_suitability}
                </p>
              </div>

              <div style={{ background: '#f4f8f3', padding: '0.85rem 1.1rem', borderRadius: '12px' }}>
                <strong style={{ color: '#14532d' }}>☀️ {t.modalSeason}</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#4b6352', fontSize: '0.92rem' }}>
                  {language === 'ta' && selectedCropModal.season_suitability_ta 
                    ? selectedCropModal.season_suitability_ta 
                    : selectedCropModal.season_suitability_en || selectedCropModal.season_suitability}
                </p>
              </div>

              <div style={{ background: '#f4f8f3', padding: '0.85rem 1.1rem', borderRadius: '12px' }}>
                <strong style={{ color: '#14532d' }}>💧 {t.modalWater}</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#4b6352', fontSize: '0.92rem' }}>
                  {language === 'ta' && selectedCropModal.water_requirement_ta 
                    ? selectedCropModal.water_requirement_ta 
                    : selectedCropModal.water_requirement_en || selectedCropModal.water_requirement}
                </p>
              </div>

            </div>

            <button
              onClick={() => setSelectedCropModal(null)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
            >
              {t.closeDetailsBtn}
            </button>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer language={language} />

    </div>
  );
}
