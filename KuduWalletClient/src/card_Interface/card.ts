export type CardBrand = 'VISA' | 'Master Card' | 'American Express' | 'CARD';

export interface Card {
  id: string;
  brand: CardBrand;
  name: string;
  last4: string;
  expiry: string;
}

export interface AddCardFormValues {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}
