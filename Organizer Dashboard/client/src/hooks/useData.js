"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchEvents = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await apiClient.get("/events");
      setEvents(data.data || []);
    } catch (err) {
      setError(err.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated]);

  const createEvent = async (eventData) => {
    const data = await apiClient.post("/events", eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEvents((current) => [...current, data.data]);
    return data.data;
  };

  const updateEvent = async (eventId, eventData) => {
    const data = await apiClient.put(`/events/${eventId}`, eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEvents((current) => current.map((event) => (event._id === eventId ? data.data : event)));
    return data.data;
  };

  const deleteEvent = async (eventId) => {
    await apiClient.delete(`/events/${eventId}`);
    setEvents((current) => current.filter((event) => event._id !== eventId));
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

export function useAnalytics(eventId = null) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const endpoint = eventId ? `/analytics/overview?eventId=${eventId}` : "/analytics/overview";
        const data = await apiClient.get(endpoint);
        setAnalytics(data.data);
      } catch (err) {
        setError(err.message || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  return { analytics, loading, error };
}

export function useBookings(eventId = null) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const endpoint = eventId ? `/bookings/event/${eventId}` : "/bookings/my-bookings";
        const data = await apiClient.get(endpoint);
        setBookings(data.data || []);
      } catch (err) {
        setError(err.message || "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);

  return { bookings, loading, error };
}

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get("/auth/me");
        setProfile(data.data);
      } catch (err) {
        setError(err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (profileData) => {
    const data = await apiClient.put("/users/profile", profileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(data.data);
    return data.data;
  };

  return { profile, loading, error, updateProfile };
}
