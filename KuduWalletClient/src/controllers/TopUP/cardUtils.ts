import { type CardBrand } from '../../card_Interface/card';

export function detectBrand(rawNumber: string): CardBrand 
{
  if (rawNumber.startsWith('4')) 
  {
      return 'VISA';
  }

  if (['51', '52', '53', '54', '55'].some((p) => rawNumber.startsWith(p)))
  {
      return 'Master Card';
  } 
  
  if (['34', '37'].some((p) => rawNumber.startsWith(p)))
  {
      return 'Master Card';
  } 

  return 'CARD';
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 16);
  return digits.match(/.{1,4}/g)?.join(' ') ?? digits;
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 4);
  if (digits.length >= 3) return digits.substring(0, 2) + '/' + digits.substring(2);
  return digits;
}

export function maskCardNumber(display: string): string {
  return display || '•••• •••• •••• ••••';
}
