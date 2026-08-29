import { HugeiconsIcon, type IconSvgElement } from '@/lib/icons';
import type { IconComponent } from '@/lib/icon-context';

/**
 * Bridges a Hugeicons glyph into the `IconComponent` shape @fluid expects
 * (`{ size, strokeWidth, className }`), so the landing page can hand its own
 * icon set to @fluid components and to `IconProvider`.
 */
export function hugeicon(icon: IconSvgElement): IconComponent {
  return function Icon({ size, strokeWidth, className }) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={size ?? 16}
        strokeWidth={strokeWidth ?? 2}
        className={className}
      />
    );
  };
}
