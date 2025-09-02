import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import TripCard from "../components/TripCard";
import TripDetailModal from "../components/TripDetailModal";

const Trips = () => {
  const { user, logout } = useAuth();
  const { trips, loading, error } = useTrips();
  const navigate = useNavigate();
  
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleOpenModal = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const filteredTrips = statusFilter === 'all' 
    ? trips 
    : trips.filter(trip => trip.status === statusFilter);

  const getStatusCount = (status) => {
    return trips.filter(trip => trip.status === status).length;
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">
              {trips.length} trip{trips.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/add-trip')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add New Trip
            </button>
            <button
              onClick={() => navigate('/map')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              View Map
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({trips.length})
            </button>
            <button
              onClick={() => setStatusFilter('Future Trip')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'Future Trip'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Future Trips ({getStatusCount('Future Trip')})
            </button>
            <button
              onClick={() => setStatusFilter('Visited')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'Visited'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Visited ({getStatusCount('Visited')})
            </button>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No trips yet' : `No ${statusFilter.toLowerCase()} trips`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? 'Start planning your next adventure by adding a new trip!'
                : `You haven't marked any trips as ${statusFilter.toLowerCase()} yet.`
              }
            </p>
            {statusFilter === 'all' && (
              <button
                onClick={() => navigate('/add-trip')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trip Detail Modal */}
      <TripDetailModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Trips;