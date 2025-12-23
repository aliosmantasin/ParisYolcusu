"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useWhatsAppWidget } from "./WhatsAppContext";

export default function WhatsAppIcon() {
  const { toggle } = useWhatsAppWidget();

  return (
    <div
      className="fixed right-4 bottom-20 z-[99999]"
      style={{ 
        position: 'fixed',
        right: '16px',
        bottom: '20px',
        zIndex: 99999
      }}
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping"></div>
      
      <button
        onClick={toggle}
        aria-label="WhatsApp"
        className="relative p-3 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all"
        style={{ backgroundColor: '#25D366' }}
      >
        <FaWhatsapp size={32} />
      </button>
    </div>
  );
}
