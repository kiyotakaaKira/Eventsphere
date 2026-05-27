"use client";

import { useState } from "react";
import { Menu, Moon, Sun, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function TopNavbar({ onMenuClick }) {
  const [darkMode, setDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left Section - Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 w-40"
            />
          </div>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification */}
          <motion.button
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            {hasNotifications && (
              <motion.span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </motion.button>

          {/* Profile Avatar */}
          <motion.button
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-semibold flex items-center justify-center hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            A
          </motion.button>
        </div>
      </div>
    </header>
  );
}
