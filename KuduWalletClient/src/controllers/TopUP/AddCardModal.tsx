import React, { useState, useEffect, useRef } from 'react';
import { type AddCardFormValues } from '../../card_Interface/card';
import { detectBrand, formatCardNumber, formatExpiry } from './cardUtils';
import styles from '../../stylesheets/TopUp.module.css';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: AddCardFormValues) => void;
}

const EMPTY_FORM: AddCardFormValues = { name: '', number: '', expiry: '', cvv: '' };

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<AddCardFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<AddCardFormValues>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawDigits = form.number.replace(/\D/g, '');
  const brand = detectBrand(rawDigits);

  function handleChange(field: keyof AddCardFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange('number', formatCardNumber(e.target.value));
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange('expiry', formatExpiry(e.target.value));
  }

  function validate(): boolean {
    const newErrors: Partial<AddCardFormValues> = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (rawDigits.length < 13) newErrors.number = 'Invalid card number';
    if (form.expiry.length < 5) newErrors.expiry = 'Invalid expiry';
    if (form.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave(form);
  }

  const previewNum = form.number || '•••• •••• •••• ••••';
  const previewName = form.name.toUpperCase() || 'YOUR NAME';
  const previewExp = form.expiry || 'MM/YY';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Add new card"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Add card</span>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Live card preview */}
        <div className={styles.cardPreview}>
          <p className={styles.previewBrand}>{brand}</p>
          <p className={styles.previewNum}>{previewNum}</p>
          <div className={styles.previewBottom}>
            <span className={styles.previewName}>{previewName}</span>
            <span className={styles.previewExp}>{previewExp}</span>
          </div>
        </div>

        {/* Form fields */}
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="f-name">Name on card</label>
          <input
            ref={nameRef}
            id="f-name"
            type="text"
            placeholder="e.g. T Ndlovu"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            autoComplete="cc-name"
            className={errors.name ? styles.inputError : ''}
          />
          {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="f-num">Card number</label>
          <input
            id="f-num"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            value={form.number}
            onChange={handleNumberChange}
            autoComplete="cc-number"
            className={errors.number ? styles.inputError : ''}
          />
          {errors.number && <p className={styles.errorMsg}>{errors.number}</p>}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="f-exp">Expiry</label>
            <input
              id="f-exp"
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              value={form.expiry}
              onChange={handleExpiryChange}
              autoComplete="cc-exp"
              className={errors.expiry ? styles.inputError : ''}
            />
            {errors.expiry && <p className={styles.errorMsg}>{errors.expiry}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="f-cvv">CVV</label>
            <input
              id="f-cvv"
              type="password"
              inputMode="numeric"
              placeholder="•••"
              maxLength={4}
              value={form.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              autoComplete="cc-csc"
              className={errors.cvv ? styles.inputError : ''}
            />
            {errors.cvv && <p className={styles.errorMsg}>{errors.cvv}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose} type="button">
            Cancel
          </button>
          <button className={styles.btnSave} onClick={handleSave} type="button">
            <i className="ti ti-credit-card" aria-hidden="true" />
            Save card
          </button>
        </div>
      </div>
    </div>
  );
};
