export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatDateOnly = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const getEventStatusColor = (status) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    live: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    completed: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return statusColors[status] || statusColors.draft;
};

export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    refunded: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };
  return colors[status] || colors.pending;
};

export const eventStatuses = ["draft", "upcoming", "live", "completed", "cancelled"];

export const ticketTypes = ["standard", "vip", "early-bird"];

export const generateRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
