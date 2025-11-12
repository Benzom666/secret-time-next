import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import styles from "../styles/standalone-paywall-modal.module.scss";

/**
 * Standalone Paywall Modal - Figma node 2697-1781
 * Shows promotional offer with countdown and CTA
 * Matches Figma design exactly with SVG assets
 */
const CloseButtonSvg = "/assets/paywall/close-button.svg";
const ProgressBarBackgroundSvg = "/assets/paywall/line-2.svg";
const ProgressBarForegroundSvg = "/assets/paywall/line-3-blur.svg";

function StandalonePaywallModal({ isOpen, onClose, onViewPlans }) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(48 * 3600); // 48 hours
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours`;
  };

  // Calculate progress percentage (48 hours = 100%)
  // Line 3 (blur).svg is 262px wide, container is 305px
  // So we scale the foreground width based on progress
  const progressPercentage = (timeRemaining / (48 * 3600)) * 100;
  const foregroundWidth = (progressPercentage / 100) * 262; // 262px is the max width of Line 3 (blur).svg

  const handleViewPlans = () => {
    if (onViewPlans) {
      onViewPlans();
    } else {
      router.push("/membership-plans");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button - SVG asset */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <img
            src={CloseButtonSvg}
            alt="Close"
            width={24}
            height={24}
            className={styles.closeButtonIcon}
          />
        </button>

        {/* Content */}
        <div className={styles.content}>
          {/* Intro Section */}
          <div className={styles.introSection}>
            <h1 className={styles.mainHeading}>
              She's offering a first date! Don't miss it.
            </h1>

            <p className={styles.subtitle}>
              She's real, verified, and driven. Her goals{' '}
              <span className={styles.underline}>deserve men who value them</span>.
            </p>
          </div>

          {/* Offer Section */}
          <div className={styles.offerSection}>
            <div className={styles.offerTextContainer}>
              <h2 className={styles.offerText}>50% Off All Plans.</h2>
              <h3 className={styles.limitedText}>Limited-Time Only</h3>
            </div>

            <div className={styles.countdownSection}>
              <div className={styles.countdownText}>
                <span className={styles.countdownLabel}>Exclusive offer ends in</span>
                <span className={styles.countdownValue}> {formatTime(timeRemaining)}</span>
              </div>
              <div className={styles.progressBarContainer}>
                {/* Progress Bar Background - Line 2.svg */}
                <img
                  src={ProgressBarBackgroundSvg}
                  alt="Progress bar background"
                  className={styles.progressBarBackground}
                />
                {/* Progress Bar Foreground - Line 3 (blur).svg */}
                <div 
                  className={styles.progressBarForeground}
                  style={{ 
                    width: `${foregroundWidth}px`,
                    maxWidth: '262px'
                  }}
                >
                  <img
                    src={ProgressBarForegroundSvg}
                    alt="Progress bar foreground"
                    className={styles.progressBarForegroundImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <button className={styles.ctaButton} onClick={handleViewPlans}>
              VIEW MEMBERSHIP PLANS
            </button>

            <p className={styles.disclaimer}>
              This plan is only available for a limited time. No hidden fees or strings
              attached you can cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to ensure it's outside of any parent containers
  return createPortal(modalContent, document.body);
}

export default StandalonePaywallModal;

