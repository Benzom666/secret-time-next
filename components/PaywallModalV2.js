import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/paywall-modal-v2.module.scss";

export default function PaywallModalV2({ isOpen, onClose, onViewPlans }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(100);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const endTime = Date.now() + (48 * 60 * 60 * 1000); // 48 hours from now
    
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = endTime - now;
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setProgress(0);
        return;
      }
      
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
      
      // Calculate progress (48 hours = 100%)
      const totalSeconds = 48 * 60 * 60;
      const remainingSeconds = distance / 1000;
      setProgress((remainingSeconds / totalSeconds) * 100);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleViewPlans = () => {
    if (onViewPlans) {
      onViewPlans();
    } else {
      router.push("/membership-plans");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Modal */}
      <div className={styles.modal}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div className={styles.content}>
          {/* Intro Section */}
          <div className={styles.intro}>
            <h1 className={styles.title}>
              She's offering a first date! Don't miss it.
            </h1>
            <p className={styles.description}>
              She's real, verified, and driven. Her goals <span className={styles.underline}>deserve men who value them</span>.
            </p>
          </div>

          {/* Offer Section */}
          <div className={styles.offer}>
            <h2 className={styles.offerTitle}>
              50% Off All Plans.<br />
              Limited-Time Only
            </h2>
            
            <div className={styles.timeInfo}>
              <div className={styles.timeFrame}>
                <span className={styles.timeLabel}>Exclusive offer ends in</span>
                <span className={styles.timeValue}>
                  {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.cta}>
            <button className={styles.ctaButton} onClick={handleViewPlans}>
              VIEW MEMBERSHIP PLANS
            </button>
            <p className={styles.disclaimer}>
              This plan is only available for a limited time. No hidden fees or strings attached you can cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

