import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapPage = () => {
  const navigate = useNavigate();
  const { trips, loading, error } = useTrips();
  const defaultCenter = { lat: 0, lng: 0 };
  const defaultZoom = 2;

  // Filter trips that have coordinates
  const tripsWithCoordinates = trips.filter(trip => trip.lat && trip.lng);

  // Calculate map center based on trips or use default
  const mapCenter = tripsWithCoordinates.length > 0 
    ? { 
        lat: tripsWithCoordinates[0].lat, 
        lng: tripsWithCoordinates[0].lng 
      }
    : defaultCenter;

  // Determine appropriate zoom level
  const mapZoom = tripsWithCoordinates.length > 0 ? 4 : defaultZoom;

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
              {tripsWithCoordinates.length} trip{tripsWithCoordinates.length !== 1 ? 's' : ''} with coordinates
              {trips.length > tripsWithCoordinates.length && (
                <span className="text-gray-400 ml-2">
                  ({trips.length - tripsWithCoordinates.length} without coordinates)
                </span>
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
          <div 
            className="w-full h-[600px] rounded-lg overflow-hidden"
            style={{ height: '600px' }}
          >
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
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
                     <div className="min-w-[250px] max-w-[300px]">
                       {/* Trip Image */}
                       {trip.imageUrl && (
                         <div className="mb-3">
                           <img 
                             src={trip.imageUrl} 
                             alt={trip.placeName}
                             className="w-full h-32 object-cover rounded-lg"
                             onError={(e) => {
                               e.target.style.display = 'none';
                             }}
                           />
                         </div>
                       )}
                       
                       {/* Trip Title */}
                       <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                         {trip.placeName}
                       </h3>
                       
                       {/* Status Badge */}
                       <div className="flex justify-center mb-3">
                         <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                           trip.status === 'Visited' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-blue-100 text-blue-800'
                         }`}>
                           {trip.status}
                         </span>
                       </div>
                       
                       {/* Trip Details */}
                       <div className="space-y-2 text-sm text-gray-700">
                         <div className="flex items-center gap-2">
                           <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                           <span>
                             <strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                           </span>
                         </div>
                         
                         {trip.description && (
                           <div className="flex items-start gap-2">
                             <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                             </svg>
                             <span>
                               <strong>Description:</strong> {trip.description}
                             </span>
                           </div>
                         )}
                       </div>
                       
                       {/* Action Buttons */}
                       <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                         <button
                           onClick={() => navigate(`/edit-trip/${trip.id}`)}
                           className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                         >
                           Edit Trip
                         </button>
                         <button
                           onClick={() => navigate('/trips')}
                           className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 text-sm font-medium transition-colors"
                         >
                           View Details
                         </button>
                       </div>
                     </div>
                   </Popup>
                 </Marker>
               ))}
              
              {/* Show default marker only if no trips with coordinates */}
              {tripsWithCoordinates.length === 0 && (
                <Marker position={defaultCenter}>
                  <Popup>
                    World Center <br /> No trips with coordinates yet
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
