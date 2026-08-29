import { useEffect } from 'react';

/**
 * Calls `handler` when the Escape key is pressed.
 * Automatically attaches/detaches the listener based on `enabled` (default: true).
 */
export function useEscapeKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handler();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handler, enabled]);
}
