import React, { useState } from 'react';
import { type Card } from '../../card_Interface/card';
import styles from '../../stylesheets/TopUp.module.css';

const QUICK_AMOUNTS = [50, 100, 200, 300, 500, 1000];

interface AmountPanelProps {
  selectedCard: Card | null;
  currentBalance: number;
  onTopUp: (amount: number) => Promise<void>;
}

export const AmountPanel: React.FC<AmountPanelProps> = ({
  selectedCard,
  currentBalance,
  onTopUp,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [activeQuick, setActiveQuick] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValid = selectedCard !== null && !isNaN(parsedAmount) && parsedAmount >= 10;

  function handleQuickAmount(value: number) {
    setAmount(String(value));
    setActiveQuick(value);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
    setActiveQuick(null);
  }

  async function handleTopUp() {
    if (!isValid) return;
    setLoading(true);
    try {
      await onTopUp(parsedAmount);
      setSucceeded(true);
      setTimeout(() => {
        setSucceeded(false);
        setAmount('');
        setActiveQuick(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const newBalance = isValid ? currentBalance + parsedAmount : null;

  return (
    <div className={styles.rightPanel}>
      <div>
        <p className={styles.sectionLabel}>Amount</p>

        <div className={styles.amountCard}>
          <p className={styles.amountLabel}>
            {selectedCard
              ? `Charging ${selectedCard.brand} •••• ${selectedCard.last4}`
              : 'Select a card to continue'}
          </p>

          <div className={styles.amountInputWrap}>
            <span className={styles.currencyTag}>ZAR</span>
            <input
              className={styles.amountInput}
              type="number"
              id="amount-input"
              placeholder="0.00"
              disabled={!selectedCard}
              min={10}
              max={5000}
              value={amount}
              onChange={handleAmountChange}
              aria-label="Top-up amount in ZAR"
            />
          </div>

          <div className={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                className={`${styles.quickAmt} ${activeQuick === val ? styles.quickAmtActive : ''}`}
                onClick={() => handleQuickAmount(val)}
                disabled={!selectedCard}
                type="button"
                aria-pressed={activeQuick === val}
              >
                R{val}
              </button>
            ))}
          </div>

          <button
            className={`${styles.topupBtn} ${succeeded ? styles.topupBtnSuccess : ''}`}
            disabled={!isValid || loading || succeeded}
            onClick={handleTopUp}
            type="button"
          >
            {loading ? (
              <>
                <i className={`ti ti-loader-2 ${styles.spin}`} aria-hidden="true" />
                Processing…
              </>
            ) : succeeded ? (
              <>
                <i className="ti ti-check" aria-hidden="true" />
                Success!
              </>
            ) : (
              <>
                <i className="ti ti-bolt" aria-hidden="true" />
                Top Up
              </>
            )}
          </button>

          <p className={styles.hint}>
            <i className="ti ti-shield-check" aria-hidden="true" />
            Secured by KuduWallet
          </p>
        </div>
      </div>

      {/* Transaction summary — only shown when card + valid amount are set */}
      {isValid && newBalance !== null && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Card</span>
            <span className={styles.summaryVal}>
              {selectedCard!.brand} ••{selectedCard!.last4}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Amount</span>
            <span className={styles.summaryVal}>R {parsedAmount.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Current balance</span>
            <span className={styles.summaryVal}>R {currentBalance.toFixed(2)}</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryRow}>
            <span className={`${styles.summaryKey} ${styles.summaryKeyBold}`}>New balance</span>
            <span className={`${styles.summaryVal} ${styles.summaryValGreen}`}>
              R {newBalance.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
