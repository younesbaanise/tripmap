import { useState, useCallback } from "react";

export const useGeocoding = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCities = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}&limit=5`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch city suggestions");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const citySuggestions = data.results.map((result) => ({
          id: result.geometry.lat + "," + result.geometry.lng,
          placeName: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          displayName: result.formatted,
        }));
        setSuggestions(citySuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to fetch city suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    searchCities,
    clearSuggestions,
  };
};
