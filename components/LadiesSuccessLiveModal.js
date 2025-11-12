import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/ladies-success-live-modal.module.scss";

/**
 * Ladies Success Live Modal - Figma node 2697-1595
 * Shows when a lady creates a date and posts it
 * Celebrates her going live
 */
function LadiesSuccessLiveModal({ isOpen, onClose, onGotIt }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "";
      document.body.style.position = "";
      return;
    }

    // Prevent body scroll when modal is open (mobile-friendly)
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    // Prevent iOS Safari bounce
    document.body.style.touchAction = "none";

    return () => {
      // Restore body scroll when modal is closed
      const bodyTop = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      if (bodyTop) {
        window.scrollTo(0, parseInt(bodyTop || "0") * -1);
      }
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGotIt = (e) => {
    e.stopPropagation();
    if (onGotIt) {
      onGotIt();
    } else {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Intro Section */}
        <div className={styles.introSection}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              Success. You're live!
            </h1>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.text}>
              Gentleman's profiles remain private until they message you. Our community attracts high-status men who value privacy.
            </p>
          </div>
        </div>

        {/* Offer Section */}
        <div className={styles.offerSection}>
          <div className={styles.offerTextContainer}>
            <p className={styles.offerText}>
              While you wait, explore other women's dates for style, pricing, and inspiration.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <button className={styles.ctaButton} onClick={handleGotIt}>
            <p>OK, GOT IT!</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to ensure it's outside of any parent containers
  return createPortal(modalContent, document.body);
}

export default LadiesSuccessLiveModal;

