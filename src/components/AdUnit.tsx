import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ADSENSE_CLIENT = "ca-pub-2311108731423361";

type AdUnitProps = {
  /** AdSense'de oluşturduğun reklam biriminin slot ID'si */
  slot: string;
  format?: string;
  className?: string;
};

export function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const pushed = useRef(false);
  const validSlot = /^\d+$/.test(slot) && !/^0+$/.test(slot);

  useEffect(() => {
    if (pushed.current || !validSlot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("AdSense yüklenemedi:", err);
    }
  }, [validSlot]);

  if (!validSlot) return null;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
