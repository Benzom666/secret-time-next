import React, { useMemo, useState } from "react";
import styles from "../styles/mens-token-topup-modal.module.scss";

const PLANS = [
  {
    id: "interested",
    title: "Interested",
    subtitle: "Show You're Committed",
    price: 2,
    description: [
      "Get a standard placement",
      "Showing her you’re a gentleman",
    ],
  },
  {
    id: "super-interested",
    title: "Super Interested",
    subtitle: "Supercharge Your Presence",
    price: 4,
    description: [
      "Priority visibility on her feed",
      "3× more responses",
      "Show her you’re a man of means",
    ],
  },
];

const MIN_PURCHASE_USD = 25;

export default function MensTokenTopUpModal({
  isOpen,
  onClose,
  onCheckout,
  initialQuantities = { interested: 0, "super-interested": 0 },
}) {
  const [quantities, setQuantities] = useState(initialQuantities);

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

  const meetsMinimum = totals.amount >= MIN_PURCHASE_USD || totals.amount === 0;

  const handleAdjust = (planId, delta) => {
    setQuantities((prev) => {
      const current = prev[planId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [planId]: next };
    });
  };

  const handleCheckout = () => {
    if (!meetsMinimum && totals.amount > 0) return;
    if (onCheckout) {
      onCheckout({ totals, quantities });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M13.875 4.125L4.125 13.875M4.125 4.125L13.875 13.875"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.cards}>
          {PLANS.map((plan) => {
            const quantity = quantities[plan.id] ?? 0;
            const subtotal = quantity * plan.price;
            const isSuper = plan.id === "super-interested";

            return (
              <div key={plan.id} className={`${styles.card} ${isSuper ? styles.cardSuper : ""}`}>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <div className={styles.ribbon} aria-hidden="true" />
                    <h2 className={`${styles.title} ${isSuper ? styles.titleSuper : ""}`}>
                      {plan.title}
                    </h2>
                    <p className={styles.subtitle}>{plan.subtitle}</p>
                    <span className={styles.price}>${plan.price}/message</span>
                  </div>

                  <div className={styles.counterRow}>
                    <button
                      type="button"
                      className={styles.counterButton}
                      onClick={() => handleAdjust(plan.id, -1)}
                      aria-label={`Decrease ${plan.title} quantity`}
                    >
                      –
                    </button>
                    <span className={styles.counterValue}>{quantity}</span>
                    <button
                      type="button"
                      className={styles.counterButton}
                      onClick={() => handleAdjust(plan.id, 1)}
                      aria-label={`Increase ${plan.title} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.features}>
                    {plan.description.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.subtotalValue}>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <p className={styles.minimumNote}>*Min purchase of ${MIN_PURCHASE_USD}</p>
          <button
            type="button"
            className={`${styles.checkoutButton} ${
              totals.amount === 0 ? styles.checkoutDisabled : ""
            } ${!meetsMinimum && totals.amount > 0 ? styles.checkoutWarning : ""}`}
            onClick={handleCheckout}
            disabled={totals.amount === 0}
          >
            {totals.amount === 0
              ? "($0) Proceed to Checkout"
              : `($${totals.amount.toFixed(2)}) Proceed to Checkout`}
          </button>
        </div>
      </div>
    </>
  );
}
