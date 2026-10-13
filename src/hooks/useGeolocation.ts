import { useState, useEffect, useCallback } from 'react';
import { UserCoords } from '../types';
import { CAMPUS_REFERENCE_SPOTS, UNCP_CAMPUS_CENTER } from '../utils/campus';

export function useGeolocation() {
  const [coords, setCoords] = useState<UserCoords>({
    lat: CAMPUS_REFERENCE_SPOTS[0].lat, // Default to Puerta Principal UNCP
    lng: CAMPUS_REFERENCE_SPOTS[0].lng,
    isCustomReference: true,
    referenceName: CAMPUS_REFERENCE_SPOTS[0].name.es,
  });
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

  // Try GPS once on mount if available
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If within reasonable proximity of Peru/Huancayo or just active
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isCustomReference: false,
          });
          setGpsStatus('active');
        },
        () => {
          // Keep default campus reference spot
          setGpsStatus('idle');
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
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
