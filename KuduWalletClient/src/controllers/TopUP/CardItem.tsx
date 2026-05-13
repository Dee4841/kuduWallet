import React from 'react';
import { type Card } from '../../card_Interface/card';
import styles from '../../stylesheets/TopUp.module.css';

interface CardItemProps {
  card: Card;
  selected: boolean;
  onSelect: (id: string) => void;
}

const CHIP_CLASS: Record<string, string> = {
  VISA: styles.chipVisa,
  MC:   styles.chipMc,
  AMEX: styles.chipAmex,
  CARD: styles.chipCard,
};

export const CardItem: React.FC<CardItemProps> = ({ card, selected, onSelect }) => {
  return (
    <div
      className={`${styles.cardItem} ${selected ? styles.cardItemSelected : ''}`}
      onClick={() => onSelect(card.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(card.id)}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${card.brand} card ending in ${card.last4}`}
    >
      <div className={`${styles.cardChip} ${CHIP_CLASS[card.brand] ?? styles.chipCard}`}>
        {card.brand}
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>{card.name}</p>
        <p className={styles.cardNumber}>
          •••• •••• •••• {card.last4}&nbsp;&nbsp;·&nbsp;&nbsp;Exp {card.expiry}
        </p>
      </div>

      {selected && (
        <div className={styles.cardCheck} aria-hidden="true">
          <i className="ti ti-check" />
        </div>
      )}
    </div>
  );
};
