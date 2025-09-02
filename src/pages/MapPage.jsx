import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router";
import { useTrips } from "../contexts/TripContext";
import { useEffect, useRef, useState } from "react";
import TripDetailModal from "../components/TripDetailModal";
import {
  FaMap,
  FaArrowLeft,
  FaPlus,
  FaGlobeAmericas,
  FaRoute,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Add custom CSS to fix z-index issues and enhance popup styling
const mapStyles = `
  .map-container {
    z-index: 1 !important;
  }
  .leaflet-container {
    z-index: 1 !important;
  }
  .leaflet-popup {
    z-index: 1000 !important;
  }
  .leaflet-popup-tip {
    z-index: 1000 !important;
  }
  .leaflet-popup-content-wrapper {
    z-index: 1000 !important;
    border-radius: 12px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    border: 1px solid #DADADA !important;
    padding: 0 !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
    border-radius: 12px !important;
  }
  .leaflet-popup-tip-container {
    margin-top: -1px !important;
  }
  .leaflet-popup-close-button {
    color: #6B6B70 !important;
    font-size: 18px !important;
    font-weight: bold !important;
    padding: 8px !important;
    right: 8px !important;
    top: 8px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 50% !important;
    width: 24px !important;
    height: 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
  }
  .leaflet-popup-close-button:hover {
    background: rgba(255, 255, 255, 1) !important;
    color: #2D2D34 !important;
    transform: scale(1.1) !important;
  }
`;

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for different trip statuses
const createCustomIcon = (status) => {
  const iconColor = status === "Visited" ? "#00BFA6" : "#8E6DE9";
  const iconHtml = `
    <div style="
      background-color: ${iconColor};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Component to update map bounds when trips change
const MapUpdater = ({ tripsWithCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (tripsWithCoordinates.length > 0) {
      const bounds = L.latLngBounds(
        tripsWithCoordinates.map((trip) => [trip.lat, trip.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [tripsWithCoordinates, map]);

  return null;
};

const MapPage = () => {
  const navigate = useNavigate();
  const { trips, loading, error } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultCenter = { lat: 20, lng: 0 };
  const defaultZoom = 2;

  // Inject custom CSS to fix z-index issues
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Filter trips that have coordinates
  const tripsWithCoordinates = trips.filter((trip) => trip.lat && trip.lng);

  // Calculate map center based on trips or use default
  const mapCenter =
    tripsWithCoordinates.length > 0
      ? {
          lat: tripsWithCoordinates[0].lat,
          lng: tripsWithCoordinates[0].lng,
        }
      : defaultCenter;

  // Determine appropriate zoom level
  const mapZoom = tripsWithCoordinates.length > 0 ? 4 : defaultZoom;

  const handleOpenModal = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  // Show loading state
  if (loading && trips.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00BFA6] mx-auto mb-6"></div>
          <p className="text-[#6B6B70] text-lg">Loading your travel map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#FF5E5B] rounded-full flex items-center justify-center mx-auto mb-6">
            <FaMap className="w-10 h-10 text-white" />
          </div>
          <p className="text-[#FF5E5B] text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00BFA6] text-white px-6 py-3 rounded-xl hover:bg-[#00BFA6]/90 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-2xl shadow-lg">
                  <FaMap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#2D2D34]">
                    Travel Map
                  </h1>
                  <p className="text-lg text-[#6B6B70]">
                    Explore your adventures around the world
                  </p>
                </div>
              </div>

              {/* Trip Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F6F5F3] rounded-xl p-4 border border-[#DADADA] hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#00BFA6] rounded-lg">
                      <FaGlobeAmericas className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#2D2D34]">
                        {tripsWithCoordinates.length}
                      </p>
                      <p className="text-sm text-[#6B6B70]">Mapped Trips</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F6F5F3] rounded-xl p-4 border border-[#DADADA] hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#8E6DE9] rounded-lg">
                      <FaRoute className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#2D2D34]">
                        {
                          trips.filter(
                            (t) => t.status === "Future Trip" && t.lat && t.lng
                          ).length
                        }
                      </p>
                      <p className="text-sm text-[#6B6B70]">Planned</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F6F5F3] rounded-xl p-4 border border-[#DADADA] hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#FF5E5B] rounded-lg">
                      <FaCalendarAlt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#2D2D34]">
                        {
                          trips.filter(
                            (t) => t.status === "Visited" && t.lat && t.lng
                          ).length
                        }
                      </p>
                      <p className="text-sm text-[#6B6B70]">Visited</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons - Aligned to the right */}
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-8">
              <button
                onClick={() => navigate("/trips")}
                className="flex items-center space-x-3 bg-[#F6F5F3] hover:bg-[#DADADA] text-[#2D2D34] px-6 py-3 rounded-xl border border-[#DADADA] transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Trips</span>
              </button>
              <button
                onClick={() => navigate("/add-trip")}
                className="flex items-center space-x-3 bg-[#FF5E5B] text-white px-6 py-3 rounded-xl hover:bg-[#FF5E5B]/90 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add New Trip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Map Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#DADADA] overflow-hidden">
          {/* Map Legend */}
          {tripsWithCoordinates.length > 0 && (
            <div className="p-6 border-b border-[#DADADA] bg-gradient-to-r from-[#F6F5F3] to-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[#8E6DE9] rounded-lg">
                  <FaMapMarkerAlt className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#2D2D34]">
                  Map Legend
                </h3>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-[#00BFA6] rounded-full border-2 border-white shadow-md"></div>
                  <span className="text-[#2D2D34] font-medium">
                    Visited Trips
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-[#8E6DE9] rounded-full border-2 border-white shadow-md"></div>
                  <span className="text-[#2D2D34] font-medium">
                    Future Trips
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <div
            className="w-full h-[700px] relative"
            style={{ height: "700px", zIndex: 1 }}
          >
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              className="map-container"
            >
              <MapUpdater tripsWithCoordinates={tripsWithCoordinates} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render trip markers */}
              {tripsWithCoordinates.map((trip) => (
                <Marker
                  key={trip.id}
                  position={{ lat: trip.lat, lng: trip.lng }}
                  icon={createCustomIcon(trip.status)}
                >
                  <Popup className="trip-popup">
                    <div className="min-w-[280px] max-w-[320px] p-4 bg-white rounded-xl shadow-2xl border border-[#DADADA]">
                      {/* Trip Image */}
                      {trip.imageUrl && (
                        <div className="mb-4 -mx-4 -mt-4">
                          <img
                            src={trip.imageUrl}
                            alt={trip.placeName}
                            className="w-full h-32 object-cover rounded-t-xl"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Trip Title */}
                      <h3 className="font-bold text-base text-[#2D2D34] mb-3 text-center leading-tight">
                        {trip.placeName}
                      </h3>

                      {/* Status Badge */}
                      <div className="flex justify-center mb-4">
                        <span
                          className={`px-4 py-2 text-xs font-semibold rounded-full shadow-lg ${
                            trip.status === "Visited"
                              ? "bg-[#00BFA6] text-white"
                              : "bg-[#8E6DE9] text-white"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>

                      {/* Trip Dates */}
                      <div className="bg-[#F6F5F3] rounded-lg p-3 mb-4 border border-[#DADADA]">
                        <div className="text-xs text-[#6B6B70] text-center font-medium">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <FaCalendarAlt className="w-3 h-3 text-[#8E6DE9]" />
                            <span>Trip Dates</span>
                          </div>
                          <span className="text-[#2D2D34] font-semibold">
                            {new Date(trip.startDate).toLocaleDateString()} -{" "}
                            {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/edit-trip/${trip.id}`)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-[#8E6DE9] text-white py-3 px-4 rounded-lg text-xs font-semibold hover:bg-[#8E6DE9]/90 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <FaEdit className="w-3 h-3" />
                          <span>Edit Trip</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal(trip)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-[#00BFA6] text-white py-3 px-4 rounded-lg text-xs font-semibold hover:bg-[#00BFA6]/90 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <FaEye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Empty State Message when no trips exist */}
        {tripsWithCoordinates.length === 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-[#DADADA] p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGlobeAmericas className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D34] mb-4">
                No trips on the map yet
              </h3>
              <p className="text-[#6B6B70] mb-8 text-lg leading-relaxed">
                Start your travel journey by adding your first trip! Each trip
                you create will appear as a marker on this map, helping you
                visualize your adventures around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/add-trip")}
                  className="bg-[#FF5E5B] text-white px-8 py-4 rounded-xl hover:bg-[#FF5E5B]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg cursor-pointer"
                >
                  Create Your First Trip
                </button>
                <button
                  onClick={() => navigate("/trips")}
                  className="bg-[#F6F5F3] hover:bg-[#DADADA] text-[#2D2D34] px-8 py-4 rounded-xl border border-[#DADADA] focus:outline-none focus:ring-2 focus:ring-[#DADADA] transition-all duration-200 font-medium text-lg cursor-pointer"
                >
                  View All Trips
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trip Detail Modal */}
        <div style={{ zIndex: 9999 }}>
          <TripDetailModal
            trip={selectedTrip}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
