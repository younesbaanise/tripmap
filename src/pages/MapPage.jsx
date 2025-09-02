import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import { useEffect, useRef, useState } from 'react';
import TripDetailModal from '../components/TripDetailModal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Add custom CSS to fix z-index issues
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
  }
`;

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different trip statuses
const createCustomIcon = (status) => {
  const iconColor = status === 'Visited' ? '#10B981' : '#3B82F6';
  const iconHtml = `
    <div style="
      background-color: ${iconColor};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Component to update map bounds when trips change
const MapUpdater = ({ tripsWithCoordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    if (tripsWithCoordinates.length > 0) {
      const bounds = L.latLngBounds(
        tripsWithCoordinates.map(trip => [trip.lat, trip.lng])
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
  const defaultCenter = { lat: 0, lng: 0 };
  const defaultZoom = 2;

  // Inject custom CSS to fix z-index issues
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Filter trips that have coordinates
  const tripsWithCoordinates = trips.filter(trip => trip.lat && trip.lng);

  // Calculate map center based on trips or use default
  const mapCenter = tripsWithCoordinates.length > 0 
    ? { 
        lat: tripsWithCoordinates[0].lat, 
        lng: tripsWithCoordinates[0].lng 
      }
    : { lat: 20, lng: 0 }; // Show more of the world when no trips

  // Determine appropriate zoom level
  const mapZoom = tripsWithCoordinates.length > 0 ? 4 : 2;

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Map</h1>
                         <p className="text-gray-600 mt-2">
               {tripsWithCoordinates.length === 0 ? (
                 "Ready to start mapping your adventures?"
               ) : (
                 <>
                   {tripsWithCoordinates.length} trip{tripsWithCoordinates.length !== 1 ? 's' : ''} with coordinates
                   {trips.length > tripsWithCoordinates.length && (
                     <span className="text-gray-400 ml-2">
                       ({trips.length - tripsWithCoordinates.length} without coordinates)
                     </span>
                   )}
                 </>
               )}
             </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/trips')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Trips
            </button>
            <button
              onClick={() => navigate('/add-trip')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add New Trip
            </button>
          </div>
        </div>
        
                 <div className="bg-white rounded-lg shadow-md p-4">
           {/* Map Legend */}
           {tripsWithCoordinates.length > 0 && (
             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
               <h3 className="text-sm font-medium text-gray-700 mb-2">Map Legend</h3>
               <div className="flex gap-4 text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                   <span className="text-gray-600">Visited Trips</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                   <span className="text-gray-600">Future Trips</span>
                 </div>
               </div>
             </div>
           )}
           
                       <div 
              className="w-full h-[600px] rounded-lg overflow-hidden relative"
              style={{ height: '600px', zIndex: 1 }}
            >
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
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
                      <div className="min-w-[200px] max-w-[250px]">
                        {/* Trip Image */}
                        {trip.imageUrl && (
                          <div className="mb-3">
                            <img 
                              src={trip.imageUrl} 
                              alt={trip.placeName}
                              className="w-full h-24 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Trip Title */}
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 text-center">
                          {trip.placeName}
                        </h3>
                        
                        {/* Status Badge */}
                        <div className="flex justify-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trip.status === 'Visited' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        
                        {/* Trip Dates */}
                        <div className="text-xs text-gray-600 text-center mb-3">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-trip/${trip.id}`)}
                            className="flex-1 bg-blue-600 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenModal(trip)}
                            className="flex-1 bg-gray-600 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                 </Marker>
               ))}
              
                           </MapContainer>
           </div>
         </div>
       </div>
       
       {/* Empty State Message when no trips exist */}
       {tripsWithCoordinates.length === 0 && (
         <div className="mt-6 bg-white rounded-lg shadow-md p-8 text-center">
           <div className="max-w-md mx-auto">
             <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <h3 className="text-lg font-medium text-gray-900 mb-2">
               No trips on the map yet
             </h3>
             <p className="text-gray-600 mb-6">
               Start your travel journey by adding your first trip! Each trip you create will appear as a marker on this map, helping you visualize your adventures around the world.
             </p>
             <div className="flex gap-3 justify-center">
               <button
                 onClick={() => navigate('/add-trip')}
                 className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
               >
                 Create Your First Trip
               </button>
               <button
                 onClick={() => navigate('/trips')}
                 className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
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
   );
 };

export default MapPage;
