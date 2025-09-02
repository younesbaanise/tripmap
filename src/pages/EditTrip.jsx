import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import { toast } from 'react-hot-toast';
import CitySearchInput from '../components/CitySearchInput';

const EditTrip = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { getTrip, updateTrip, loading } = useTrips();
  
  const [formData, setFormData] = useState({
    placeName: '',
    startDate: '',
    endDate: '',
    status: 'Future Trip',
    description: '',
    image: null
  });
  
  const [selectedCity, setSelectedCity] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      const tripData = getTrip(tripId);
      if (tripData) {
        setTrip(tripData);
        setFormData({
          placeName: tripData.placeName || '',
          startDate: tripData.startDate || '',
          endDate: tripData.endDate || '',
          status: tripData.status || 'Future Trip',
          description: tripData.description || '',
          image: null
        });
        setCurrentImageUrl(tripData.imageUrl || '');
        setImagePreview(tripData.imageUrl || '');
        
        // Set selected city if coordinates exist
        if (tripData.lat && tripData.lng) {
          setSelectedCity({
            placeName: tripData.placeName,
            lat: tripData.lat,
            lng: tripData.lng
          });
        }
      } else {
        toast.error('Trip not found');
        navigate('/trips');
      }
    }
  }, [tripId, getTrip, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFormData(prev => ({
      ...prev,
      placeName: city.placeName
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', import.meta.env.VITE_CLOUDINARY_FOLDER);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.placeName.trim()) {
      toast.error('Place name is required');
      return;
    }
    
    if (!selectedCity) {
      toast.error('Please select a valid city from the suggestions');
      return;
    }
    
    if (!formData.startDate) {
      toast.error('Start date is required');
      return;
    }
    
    if (!formData.endDate) {
      toast.error('End date is required');
      return;
    }
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setUploading(true);
      
      let imageUrl = currentImageUrl;
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const updatedData = {
        placeName: formData.placeName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        description: formData.description.trim(),
        imageUrl,
        lat: selectedCity.lat,
        lng: selectedCity.lng
      };

      await updateTrip(tripId, updatedData);
      toast.success('Trip updated successfully!');
      navigate('/trips');
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/trips');
  };

  const isSubmitting = loading || uploading;

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Trip</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Place Name */}
            <div>
              <label htmlFor="placeName" className="block text-sm font-medium text-gray-700 mb-2">
                Place Name *
              </label>
              <CitySearchInput
                value={formData.placeName}
                onChange={(value) => setFormData(prev => ({ ...prev, placeName: value }))}
                onCitySelect={handleCitySelect}
                placeholder="Search for a city..."
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Future Trip">Future Trip</option>
                <option value="Visited">Visited</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter trip description"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Trip Image (Optional - leave empty to keep current image)
              </label>
              
              {/* Current Image */}
              {currentImageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current image:</p>
                  <img
                    src={currentImageUrl}
                    alt="Current trip image"
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
              
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* New Image Preview */}
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                  <img
                    src={imagePreview}
                    alt="New image preview"
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating Trip...' : 'Update Trip'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
