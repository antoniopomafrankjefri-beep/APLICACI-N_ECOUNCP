import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import categoriesData from './data/categories.json';
import itemsData from './data/items.json';
import pointsData from './data/points.json';

import { WasteItem, Category, DisposalPoint } from './types';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WasteClassifier } from './components/Classifier/WasteClassifier';
import { WasteDetail } from './components/Classifier/WasteDetail';
import { CampusMap } from './components/Map/CampusMap';
import { EnhancedNearestPointBanner } from './components/Recommendation/EnhancedNearestPointBanner';
import { EducationGuide } from './components/Education/EducationGuide';
import { SurveyExportModal } from './components/FieldSurvey/SurveyExportModal';
import { BottomNav, ActiveTab } from './components/Navigation/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGeolocation } from './hooks/useGeolocation';
import { useI18n } from './hooks/useI18n';
import { haversineDistance } from './utils/distance';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { TopControls } from './components/TopControls';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  // Language and translations
  const { language, setLanguage, t } = useI18n();

  // User geolocation
  const {
    coords: userCoords,
    gpsStatus,
    requestGps,
    setManualReference,
  } = useGeolocation();

  // Typed data from JSON
  const categories: Category[] = categoriesData as Category[];
  const items: WasteItem[] = itemsData as WasteItem[];
  const points: DisposalPoint[] = pointsData as DisposalPoint[];

  // Welcome screen state
  const [showWelcome, setShowWelcome] = useState(true);

  // Navigation and filtering state
  const [activeTab, setActiveTab] = useState<ActiveTab>('classifier');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // PWA Install state
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Handle PWA install click
  const handleInstallClick = useCallback(async () => {
    await install();
  }, [install]);

  // Check if welcome screen was already shown
  useEffect(() => {
    try {
      const hasSeenWelcome = sessionStorage.getItem('ecouncp_welcome_shown');
      if (hasSeenWelcome) {
        setShowWelcome(false);
      }
    } catch (error) {
      console.warn('No se pudo consultar sessionStorage:', error);
    }
  }, []);

  // Complete the welcome screen
  const handleWelcomeComplete = useCallback(() => {
    try {
      sessionStorage.setItem('ecouncp_welcome_shown', 'true');
    } catch (error) {
      console.warn('No se pudo guardar el estado de bienvenida:', error);
    }
    setShowWelcome(false);
  }, []);

  // Transition from classifier to map filtered by category
  const handleFindOnMap = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      setActiveTab('map');
    },
    []
  );

  // Filter disposal points by selected category
  const eligiblePoints = useMemo(() => {
    if (!selectedCategoryId) {
      return points;
    }
    return points.filter((point) =>
      point.bins.some((bin) => bin.categoryId === selectedCategoryId)
    );
  }, [points, selectedCategoryId]);

  // Calculate the nearest disposal point
  const nearestPoint = useMemo(() => {
    if (eligiblePoints.length === 0 || !userCoords) {
      return null;
    }
    let closest: DisposalPoint = eligiblePoints[0];
    let minDistance = haversineDistance(
      userCoords.lat,
      userCoords.lng,
      closest.lat,
      closest.lng
    );
    for (let i = 1; i < eligiblePoints.length; i++) {
      const point = eligiblePoints[i];
      const distance = haversineDistance(
        userCoords.lat,
        userCoords.lng,
        point.lat,
        point.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    }
    return closest;
  }, [eligiblePoints, userCoords]);

  // Get the selected category object
  const activeCategoryObj = useMemo(() => {
    if (!selectedCategoryId) {
      return null;
    }
    return (
      categories.find((category) => category.id === selectedCategoryId) || null
    );
  }, [categories, selectedCategoryId]);

  // Guide character action handler
  const handleGuideAction = useCallback(
    (action: string, message?: string) => {
      console.log('[Guide] Action:', action, 'Message:', message);
    },
    []
  );

  // IMPORTANT: All Hooks are declared above this conditional.
    if (showWelcome) {
      return (
        <WelcomeScreen onComplete={handleWelcomeComplete} language={language} />
      );
    }

    // Main application with routing
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans pb-20">
          {/* Offline alert banner */}
          <OfflineIndicator />
          {/* Main content */}
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
          <Routes>
            {/* Classifier tab - List view */}
                        <Route path="/clasificador" element={
                          <div className="space-y-4 animate-in fade-in duration-150">
                            {/* Top Controls - Only on Classifier main page, above banner, not sticky */}
                            <TopControls 
                              isOnline={isOnline}
                              language={language}
                              setLanguage={setLanguage}
                              t={t}
                              onInstallClick={handleInstallClick}
                              installPrompt={isInstallable && !isInstalled}
                            />

                            {/* Institutional Banner - Only on Classifier main page */}
                            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                              <img
                                src="/images/banner-institucional.png"
                                alt="EcoUNCP - Banner Institucional Universidad Nacional del Centro del Peru"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                            <div className="p-4 shadow-lg border border-[#D4A017]/30 bg-gradient-to-br from-[#0B5D3B] via-[#084C2E] to-[#1A1A1A] rounded-2xl">
                              <h2 className="text-lg font-black text-white tracking-tight">
                                {t('app_tagline')}
                              </h2>
                              <p className="mt-1 text-xs text-white/70 font-medium">
                                Busca cualquier residuo comun del campus para
                                ver su categoria, el color del contenedor segun
                                norma peruana y por que debe segregarse alli.
                              </p>
                            </div>
                            <WasteClassifier
                              items={items}
                              categories={categories}
                              onNavigateToMap={handleFindOnMap}
                            />
                          </div>
                        } />

            {/* Detail view - SIBLING route (not nested) */}
            <Route path="/clasificador/residuo/:itemId" element={
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 shadow-lg border border-[#D4A017]/30 bg-gradient-to-br from-[#0B5D3B] via-[#084C2E] to-[#1A1A1A] rounded-2xl">
                  <h2 className="text-lg font-black text-white tracking-tight">
                    {t('app_tagline')}
                  </h2>
                  <p className="mt-1 text-xs text-white/70 font-medium">
                    Busca cualquier residuo común del campus para
                    ver su categoría, el color del contenedor según
                    norma peruana y por qué debe segregarse allí.
                  </p>
                </div>
                <WasteDetail
                  items={items}
                  categories={categories}
                  onNavigateToMap={handleFindOnMap}
                />
              </div>
            } />

            {/* Map tab */}
            <Route path="/mapa" element={
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 shadow-lg border border-[#D4A017]/30 bg-gradient-to-br from-[#0B5D3B] via-[#084C2E] to-[#1A1A1A] rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight">
                        {t('map_title')}
                      </h2>
                      <p className="mt-0.5 text-xs text-white/80 font-medium">
                        {t('map_subtitle')}
                      </p>
                    </div>
                    {selectedCategoryId && (
                      <button
                        onClick={() => setSelectedCategoryId(null)}
                        className="self-start sm:self-auto text-xs font-semibold text-white hover:text-[#D4A017] bg-white/10 px-2.5 py-1 rounded-lg border border-white/20"
                      >
                        Restablecer filtro (
                        {categories.find(
                          (category) => category.id === selectedCategoryId
                        )?.name[language] || selectedCategoryId}
                        ) ✕
                      </button>
                    )}
                  </div>
                </div>
                <EnhancedNearestPointBanner
                  nearestPoint={nearestPoint}
                  category={activeCategoryObj}
                  userCoords={userCoords}
                  language={language}
                  onOpenPoint={() => {}}
                  onSelectReferenceSpot={setManualReference}
                  onRequestGps={requestGps}
                  gpsStatus={gpsStatus}
                  onGuideAction={handleGuideAction}
                />
                <CampusMap
                  points={points}
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  nearestPointId={nearestPoint ? nearestPoint.id : null}
                  userCoords={userCoords}
                  language={language}
                  onSelectCategoryFilter={setSelectedCategoryId}
                />
              </div>
            } />

            {/* Education tab */}
            <Route path="/educacion" element={
              <div className="animate-in fade-in duration-150">
                <EducationGuide categories={categories} language={language} />
              </div>
            } />

            {/* Survey tab */}
            <Route path="/levantamiento" element={
              <div className="animate-in fade-in duration-150">
                <SurveyExportModal />
              </div>
            } />

            {/* Redirect root to clasificador */}
            <Route index element={<Navigate to="/clasificador" replace />} />
          </Routes>
        </main>
        {/* Bottom navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            const routes: Record<ActiveTab, string> = {
              classifier: '/clasificador',
              map: '/mapa',
              education: '/educacion',
              survey: '/levantamiento',
            };
            setActiveTab(tab);
          }}
          filteredCategoryCount={selectedCategoryId ? eligiblePoints.length : undefined}
        />
      </div>
    </BrowserRouter>
  );
}