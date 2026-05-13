import React from 'react';
import { type Card } from '../../card_Interface/card';
import { CardItem } from './CardItem';
import styles from '../../stylesheets/TopUp.module.css';

interface CardListProps {
  cards: Card[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddCard: () => void;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  selectedId,
  onSelect,
  onAddCard,
}) => {
  return (
    <div>
      <p className={styles.sectionLabel}>Your cards</p>

      <div className={styles.cardList}>
        {cards.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="ti ti-credit-card-off" aria-hidden="true" />
            </div>
            <p className={styles.emptyText}>No cards yet. Add one below.</p>
          </div>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              selected={selectedId === card.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      <button className={styles.addCardBtn} onClick={onAddCard} type="button">
        <i className="ti ti-plus" aria-hidden="true" />
        Add new card
      </button>
    </div>
  );
};
