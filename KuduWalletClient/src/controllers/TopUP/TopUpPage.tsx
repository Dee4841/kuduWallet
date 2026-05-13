import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardList } from './CardList';
import { AmountPanel } from './AmountPanel';
import { AddCardModal } from './AddCardModal';
import { type Card,type AddCardFormValues } from '../../card_Interface/card';
import styles from '../../stylesheets/TopUp.module.css';

import { detectBrand } from './cardUtils';

//Getting cards

const MOCK_CARDS: Card[] = [

];

//Add cards

function useCards() {
  const [cards, setCards] = useState<Card[]>(MOCK_CARDS);

  function addCard(values: AddCardFormValues): Card {
    const digits = values.number.replace(/\D/g, '');
    const newCard: Card = {
      id: crypto.randomUUID(),
      brand: detectBrand(digits),
      name: values.name.trim(),
      last4: digits.slice(-4),
      expiry: values.expiry,
    };
    setCards((prev) => [...prev, newCard]);
    return newCard;
  }

  return { cards, addCard };
}

// TODO: replace with real balance from wallet context / API (GET /api/wallet/balance)
const MOCK_BALANCE = 245.0;

export const TopUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { cards, addCard } = useCards();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [balance, setBalance] = useState(MOCK_BALANCE);

  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null;



  function handleSelectCard(id: string) {
    setSelectedCardId((prev) => (prev === id ? null : id));
  }

  function handleAddCard(values: AddCardFormValues) {
    const newCard = addCard(values);
    setModalOpen(false);
    setSelectedCardId(newCard.id);
  }

  const handleTopUp = useCallback(
    async (amount: number): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setBalance((prev) => prev + amount);
          setSelectedCardId(null);
          resolve();
        }, 1800);
      });
    },
    []
  );

  return (
    <div className={styles.root}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")} type="button">
          <i className="ti ti-arrow-left" aria-hidden="true" />
          Back
        </button>
        <span className={styles.pageTitle}>Top Up Wallet</span>
      </div>

      {/* Two-column layout */}
      <main className={styles.layout}>
        <CardList
          cards={cards}
          selectedId={selectedCardId}
          onSelect={handleSelectCard}
          onAddCard={() => setModalOpen(true)}
        />

        <AmountPanel
          selectedCard={selectedCard}
          currentBalance={balance}
          onTopUp={handleTopUp}
        />
      </main>

      {/* Add card modal */}
      <AddCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddCard}
      />

    </div>
  );
};
