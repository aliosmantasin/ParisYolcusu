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
      // If verified, trigger GTM link click event and open WhatsApp
      openWhatsAppWithGTMTracking();
    } else {
      // If not verified, show ReCAPTCHA modal
      setShowRecaptcha(true);
    }
  };

  // Function to open WhatsApp and trigger GTM tracking
  const openWhatsAppWithGTMTracking = () => {
    // Create a temporary anchor element to trigger GTM's automatic link click detection
    const tempLink = document.createElement('a');
    tempLink.href = whatsappUrl;
    tempLink.target = '_blank';
    tempLink.rel = 'noopener noreferrer';
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    
    // Trigger click event - GTM will automatically detect this as gtm.linkClick
    tempLink.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(tempLink);
    }, 100);
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 40 }}>
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
            // After verification, open WhatsApp with GTM tracking
            openWhatsAppWithGTMTracking();
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

