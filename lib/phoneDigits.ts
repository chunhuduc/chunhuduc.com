/** Strip to digits for `tel:`, `wa.me`, `zalo.me`, etc. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}
