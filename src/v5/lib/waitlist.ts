/**
 * Waitlist sign-up.
 *
 * PLACEHOLDER: there is no waitlist backend yet, so this accepts any valid
 * address, waits briefly, and stores nothing. Wiring a real endpoint means
 * replacing the body of `joinWaitlist` — the form only depends on it resolving
 * on success and rejecting on failure.
 */

// Deliberately loose: the browser's `type="email"` check runs first, and the
// service that eventually receives the address is the one that owns validity.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export async function joinWaitlist(email: string): Promise<void> {
  if (!isEmail(email)) throw new Error('invalid-email');
  await new Promise((resolve) => setTimeout(resolve, 600));
}
