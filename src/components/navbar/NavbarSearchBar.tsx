
import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useNavigate } from "react-router-dom";

export const NavbarSearchBar = () => {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="hidden md:flex lg:flex items-center h-12 lg:h-14 rounded-full border border-gray-200 px-5 py-2 bg-white/95 shadow-md transition-all border-gray-300 hover:shadow-lg">
      <input
        type="text"
        placeholder="Rechercher"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-4 lg:pl-5 pr-3 text-gray-600 text-base lg:text-lg bg-transparent border-none outline-none w-32 lg:w-40"
      />
      <motion.button 
        type="submit"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="ml-3 h-10 w-10 lg:h-11 lg:w-11 flex items-center justify-center rounded-full text-white cursor-pointer shadow-sm"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <Search className="h-5 w-5" />
      </motion.button>
    </form>
  );
};
