import { createContext, useContext, useState, useEffect } from "react";
import {
  ref,
  push,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const TripContext = createContext();

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch trips for the current user
  const fetchTrips = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const tripsRef = ref(db, `trips/${user.uid}`);
      const snapshot = await get(tripsRef);

      if (snapshot.exists()) {
        const tripsData = [];
        snapshot.forEach((childSnapshot) => {
          tripsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setTrips(tripsData);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  // Add a new trip
  const addTrip = async (tripData) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const tripsRef = ref(db, `trips/${user.uid}`);
      const newTripRef = await push(tripsRef, {
        ...tripData,
        createdAt: Date.now(),
        userId: user.uid,
      });

      const newTrip = {
        id: newTripRef.key,
        ...tripData,
        createdAt: Date.now(),
        userId: user.uid,
      };

      setTrips((prev) => [...prev, newTrip]);
      return newTrip;
    } catch (err) {
      console.error("Error adding trip:", err);
      setError("Failed to add trip");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing trip
  const updateTrip = async (tripId, updatedData) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const tripRef = ref(db, `trips/${user.uid}/${tripId}`);
      await update(tripRef, {
        ...updatedData,
        updatedAt: Date.now(),
      });

      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId
            ? { ...trip, ...updatedData, updatedAt: Date.now() }
            : trip
        )
      );

      return { id: tripId, ...updatedData };
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Failed to update trip");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a trip
  const deleteTrip = async (tripId) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const tripRef = ref(db, `trips/${user.uid}/${tripId}`);
      await remove(tripRef);

      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Failed to delete trip");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific trip by ID
  const getTrip = (tripId) => {
    return trips.find((trip) => trip.id === tripId);
  };

  // Filter trips by status
  const getTripsByStatus = (status) => {
    return trips.filter((trip) => trip.status === status);
  };

  // Clear error
  const clearError = () => setError(null);

  useEffect(() => {
    if (user) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [user]);

  const value = {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    getTrip,
    getTripsByStatus,
    fetchTrips,
    clearError,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
