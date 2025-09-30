"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { 
  FiHome,
  FiCreditCard,
  FiBriefcase
} from "react-icons/fi";
import { Receipt, Building2, BarChart3 } from "lucide-react";

const FloatingActionMenu = ({ options, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Updated options with matching icons
  const menuOptions = options.map(option => {
    let IconComponent;
    switch(option.label) {
      case "Dashboard":
        IconComponent = <FiHome className="w-3 h-3" />;
        break;
      case "Purchase Orders":
        IconComponent = <Receipt className="w-3 h-3" />;
        break;
      case "Companies":
        IconComponent = <Building2 className="w-3 h-3" />;
        break;
      case "Projects":
        IconComponent = <FiBriefcase className="w-3 h-3" />;
        break;
      case "Payments":
        IconComponent = <FiCreditCard className="w-3 h-3" />;
        break;
      case "Reports":
        IconComponent = <BarChart3 className="w-3 h-3" />;
        break;
      default:
        IconComponent = option.Icon;
    }
    return {
      ...option,
      Icon: IconComponent
    };
  });

  return (
    <div className={cn("fixed bottom-5 right-5 z-50", className)}>
      <Button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary text-white shadow-lg"
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
            initial={{ opacity: 0, x: 10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10, y: 10 }}
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
                    className="flex items-center gap-2 bg-primary text-white shadow-md text-xs min-w-[120px]"
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