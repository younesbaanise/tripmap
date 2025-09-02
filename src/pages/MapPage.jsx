import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { useTrips } from '../contexts/TripContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {trip.placeName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Status:</strong> {trip.status}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      {trip.description && (
                        <p className="text-sm text-gray-600">
                          <strong>Description:</strong> {trip.description}
                        </p>
                      )}
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
