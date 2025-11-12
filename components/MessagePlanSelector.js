import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "../styles/message-plan-selector.module.scss";

// Assets from Figma
const arrowInterested = "/assets/message-plans/arrow-interested.svg";
const arrowSuperInterested1 = "/assets/message-plans/arrow-interested.svg"; // Using same SVG for both arrows in Super Interested
const arrowSuperInterested2 = "/assets/message-plans/arrow-interested.svg";
const boltYellow = "/assets/message-plans/bolt-yellow.png";
const closeSquare = "/assets/message-plans/close-square.png";
const planOptionsInterested = "/assets/message-plans/plan-options-interested.svg";
const planOptionsSuperInterested = "/assets/message-plans/plan-options-super-interested.svg";

const PLANS = [
  {
    id: "interested",
    title: "Interested",
    subtitle: "Show You're Committed",
    price: 2,
    unit: "message",
    features: [
      "- Get a standard placement",
      "- Showing her you're a gentleman",
    ],
    arrow: arrowInterested,
  },
  {
    id: "super-interested",
    title: "Super Interested",
    subtitle: "Supercharge Your Presence",
    price: 4,
    unit: "message",
    features: [
      "- Priority on her feed. 3x more responses",
      "- Show her you're a man of means",
    ],
    arrow1: arrowSuperInterested1,
    arrow2: arrowSuperInterested2,
    hasBolt: true,
  },
];

const MIN_PURCHASE_USD = 25;

// PlanOptions Component - Using SVG from Figma
function PlanOptions({ property1 = "Super Interested", className = "" }) {
  const isInterested = property1 === "Interested";
  
  return (
    <div 
      id={isInterested ? "node-2697_1810" : "node-2697_1807"} 
      className={`${styles.planOptions} ${className}`}
    >
      <img
        src={isInterested ? planOptionsInterested : planOptionsSuperInterested}
        alt={isInterested ? "Interested" : "Super Interested"}
        className={styles.planOptionsImage}
      />
    </div>
  );
}

export default function MessagePlanSelector({
  isOpen,
  onClose,
  onCheckout,
  initialQuantities = { interested: 0, "super-interested": 0 },
}) {
  const [quantities, setQuantities] = useState(initialQuantities);
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

  const totals = useMemo(() => {
    return PLANS.reduce(
      (acc, plan) => {
        const qty = quantities[plan.id] ?? 0;
        const subtotal = qty * plan.price;
        return {
          quantity: acc.quantity + qty,
          amount: acc.amount + subtotal,
        };
      },
      { quantity: 0, amount: 0 }
    );
  }, [quantities]);

  const updateQuantity = (planId, delta) => {
    setQuantities((prev) => {
      const current = prev[planId] ?? 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [planId]: newValue };
    });
  };

  const handleCheckout = () => {
    if (totals.amount < MIN_PURCHASE_USD) {
      alert(`Minimum purchase of $${MIN_PURCHASE_USD} required`);
      return;
    }
    if (onCheckout) {
      onCheckout({
        quantities,
        total: totals.amount,
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
      data-name="Start"
      data-node-id="2697:1460"
    >
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
          data-name="Close Square"
          data-node-id="2700:239"
        >
          <div className={styles.closeButtonInner}>
            <Image
              src={closeSquare}
              alt="Close"
              width={12}
              height={12}
              layout="fixed"
            />
          </div>
        </button>

        {/* Plans Container */}
        <div 
          className={styles.plansContainer}
          data-name="Plans"
          data-node-id="2697:1470"
        >
          {PLANS.map((plan) => {
            const quantity = quantities[plan.id] ?? 0;
            const isSuperInterested = plan.id === "super-interested";
            const isInterestedPlan = plan.id === "interested";

            return (
              <div 
                key={plan.id} 
                className={styles.planCard}
                data-name={isSuperInterested ? "Super Interested Frame" : "Interested Frame"}
                data-node-id={isSuperInterested ? "2697:1492" : "2697:1471"}
              >
                <div className={styles.cardContent}>
                  {/* Header */}
                  <div 
                    className={styles.planHeader}
                    data-name="Head"
                    data-node-id={isSuperInterested ? "2697:1493" : "2697:1472"}
                  >
                    <div 
                      className={styles.planTitleSection}
                      data-name="Title"
                      data-node-id={isSuperInterested ? "2697:1494" : "2697:1473"}
                    >
                      {/* PlanOptions Component */}
                      <PlanOptions 
                        property1={isInterestedPlan ? "Interested" : "Super Interested"}
                        className={styles.planOptionsWrapper}
                      />

                      {/* Subtitle Section */}
                      <div 
                        className={styles.planSubtitleSection}
                        data-name="Intro"
                        data-node-id={isSuperInterested ? "2697:1496" : "2697:1475"}
                      >
                        <div 
                          className={styles.subtitleContent}
                          data-name="Title"
                          data-node-id={isSuperInterested ? "2697:1497" : "2697:1476"}
                        >
                          {plan.hasBolt && (
                            <div 
                              className={styles.boltIcon}
                              data-name="Bolt yellow"
                              data-node-id="2727:242"
                            >
                              <div className={styles.boltIconInner}>
                                <Image
                                  src={boltYellow}
                                  alt="Bolt"
                                  width={9}
                                  height={13}
                                  layout="fixed"
                                />
                              </div>
                            </div>
                          )}
                          <div 
                            className={styles.planSubtitle}
                            data-node-id={isSuperInterested ? "2707:252" : "2697:1477"}
                          >
                            <p>{plan.subtitle}</p>
                          </div>
                        </div>
                        <div 
                          className={styles.planPrice}
                          data-name="Text"
                          data-node-id={isSuperInterested ? "2697:1500" : "2697:1479"}
                        >
                          <p>${plan.price}/{plan.unit}</p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Graphics */}
                    {isSuperInterested ? (
                      <div 
                        className={styles.arrowContainerSuper}
                        data-name="Arrows"
                        data-node-id="2697:1501"
                      >
                        <div 
                          className={`${styles.arrowWrapper} ${styles.arrowWrapperFirst}`}
                          data-node-id="I2697:1501;2697:1831"
                        >
                          <div className={styles.arrowImageWrapper}>
                            <img
                              src={plan.arrow1}
                              alt="Arrow"
                              className={styles.arrowImage}
                            />
                          </div>
                        </div>
                        <div 
                          className={`${styles.arrowWrapper} ${styles.arrowWrapperLast}`}
                          data-node-id="I2697:1501;2697:1836"
                        >
                          <div className={styles.arrowImageWrapper}>
                            <img
                              src={plan.arrow2}
                              alt="Arrow"
                              className={styles.arrowImage}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={styles.arrowContainer}
                        data-name="Arrows"
                        data-node-id="2697:1480"
                      >
                        <div 
                          className={styles.arrowWrapper}
                          data-node-id="I2697:1480;2697:1847"
                        >
                          <div className={styles.arrowImageWrapper}>
                            <img
                              src={plan.arrow}
                              alt="Arrow"
                              className={styles.arrowImage}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div 
                    className={styles.quantityContainer}
                    data-name="Quantity container"
                    data-node-id={isSuperInterested ? "2697:1502" : "2697:1481"}
                  >
                    <div 
                      className={styles.quantityButton}
                      data-name="Button Minus"
                      data-node-id={isSuperInterested ? "2697:1503" : "2697:1482"}
                    >
                      <button
                        onClick={() => updateQuantity(plan.id, -1)}
                        disabled={quantity === 0}
                        type="button"
                        className={styles.quantityButtonInner}
                      >
                        <p 
                          className={styles.quantitySymbol}
                          data-node-id={isSuperInterested ? "2697:1504" : "2697:1483"}
                        >
                          −
                        </p>
                      </button>
                    </div>
                    <div 
                      className={styles.quantityDisplay}
                      data-name="Total selected"
                      data-node-id={isSuperInterested ? "2697:1505" : "2697:1484"}
                    >
                      <p 
                        className={styles.quantityValue}
                        data-node-id={isSuperInterested ? "2697:1506" : "2697:1485"}
                      >
                        {quantity}
                      </p>
                    </div>
                    <div 
                      className={styles.quantityButton}
                      data-name="Button Plus"
                      data-node-id={isSuperInterested ? "2697:1507" : "2697:1486"}
                    >
                      <button
                        onClick={() => updateQuantity(plan.id, 1)}
                        type="button"
                        className={styles.quantityButtonInner}
                      >
                        <p 
                          className={styles.quantitySymbol}
                          data-node-id={isSuperInterested ? "2697:1508" : "2697:1487"}
                        >
                          +
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Features List */}
                  <div 
                    className={styles.featuresList}
                    data-name="Text"
                    data-node-id={isSuperInterested ? "2697:1509" : "2697:1488"}
                  >
                    <p 
                      className={styles.featureLabel}
                      data-node-id={isSuperInterested ? "2697:1510" : "2697:1489"}
                    >
                      Features:
                    </p>
                    {isSuperInterested ? (
                      <>
                        <p 
                          className={styles.featureSuper1}
                          data-node-id="2697:1511"
                        >
                          <span className={styles.featureRegular}>- Priority on her feed. </span>
                          <span className={styles.featureBold}>3x more responses </span>
                        </p>
                        <p 
                          className={styles.featureSuper2}
                          data-node-id="2697:1512"
                        >
                          <span className={styles.featureRegular}>- Show her </span>
                          <span className={styles.featureBold}>you're a man of means </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p 
                          className={styles.feature}
                          data-node-id="2697:1490"
                        >
                          - Get a standard placement
                        </p>
                        <p 
                          className={styles.feature}
                          data-node-id="2697:1491"
                        >
                          - Showing her you're a gentleman
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Section */}
        <div 
          className={styles.checkoutSection}
          data-name="CTA"
          data-node-id="2697:1513"
        >
          <div 
            className={styles.minPurchase}
            data-name="Text"
            data-node-id="2697:1514"
          >
            <p data-node-id="2697:1515">*Min purchase of ${MIN_PURCHASE_USD}</p>
          </div>
          <div 
            className={styles.checkoutButtonContainer}
            data-name="CTA"
            data-node-id="2697:1516"
          >
            <button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={totals.amount < MIN_PURCHASE_USD}
              type="button"
              data-name="primary cta"
              data-node-id="2697:1517"
            >
              <p data-node-id="I2697:1517;2697:1897">
                (${totals.amount}) PROCEED TO CHECKOUT
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using Portal to ensure it's outside of any parent containers
  return createPortal(modalContent, document.body);
}
