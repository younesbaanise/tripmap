import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useTrips } from "../contexts/TripContext";
import { toast } from "react-hot-toast";
import CitySearchInput from "../components/CitySearchInput";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRoute,
  FaPencilAlt,
  FaImage,
  FaArrowLeft,
  FaCamera,
  FaSave,
} from "react-icons/fa";

const EditTrip = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { getTrip, updateTrip, loading } = useTrips();

  const [formData, setFormData] = useState({
    placeName: "",
    startDate: "",
    endDate: "",
    status: "Future Trip",
    description: "",
    image: null,
  });

  const [selectedCity, setSelectedCity] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      const tripData = getTrip(tripId);
      if (tripData) {
        setTrip(tripData);
        setFormData({
          placeName: tripData.placeName || "",
          startDate: tripData.startDate || "",
          endDate: tripData.endDate || "",
          status: tripData.status || "Future Trip",
          description: tripData.description || "",
          image: null,
        });
        setCurrentImageUrl(tripData.imageUrl || "");
        setImagePreview(tripData.imageUrl || "");

        // Set selected city if coordinates exist
        if (tripData.lat && tripData.lng) {
          setSelectedCity({
            placeName: tripData.placeName,
            lat: tripData.lat,
            lng: tripData.lng,
          });
        }
      } else {
        toast.error("Trip not found");
        navigate("/trips");
      }
    }
  }, [tripId, getTrip, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFormData((prev) => ({
      ...prev,
      placeName: city.placeName,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.placeName.trim()) {
      toast.error("Place name is required");
      return;
    }

    if (!selectedCity) {
      toast.error("Please select a valid city from the suggestions");
      return;
    }

    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
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
        lng: selectedCity.lng,
      };

      await updateTrip(tripId, updatedData);
      toast.success("Trip updated successfully!");
      navigate("/trips");
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate("/trips");
  };

  const isSubmitting = loading || uploading;

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto mb-4"></div>
          <p className="text-[#6B6B70]">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          {/* Mobile: Smaller title and subtitle */}
          <div className="md:hidden mb-6">
            <h1 className="text-3xl font-bold text-[#2D2D34] mb-3">
              Edit Trip
            </h1>
            <p className="text-base text-[#6B6B70]">
              Update your travel adventure
            </p>
          </div>

          {/* Tablet and Desktop: Larger title and subtitle */}
          <div className="hidden md:block mb-6">
            <h1 className="text-4xl font-bold text-[#2D2D34] mb-3">
              Edit Trip
            </h1>
            <p className="text-lg text-[#6B6B70]">
              Update your travel adventure
            </p>
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#F6F5F3] to-white px-8 py-6 border-b border-[#DADADA]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2D2D34]">
                Update Trip Details
              </h2>
              <button
                onClick={() => navigate("/trips")}
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
                <h3 className="text-xl font-bold text-[#2D2D34]">
                  Destination
                </h3>
              </div>
              <CitySearchInput
                value={formData.placeName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, placeName: value }))
                }
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
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-[#2D2D34] mb-2"
                  >
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
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-[#2D2D34] mb-2"
                  >
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
                <h3 className="text-xl font-bold text-[#2D2D34]">
                  Trip Status
                </h3>
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
                  <FaPencilAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D34]">
                  Description
                </h3>
              </div>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:border-[#8E6DE9] transition-all duration-200 text-[#2D2D34] bg-white placeholder-[#6B6B70] resize-none"
                placeholder="Update your travel plans, expectations, or memories..."
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

              <div className="space-y-6">
                {/* Current Image Display */}
                {currentImageUrl && (
                  <div className="p-4 bg-white rounded-lg border border-[#DADADA]">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaImage className="w-4 h-4 text-[#00BFA6]" />
                      <p className="text-sm font-medium text-[#2D2D34]">
                        Current Image
                      </p>
                    </div>
                    <img
                      src={currentImageUrl}
                      alt="Current trip image"
                      className="w-40 h-40 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* New Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-[#2D2D34] mb-3"
                  >
                    Upload New Image (Optional - leave empty to keep current
                    image)
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#00BFA6] file:text-white hover:file:bg-[#00BFA6]/90"
                  />
                </div>

                {/* New Image Preview */}
                {formData.image && (
                  <div className="p-4 bg-white rounded-lg border border-[#DADADA]">
                    <div className="flex items-center space-x-3 mb-3">
                      <FaCamera className="w-4 h-4 text-[#8E6DE9]" />
                      <p className="text-sm font-medium text-[#2D2D34]">
                        New Image Preview
                      </p>
                    </div>
                    <img
                      src={imagePreview}
                      alt="New image preview"
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
                className="flex-1 flex items-center justify-center space-x-3 bg-[#8E6DE9] text-white py-4 px-6 rounded-xl hover:bg-[#8E6DE9]/90 focus:outline-none focus:ring-2 focus:ring-[#8E6DE9] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaSave className="w-5 h-5" />
                <span>{isSubmitting ? "Updating Trip..." : "Update Trip"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
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

export default EditTrip;
