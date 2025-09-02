import { useState } from 'react';
import { useNavigate } from 'react-router';
import { extractCityName } from '../utils/placeUtils';
import { 
  FaEdit, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaEye,
  FaImage
} from "react-icons/fa";

const TripCard = ({ trip, onOpenModal }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleCardClick = () => {
    onOpenModal(trip);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit-trip/${trip.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (status === 'Visited') {
      return {
        bg: 'bg-[#00BFA6]',
        text: 'text-white',
        border: 'border-[#00BFA6]'
      };
    } else {
      return {
        bg: 'bg-[#8E6DE9]',
        text: 'text-white',
        border: 'border-[#8E6DE9]'
      };
    }
  };

  const statusColors = getStatusColor(trip.status);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#DADADA] overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
    >
      {/* Enhanced Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-[#F6F5F3] to-[#DADADA] overflow-hidden">
        {trip.imageUrl && !imageError ? (
          <>
            {/* Loading State */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F6F5F3]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6]"></div>
              </div>
            )}
            
            {/* Image */}
            <img
              src={trip.imageUrl}
              alt={trip.placeName}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            

          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#6B6B70]">
            <FaImage className="w-16 h-16 mb-2 opacity-50" />
            <p className="text-sm opacity-70">No Image</p>
          </div>
        )}
        
        {/* Status Badge - Positioned on top right */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${statusColors.bg} ${statusColors.text}`}>
            {trip.status}
          </span>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-5">
        {/* Header with Place Name */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-[#2D2D34] mb-1 group-hover:text-[#00BFA6] transition-colors duration-200 line-clamp-1">
            {extractCityName(trip.placeName)}
          </h3>
          <div className="flex items-center text-[#6B6B70] text-sm">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#8E6DE9]" />
            <span className="line-clamp-1">{trip.placeName}</span>
          </div>
        </div>

        {/* Dates Section */}
        <div className="mb-4 p-3 bg-[#F6F5F3] rounded-lg border border-[#DADADA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="w-4 h-4 text-[#00BFA6]" />
              <span className="text-sm font-medium text-[#2D2D34]">Duration</span>
            </div>
            <span className="text-xs text-[#6B6B70] bg-white px-2 py-1 rounded-full">
              {trip.startDate && trip.endDate ? 
                `${Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days` : 
                'N/A'
              }
            </span>
          </div>
          <div className="mt-2 text-sm text-[#2D2D34]">
            <span className="font-medium">{formatDate(trip.startDate)}</span>
            <span className="mx-2 text-[#6B6B70]">→</span>
            <span className="font-medium">{formatDate(trip.endDate)}</span>
          </div>
        </div>

        {/* Description Section - Handles different lengths gracefully */}
        {trip.description && (
          <div className="mb-4">
            <p className={`text-sm text-[#6B6B70] leading-relaxed ${
              trip.description.length > 100 ? 'line-clamp-3' : 'line-clamp-2'
            }`}>
              {trip.description}
            </p>
            {trip.description.length > 100 && (
              <div className="mt-2 text-xs text-[#00BFA6] font-medium">
                Click to read more...
              </div>
            )}
          </div>
        )}

        {/* Actions Section */}
        <div className="flex justify-between items-center pt-3 border-t border-[#DADADA]">
          <div className="text-xs text-[#6B6B70]">
            Created {new Date(trip.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          
          <button
            onClick={handleEditClick}
            className="flex items-center space-x-2 px-4 py-2 bg-[#8E6DE9] text-white rounded-lg hover:bg-[#8E6DE9]/90 focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md text-sm font-medium"
          >
            <FaEdit className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#8E6DE9]/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default TripCard;
