"use client"
import { FaWhatsapp } from 'react-icons/fa';

const CTASection = () => {
  const handleWhatsAppClick = () => {
    // WhatsApp numarasını buraya ekleyin
    const phoneNumber = '905555555555';
    const message = 'Merhaba, Paris gezi turları hakkında bilgi almak istiyorum.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-[#067481] dark:bg-black p-5 sm:p-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white ">Özel Paris Gezi Turu Paketi</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white dark:text-slate-400">
          Profesyonel rehber, özel şoför ve özelleştirilmiş rota ile unutulmaz bir Paris deneyimi yaşayın.
          Hemen rezervasyon yaparak rotanızı belirleyin! &#128522;
        </p>
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 dark:bg-green-900 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center mx-auto gap-2 transition-colors duration-1200 animate-pulse"
        >
          <FaWhatsapp className="text-2xl" />
          <span>WhatsApp ile İletişime Geçin</span>
        </button>
      </div>
    </section>
  );
};

export default CTASection; 