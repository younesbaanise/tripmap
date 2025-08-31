import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

const Trips = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Trips;