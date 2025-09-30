"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Home, Receipt, CreditCard, BarChart3, Building2, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingActionMenu = ({ options, className, activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Default options if none provided
  const defaultOptions = [
    {
      label: "Dashboard",
      Icon: <Home className="w-4 h-4" />,
      onClick: () => setActiveSection("dashboard"),
    },
    {
      label: "Purchase Orders", 
      Icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveSection("expenses-view"),
    },
    {
      label: "Payments",
      Icon: <CreditCard className="w-4 h-4" />,
      onClick: () => setActiveSection("payments"),
    },
    {
      label: "Projects",
      Icon: <FolderPlus className="w-4 h-4" />,
      onClick: () => setActiveSection("projects-view"),
    },
    {
      label: "Companies",
      Icon: <Building2 className="w-4 h-4" />,
      onClick: () => setActiveSection("companies"),
    },
    {
      label: "Reports",
      Icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveSection("reports-company"),
    },
  ];

  const menuOptions = options || defaultOptions;

  return (
    <div className={cn("fixed bottom-5 right-5 z-50", className)}>
      <Button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(100px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(100px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute bottom-16 right-0 mb-2"
          >
            <div className="flex flex-col items-end gap-2">
              {menuOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={() => {
                      option.onClick();
                      setIsOpen(false);
                    }}
                    size="sm"
                    className="flex items-center gap-2 bg-white/95 shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-white/20 rounded-lg backdrop-blur-[100px] text-gray-700 min-w-[140px] hover:bg-white hover:shadow-lg transition-all duration-200"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;