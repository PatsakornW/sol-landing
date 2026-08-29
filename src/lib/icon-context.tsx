'use client';

import { createContext, useContext, type ComponentType, type ReactNode } from 'react';

export interface IconComponentProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export type IconComponent = ComponentType<IconComponentProps>;

export type IconName =
  | 'chevron-right'
  | 'chevron-down'
  | 'x'
  | 'copy'
  | 'menu'
  | 'dot'
  | 'monitor'
  | 'sun'
  | 'moon'
  | 'rectangle-horizontal'
  | 'circle'
  | 'square-library'
  | 'clock'
  | 'star'
  | 'settings'
  | 'plus'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'search'
  | 'loader'
  | 'users'
  | 'lock'
  | 'mail'
  | 'bell'
  | 'shield'
  | 'palette'
  | 'lightbulb'
  | 'rocket'
  | 'heart'
  | 'paintbrush'
  | 'brain'
  | 'globe'
  | 'user'
  | 'image'
  | 'link'
  | 'check'
  | 'rotate-ccw'
  | 'play'
  | 'pause'
  | 'pipette'
  | 'home'
  | 'message-circle'
  | 'inbox'
  | 'pencil'
  | 'skip-forward'
  | 'corner-down-right';

const IconContext = createContext<Partial<Record<IconName, IconComponent>> | null>(null);

/**
 * Returns a single icon component for the given name.
 * Landing registers Hugeicons in `Providers` — there is no Lucide fallback
 * set, so a missing name is a wiring bug.
 */
function useIcon(name: IconName): IconComponent {
  const icons = useContext(IconContext);
  const Icon = icons?.[name];
  if (!Icon) throw new Error(`No icon registered for "${name}"`);
  return Icon;
}

function useIcons(): Partial<Record<IconName, IconComponent>> {
  return useContext(IconContext) ?? {};
}

function IconProvider({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: Partial<Record<IconName, IconComponent>>;
}) {
  return <IconContext.Provider value={icons ?? {}}>{children}</IconContext.Provider>;
}

export { IconProvider, useIcon, useIcons };
