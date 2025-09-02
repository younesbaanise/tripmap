import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import { toast } from 'react-hot-toast';
import CitySearchInput from '../components/CitySearchInput';
import { 
  FaPlus, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaRoute, 
  FaEdit, 
  FaImage, 
  FaArrowLeft,
  FaGlobeAmericas,
  FaCamera
} from "react-icons/fa";

const AddTrip = () => {
  const navigate = useNavigate();
  const { addTrip, loading } = useTrips();
  
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
  const [uploading, setUploading] = useState(false);

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
      
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const tripData = {
        placeName: formData.placeName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        description: formData.description.trim(),
        imageUrl,
        lat: selectedCity.lat,
        lng: selectedCity.lng
      };

      await addTrip(tripData);
      toast.success('Trip added successfully!');
      navigate('/trips');
    } catch (error) {
      console.error('Error adding trip:', error);
      toast.error('Failed to add trip. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = loading || uploading;

  return (
    <div className="min-h-screen bg-[#F6F5F3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-2xl">
              <FaPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#2D2D34]">Add New Trip</h1>
              <p className="text-lg text-[#6B6B70]">Plan your next adventure</p>
            </div>
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#F6F5F3] to-white px-8 py-6 border-b border-[#DADADA]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2D2D34]">Trip Details</h2>
              <button
                onClick={() => navigate('/trips')}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F6F5F3] hover:bg-[#DADADA] text-[#6B6B70] hover:text-[#2D2D34] rounded-lg transition-all duration-200 cursor-pointer"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Trips</span>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Place Name Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#8E6DE9] rounded-lg">
                  <FaMapMarkerAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Destination</h3>
              </div>
              <CitySearchInput
                value={formData.placeName}
                onChange={(value) => setFormData(prev => ({ ...prev, placeName: value }))}
                onCitySelect={handleCitySelect}
                placeholder="Search for a city..."
                required
              />
            </div>

            {/* Date Range Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#00BFA6] rounded-lg">
                  <FaCalendarAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Trip Dates</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-[#2D2D34] mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-[#2D2D34] mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#FF5E5B] rounded-lg">
                  <FaRoute className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Trip Status</h3>
              </div>
              
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:border-[#FF5E5B] transition-all duration-200 text-[#2D2D34] bg-white cursor-pointer"
              >
                <option value="Future Trip">Future Trip</option>
                <option value="Visited">Visited</option>
              </select>
            </div>

            {/* Description Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#8E6DE9] rounded-lg">
                  <FaEdit className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Description</h3>
              </div>
              
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:border-[#8E6DE9] transition-all duration-200 text-[#2D2D34] bg-white placeholder-[#6B6B70] resize-none"
                placeholder="Share your travel plans, expectations, or memories..."
              />
            </div>

            {/* Image Upload Section */}
            <div className="bg-[#F6F5F3] rounded-xl p-6 border border-[#DADADA]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-[#00BFA6] rounded-lg">
                  <FaCamera className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">Trip Image</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00BFA6] file:text-white hover:file:bg-[#00BFA6]/90"
                />
                
                {imagePreview && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#DADADA]">
                    <p className="text-sm font-medium text-[#2D2D34] mb-3">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#DADADA]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-3 bg-[#FF5E5B] text-white py-4 px-6 rounded-xl hover:bg-[#FF5E5B]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaPlus className="w-5 h-5" />
                <span>{isSubmitting ? 'Adding Trip...' : 'Add Trip'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 border border-[#DADADA] text-[#2D2D34] rounded-xl hover:bg-[#F6F5F3] focus:outline-none focus:ring-2 focus:ring-[#DADADA] transition-all duration-200 font-medium text-lg cursor-pointer"
              >
                <FaArrowLeft className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTrip;
