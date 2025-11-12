import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/ladies-not-live-yet-modal.module.scss";

/**
 * Ladies Not Live Yet Modal - Figma node 2697-1518
 * Shows when a lady skips creating a date
 * Prompts her to create her first date
 */
function LadiesNotLiveYetModal({ isOpen, onClose, onCreateDate }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateDate = (e) => {
    e.stopPropagation();
    if (onCreateDate) {
      onCreateDate();
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
              You Are Not Live Yet.
            </h1>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.text}>
              You're seeing other women's dates for style, pricing, and inspiration. Our community attracts high-status men who value privacy; they appear after they message you.
            </p>
          </div>
        </div>

        {/* Offer Section */}
        <div className={styles.offerSection}>
          <div className={styles.offerTextContainer}>
            <p className={styles.offerText}>
              Post your date so men can discover you first.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <button className={styles.ctaButton} onClick={handleCreateDate}>
            <p>CREATE YOUR DATE</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to ensure it's outside of any parent containers
  return createPortal(modalContent, document.body);
}

export default LadiesNotLiveYetModal;

