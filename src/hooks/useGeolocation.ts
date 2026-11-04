import { useState, useEffect, useCallback } from 'react';
import { UserCoords } from '../types';
import { CAMPUS_REFERENCE_SPOTS, UNCP_CAMPUS_CENTER } from '../utils/campus';

export function useGeolocation() {
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'active' | 'denied' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setErrorMessage('Tu navegador no soporta geolocalización.');
      return;
    }

    setGpsStatus('searching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isCustomReference: false,
        });
        setGpsStatus('active');
        setErrorMessage(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setErrorMessage('Permiso de GPS no concedido. Puedes elegir un punto de referencia en el campus.');
        } else {
          setGpsStatus('error');
          setErrorMessage('No se pudo obtener la posición GPS precisa.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Auto-request GPS on mount with strict settings to get REAL position (not cached)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Validate: must be a reasonable GPS position (not 0,0 or extremely inaccurate)
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          // Basic validation: not null island (0,0), not poles, reasonable accuracy
          const isValidPosition = 
            !(lat === 0 && lng === 0) &&  // Not null island
            lat >= -90 && lat <= 90 &&    // Valid latitude
            lng >= -180 && lng <= 180 &&  // Valid longitude
            accuracy <= 500;              // Accept up to 500m accuracy (covers most cases)
          
          if (isValidPosition) {
            setCoords({
              lat,
              lng,
              accuracy,
              isCustomReference: false,
            });
            setGpsStatus('active');
          } else {
            // Invalid position - don't set, user will choose manually
            setGpsStatus('idle');
          }
        },
        () => {
          // Permission denied or error - keep idle, let user choose manually
          setGpsStatus('idle');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // NO cache, force fresh GPS
      );
    }
  }, []);

  const setManualReference = useCallback((spotId: string) => {
    const spot = CAMPUS_REFERENCE_SPOTS.find((s) => s.id === spotId) || CAMPUS_REFERENCE_SPOTS[0];
    setCoords({
      lat: spot.lat,
      lng: spot.lng,
      isCustomReference: true,
      referenceName: spot.name.es,
    });
    setGpsStatus('idle');
  }, []);

  return {
    coords,
    gpsStatus,
    errorMessage,
    requestGps,
    setManualReference,
    referenceSpots: CAMPUS_REFERENCE_SPOTS,
  };
}
