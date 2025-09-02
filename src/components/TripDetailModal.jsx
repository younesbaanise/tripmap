import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import { toast } from 'react-hot-toast';
import { extractCityName } from '../utils/placeUtils';
import { 
  FaTimes, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaEdit, 
  FaTrash, 
  FaImage,
  FaGlobeAmericas,
  FaRoute
} from "react-icons/fa";

const TripDetailModal = ({ trip, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { deleteTrip, loading } = useTrips();
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !trip) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleEdit = () => {
    onClose();
    navigate(`/edit-trip/${trip.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(trip.id);
      toast.success('Trip deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const calculateDuration = () => {
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const statusColors = getStatusColor(trip.status);
  const duration = calculateDuration();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DADADA] transform transition-all duration-300 scale-100">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-[#F6F5F3] to-white rounded-t-2xl p-6 border-b border-[#DADADA]">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-xl">
                  <FaGlobeAmericas className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#2D2D34]">{extractCityName(trip.placeName)}</h2>
                  <p className="text-[#6B6B70] text-sm">Travel Adventure</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="inline-block">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${statusColors.bg} ${statusColors.text}`}>
                  {trip.status}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-[#6B6B70] hover:text-[#2D2D34] rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 cursor-pointer"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Enhanced Image Section */}
          <div className="relative">
            {trip.imageUrl && !imageError ? (
              <div className="w-full h-80 bg-gradient-to-br from-[#F6F5F3] to-[#DADADA] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={trip.imageUrl}
                  alt={trip.placeName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-[#F6F5F3] to-[#DADADA] rounded-xl flex flex-col items-center justify-center shadow-lg">
                <FaImage className="w-24 h-24 text-[#6B6B70] opacity-50 mb-4" />
                <p className="text-[#6B6B70] text-lg font-medium">No Image Available</p>
              </div>
            )}
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Dates Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#00BFA6] rounded-lg">
                  <FaCalendarAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Trip Dates</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#DADADA]">
                  <div className="flex items-center space-x-3">
                    <FaRoute className="w-4 h-4 text-[#00BFA6]" />
                    <span className="text-[#2D2D34] font-medium">Start Date</span>
                  </div>
                  <span className="text-[#6B6B70] font-semibold">{formatDate(trip.startDate)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#DADADA]">
                  <div className="flex items-center space-x-3">
                    <FaRoute className="w-4 h-4 text-[#8E6DE9]" />
                    <span className="text-[#2D2D34] font-medium">End Date</span>
                  </div>
                  <span className="text-[#6B6B70] font-semibold">{formatDate(trip.endDate)}</span>
                </div>
                
                {duration > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#00BFA6] to-[#8E6DE9] rounded-lg text-white">
                    <div className="flex items-center space-x-3">
                      <FaClock className="w-4 h-4" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <span className="font-bold">{duration} day{duration !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Info Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#8E6DE9] rounded-lg">
                  <FaMapMarkerAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Trip Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-[#DADADA]">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-[#8E6DE9]" />
                    <span className="text-[#2D2D34] font-medium">Destination</span>
                  </div>
                  <p className="text-[#6B6B70] text-sm leading-relaxed">{trip.placeName}</p>
                </div>
                
                {trip.createdAt && (
                  <div className="p-3 bg-white rounded-lg border border-[#DADADA]">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaClock className="w-4 h-4 text-[#00BFA6]" />
                      <span className="text-[#2D2D34] font-medium">Created</span>
                    </div>
                    <p className="text-[#6B6B70] text-sm">{formatDate(trip.createdAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {trip.description && (
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#FF5E5B] rounded-lg">
                  <FaGlobeAmericas className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Description</h3>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#DADADA]">
                <p className="text-[#6B6B70] leading-relaxed text-base">{trip.description}</p>
              </div>
            </div>
          )}

          {/* Enhanced Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#DADADA]">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center space-x-3 bg-[#8E6DE9] text-white py-4 px-6 rounded-xl hover:bg-[#8E6DE9]/90 focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg cursor-pointer"
            >
              <FaEdit className="w-5 h-5" />
              <span>Edit Trip</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-3 bg-[#FF5E5B] text-white py-4 px-6 rounded-xl hover:bg-[#FF5E5B]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaTrash className="w-5 h-5" />
              <span>{loading ? 'Deleting...' : 'Delete Trip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailModal;
