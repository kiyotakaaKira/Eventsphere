import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("authToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;

export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  events: {
    list: "/events",
    create: "/events",
    getById: (id) => `/events/${id}`,
    myEvents: "/events/dashboard/my-events",
    update: (id) => `/events/${id}`,
    delete: (id) => `/events/${id}`,
    cancel: (id) => `/events/${id}/cancel`,
    toggleRegistration: (id) => `/events/${id}/toggle-registration`,
  },
  bookings: {
    eventBookings: (eventId) => `/bookings/event/${eventId}`,
    myBookings: "/bookings/my-bookings",
    create: "/bookings",
    verifyPayment: "/bookings/verify-payment",
  },
  checkin: {
    submit: "/checkin",
    stats: (eventId) => `/checkin/stats/${eventId}`,
    list: (eventId) => `/checkin/list/${eventId}`,
  },
  analytics: {
    overview: "/analytics/overview",
    revenue: "/analytics/revenue",
    registrations: "/analytics/registrations",
    recentActivity: "/analytics/recent-activity",
  },
  users: {
    profile: "/users/profile",
    update: "/users/profile",
  },
};
