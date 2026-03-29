"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

/**
 * Format phone number to WhatsApp format (international format without + or dashes)
 * Supports formats: +62-812-xxx, 0812xxx, +62812xxx, 62812xxx
 * Returns format: 62812xxx (for Indonesia)
 */
const formatPhoneNumber = (phone: string): string => {
  // Remove all spaces and dashes
  let formatted = phone.replace(/[\s\-()]/g, "");

  // Remove leading + if present
  if (formatted.startsWith("+")) {
    formatted = formatted.substring(1);
  }

  // If starts with 0 (Indonesian format), replace with 62
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substring(1);
  }

  return formatted;
};

const WhatsAppButton = ({
  phoneNumber = "62812345678",
  message = "Halo, saya ingin bertanya tentang produk Anda.",
}: WhatsAppButtonProps) => {
  const openWhatsApp = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${formattedPhone}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return (
    <button
      onClick={openWhatsApp}
      className="w-full bg-foreground text-background text-sm p-4 rounded-full shadow-lg hover:bg-foreground/90 cursor-pointer transition-colors font-medium"
      aria-label="Hubungi kami via WhatsApp"
    >
      <MessageCircle className="inline-block mr-2" size={20} />
      Hubungi via WhatsApp
    </button>
  );
};

export default WhatsAppButton;
