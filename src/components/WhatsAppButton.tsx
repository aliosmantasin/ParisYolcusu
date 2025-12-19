"use client";

import React, { useState } from 'react';
import { MdOutlineWhatsapp } from 'react-icons/md';
import { WhatsAppBotProtection } from './WhatsAppBotProtection';

const WhatsAppButton = () => {
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const whatsappUrl = "https://wa.me/33651150547?text=Merhabalar%20Paris%20Yolcusu%20web%20sitesinden%20iletişime%20geçiyorum..";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if already verified in this session
    const verified = sessionStorage.getItem("whatsapp_verified");
    if (verified === "true") {
      window.open(whatsappUrl, "_blank");
    } else {
      setShowRecaptcha(true);
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}>
        <button
          type="button"
          onClick={handleClick}
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="WhatsApp iletişim"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#25D366',
            borderRadius: '50%',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
          }}
        >
          {/* WhatsApp ikonu */}
          <MdOutlineWhatsapp 
            className="relative z-10 text-white"
            style={{
              width: '36px',
              height: '36px',
            }}
          />
        </button>
      </div>

      {/* WhatsApp Bot Protection Modal */}
      {showRecaptcha && (
        <WhatsAppBotProtection
          whatsappUrl={whatsappUrl}
          onVerified={() => {
            setShowRecaptcha(false);
          }}
          onClose={() => {
            setShowRecaptcha(false);
          }}
        />
      )}
    </>
  );
};

export default WhatsAppButton;
