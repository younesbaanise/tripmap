import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import TripCard from "../components/TripCard";
import TripDetailModal from "../components/TripDetailModal";
import {
  FaPlus,
  FaMap,
  FaSignOutAlt,
  FaFilter,
  FaGlobeAmericas,
  FaCalendarAlt,
  FaRoute,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import tripmapLogo from "../assets/tripmap-logo.png";

// Fallback for mobile/tablet compatibility
const logoPath = tripmapLogo || "/src/assets/tripmap-logo.png";

const Trips = () => {
  const { user, logout } = useAuth();
  const { trips, loading, error } = useTrips();
  const navigate = useNavigate();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Filter trips based on status and search query
  const filteredTrips = trips.filter((trip) => {
    const matchesStatus =
      statusFilter === "all" || trip.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      trip.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status) => {
    return trips.filter((trip) => trip.status === status).length;
  };

  if (loading && trips.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto mb-4"></div>
          <p className="text-[#6B6B70]">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F5F3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#FF5E5B] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00BFA6] text-white px-4 py-2 rounded-md hover:bg-[#00BFA6]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      {/* Fascinating Responsive Navbar */}
      <nav className="bg-white shadow-lg border-b border-[#DADADA] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <img
                  src={logoPath}
                  alt="TripMap Logo"
                  className="w-10 h-10 object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "/src/assets/tripmap-logo.png";
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#2D2D34]">TripMap</h1>
                <p className="text-xs text-[#6B6B70]">Your Travel Companion</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/add-trip")}
                className="flex items-center space-x-2 bg-[#FF5E5B] text-white px-4 py-2 rounded-lg hover:bg-[#FF5E5B]/90 transition-all duration-200 transform hover:scale-105 shadow-md cursor-pointer"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Trip</span>
              </button>
              <button
                onClick={() => navigate("/map")}
                className="flex items-center space-x-2 bg-[#00BFA6] text-white px-4 py-2 rounded-lg hover:bg-[#00BFA6]/90 transition-all duration-200 transform hover:scale-105 shadow-md cursor-pointer"
              >
                <FaMap className="w-4 h-4" />
                <span>View Map</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 border border-[#DADADA] text-[#2D2D34] rounded-lg hover:bg-[#F6F5F3] transition-all duration-200 cursor-pointer"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#2D2D34] hover:text-[#6B6B70] focus:outline-none focus:text-[#6B6B70] transition-colors duration-200 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#DADADA]">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => navigate("/add-trip")}
                  className="flex items-center space-x-3 bg-[#FF5E5B] text-white px-4 py-3 rounded-lg hover:bg-[#FF5E5B]/90 transition-colors cursor-pointer"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add New Trip</span>
                </button>
                <button
                  onClick={() => navigate("/map")}
                  className="flex items-center space-x-3 bg-[#00BFA6] text-white px-4 py-3 rounded-lg hover:bg-[#00BFA6]/90 transition-colors cursor-pointer"
                >
                  <FaMap className="w-4 h-4" />
                  <span>View Map</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 border border-[#DADADA] text-[#2D2D34] rounded-lg hover:bg-[#F6F5F3] transition-colors cursor-pointer"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2D2D34] mb-3">
            My Travel Adventures
          </h1>
          <p className="text-lg text-[#6B6B70] mb-4">
            {trips.length} trip{trips.length !== 1 ? "s" : ""} in your
            collection
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#DADADA]">
              <div className="flex items-center justify-center space-x-2">
                <FaRoute className="w-5 h-5 text-[#00BFA6]" />
                <span className="text-2xl font-bold text-[#2D2D34]">
                  {trips.length}
                </span>
              </div>
              <p className="text-sm text-[#6B6B70]">Total Trips</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#DADADA]">
              <div className="flex items-center justify-center space-x-2">
                <FaCalendarAlt className="w-5 h-5 text-[#8E6DE9]" />
                <span className="text-2xl font-bold text-[#2D2D34]">
                  {getStatusCount("Future Trip")}
                </span>
              </div>
              <p className="text-sm text-[#6B6B70]">Planned</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#DADADA]">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 bg-[#FF5E5B] rounded-lg">
                  <FaGlobeAmericas className="w-3 h-3 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#2D2D34]">
                  {getStatusCount("Visited")}
                </span>
              </div>
              <p className="text-sm text-[#6B6B70]">Visited</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#DADADA]">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B6B70] w-5 h-5" />
              <input
                type="text"
                placeholder="Search trips by place name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-[#00BFA6] transition-all duration-200 text-[#2D2D34] placeholder-[#6B6B70]"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaFilter className="w-5 h-5 text-[#6B6B70]" />
              <h3 className="text-lg font-semibold text-[#2D2D34]">
                Filter by Status
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#00BFA6] text-white shadow-lg"
                    : "bg-[#F6F5F3] text-[#2D2D34] hover:bg-[#DADADA] border border-[#DADADA]"
                }`}
              >
                All Adventures ({trips.length})
              </button>
              <button
                onClick={() => setStatusFilter("Future Trip")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer ${
                  statusFilter === "Future Trip"
                    ? "bg-[#8E6DE9] text-white shadow-lg"
                    : "bg-[#F6F5F3] text-[#2D2D34] hover:bg-[#DADADA] border border-[#DADADA]"
                }`}
              >
                Future Dreams ({getStatusCount("Future Trip")})
              </button>
              <button
                onClick={() => setStatusFilter("Visited")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer ${
                  statusFilter === "Visited"
                    ? "bg-[#FF5E5B] text-white shadow-lg"
                    : "bg-[#F6F5F3] text-[#2D2D34] hover:bg-[#DADADA] border border-[#DADADA]"
                }`}
              >
                Memories Made ({getStatusCount("Visited")})
              </button>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-[#DADADA]">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00BFA6] to-[#8E6DE9] rounded-full flex items-center justify-center mx-auto mb-6">
                <img
                  src={logoPath}
                  alt="TripMap Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.src = "/src/assets/tripmap-logo.png";
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D34] mb-3">
                {statusFilter === "all"
                  ? "No adventures yet"
                  : `No ${statusFilter.toLowerCase()} adventures`}
              </h3>
              <p className="text-[#6B6B70] mb-6 text-lg">
                {statusFilter === "all"
                  ? "Start planning your next adventure by adding a new trip!"
                  : `You haven't marked any trips as ${statusFilter.toLowerCase()} yet.`}
              </p>
              {statusFilter === "all" && (
                <button
                  onClick={() => navigate("/add-trip")}
                  className="bg-[#FF5E5B] text-white px-8 py-4 rounded-lg hover:bg-[#FF5E5B]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-lg cursor-pointer"
                >
                  Start Your First Adventure
                </button>
              )}
            </div>
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

        {/* Results Summary */}
        {filteredTrips.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-[#6B6B70]">
              Showing {filteredTrips.length} of {trips.length} trips
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
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
