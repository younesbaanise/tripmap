import { useState, useEffect, useRef } from 'react';
import { useGeocoding } from '../hooks/useGeocoding';

const CitySearchInput = ({ 
  value, 
  onChange, 
  onCitySelect, 
  placeholder = "Search for a city...",
  required = false,
  disabled = false 
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  
  const { suggestions, loading, error, searchCities, clearSuggestions } = useGeocoding();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedCity(null);
    
    if (newValue.trim().length >= 2) {
      searchCities(newValue);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
    
    onChange(newValue);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setInputValue(city.placeName);
    setShowSuggestions(false);
    clearSuggestions();
    
    // Call the parent's onCitySelect with the full city data
    onCitySelect(city);
    
    // Also update the input value for form validation
    onChange(city.placeName);
  };

  const handleInputFocus = () => {
    if (inputValue.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      clearSuggestions();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {/* City suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleCitySelect(city)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {city.displayName}
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {showSuggestions && !loading && suggestions.length === 0 && inputValue.trim().length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg px-3 py-2 text-gray-500">
          No cities found
        </div>
      )}
    </div>
  );
};

export default CitySearchInput;
