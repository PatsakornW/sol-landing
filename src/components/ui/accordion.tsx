'use client';

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import type { StyleXStyles } from '@stylexjs/stylex';
import { AnimatePresence, m as motion } from 'motion/react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as stylex from '@stylexjs/stylex';

// SSR-safe layout effect (client components still server-render in Next).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { useIcon } from '@/lib/icon-context';
import { spring } from '@/lib/springs';
import { media } from '../../styles/breakpoints.stylex';
import { fontWeights } from '../../styles/font-weight.stylex';
import { useProximityHover } from '@/hooks/use-proximity-hover';
import { shape } from '../../styles/shape.stylex';
import { color, shadow } from '../../styles/tokens.stylex';

const answerIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-5px)' },
  to: { opacity: 1, transform: 'none' },
});

const styles = stylex.create({
  group: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    backgroundColor: color.surface4,
    boxShadow: shadow.surface3,
    padding: 4,
  },
  plate: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  expandedBg: {
    backgroundColor: `color-mix(in srgb, ${color.accentFill} 20%, transparent)`,
  },
  hoverBg: {
    backgroundColor: color.hover,
  },
  focusRing: {
    zIndex: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.ring,
  },
  standalone: {
    width: '18rem',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  item: {
    minWidth: 0,
  },
  itemStandalone: {
    position: 'relative',
  },
  itemFollow: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: color.border,
  },
  header: {
    margin: 0,
    width: '100%',
  },
  measure: {
    width: '100%',
    minWidth: 0,
  },
  insetPlate: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  triggerWrap: {
    position: 'relative',
  },
  trigger: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    paddingInline: 16,
    paddingBlock: { default: 15, [media.maxSm]: 14 },
    minHeight: { default: 62, [media.maxSm]: 58 },
    width: '100%',
    margin: 0,
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    color: color.fg,
    WebkitTapHighlightColor: 'transparent',
  },
  triggerFocus: {
    ':focus-visible': {
      boxShadow: `0 0 0 1px ${color.ring}`,
    },
  },
  label: {
    display: 'inline-grid',
    fontSize: 15,
    lineHeight: 1.4,
    letterSpacing: '-0.015em',
    textWrap: 'balance',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    textAlign: 'left',
  },
  ghost: {
    gridColumnStart: 1,
    gridRowStart: 1,
    visibility: 'hidden',
  },
  labelText: {
    gridColumnStart: 1,
    gridRowStart: 1,
    transitionProperty: 'color, font-variation-settings',
    transitionDuration: '80ms',
  },
  ink: {
    color: color.fg,
  },
  muted: {
    color: color.mutedFg,
  },
  chevron: {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronIcon: {
    transitionProperty: 'color, stroke-width',
    transitionDuration: '80ms',
  },
  panel: {
    overflow: 'hidden',
  },
  answer: {
    paddingInline: 16,
    paddingBottom: 18,
    paddingTop: 6,
  },
  answerText: {
    display: 'block',
    maxWidth: '54ch',
    fontSize: 14,
    lineHeight: 1.65,
    letterSpacing: '-0.01em',
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  answerIn: {
    animationName: {
      default: answerIn,
      [media.reduce]: 'none',
    },
    animationDuration: '0.22s',
    animationTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  },
  /* The plates and the trigger used to take their corner as an inline style off
     React context. A themeable variable does it without a render — see
     `styles/shape.stylex.ts`. */
  bgRadius: {
    borderRadius: shape.bgRadius,
  },
  focusRingRadius: {
    borderRadius: shape.focusRingRadius,
  },
  /* Inter's variable axes, pinned per weight — see `styles/font-weight.stylex.ts`. */
  weightSemibold: {
    fontVariationSettings: fontWeights.semibold,
  },
  weightNormal: {
    fontVariationSettings: fontWeights.normal,
  },
});

// ─── Contexts ────────────────────────────────────────────────────────────────

interface ItemRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface AccordionGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  registerFullItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  grouped: true;
  remeasure: () => void;
  openValues: Set<string>;
  openItemRects: Map<number, ItemRect>;
}

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(null);

function useAccordionGroup() {
  return useContext(AccordionGroupContext);
}

interface AccordionItemContextValue {
  index?: number;
  value: string;
  isOpen: boolean;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx)
    throw new Error('AccordionTrigger/AccordionContent must be used within an AccordionItem');
  return ctx;
}

// ─── AccordionGroup ──────────────────────────────────────────────────────────

type AccordionGroupSingleProps = {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

type AccordionGroupMultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type AccordionGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> & {
  children: ReactNode;
  /**
   * Optional StyleX override for the group's own container, merged after the
   * component's styles. A typed `StyleXStyles` rather than a raw `style`
   * object: the group owns its layout, and a caller that needs it flat (no
   * plate, no ring) should say so in the same language everything else here is
   * written in. Passing nothing leaves the default surface untouched.
   */
  style?: StyleXStyles;
} & (AccordionGroupSingleProps | AccordionGroupMultipleProps);

const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>((props, ref) => {
  const { children, type = 'single', ...rest } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const fullItemElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const [openItemRects, setOpenItemRects] = useState<Map<number, ItemRect>>(new Map());
  const openItemRectsRef = useRef(openItemRects);

  const {
    activeIndex,
    setActiveIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef);

  const registerFullItem = useCallback((index: number, element: HTMLElement | null) => {
    if (element) {
      fullItemElementsRef.current.set(index, element);
    } else {
      fullItemElementsRef.current.delete(index);
    }
  }, []);

  const measureFullItems = useCallback(() => {
    if (!containerRef.current) return;
    const next = new Map<number, ItemRect>();
    // Use offset* (layout coords) to match the proximity hook's items.
    // getBoundingClientRect would return visual coords already scaled by
    // any ancestor transform; once applied as CSS inside the same scaled
    // container, the overlay would scale a second time.
    fullItemElementsRef.current.forEach((el, idx) => {
      next.set(idx, {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    });
    // Skip the state update when nothing moved (mirrors the proximity
    // hook's measureItems guard) — this runs per animation frame via
    // onUpdate, and an unconditional set would invalidate the group
    // context and re-render every item even on no-op remeasures.
    const prev = openItemRectsRef.current;
    let changed = prev.size !== next.size;
    if (!changed) {
      for (const [idx, r] of next) {
        const p = prev.get(idx);
        if (
          !p ||
          p.top !== r.top ||
          p.left !== r.left ||
          p.width !== r.width ||
          p.height !== r.height
        ) {
          changed = true;
          break;
        }
      }
    }
    if (!changed) return;
    openItemRectsRef.current = next;
    setOpenItemRects(next);
  }, []);

  // Track open values for context
  const [internalSingleValue, setInternalSingleValue] = useState<string>(() => {
    if (type === 'single') {
      const sp = props as AccordionGroupSingleProps;
      return sp.defaultValue ?? '';
    }
    return '';
  });
  const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(() => {
    if (type === 'multiple') {
      const mp = props as AccordionGroupMultipleProps;
      return mp.defaultValue ?? [];
    }
    return [];
  });
  const singleOnValueChange = (props as AccordionGroupSingleProps).onValueChange;
  const multipleOnValueChange = (props as AccordionGroupMultipleProps).onValueChange;

  const openValuesList: string[] =
    type === 'multiple'
      ? ((props as AccordionGroupMultipleProps).value ?? internalMultipleValue)
      : (() => {
          const v = (props as AccordionGroupSingleProps).value ?? internalSingleValue;
          return v ? [v] : [];
        })();

  // Keyed on the joined values so the Set (and the group context value
  // below) keeps a stable identity across re-renders where the open values
  // haven't actually changed.
  const openValuesKey = openValuesList.join(',');

  const openValues = useMemo(
    () => new Set(openValuesList),
    // Deliberately keyed on the joined string, not the (fresh) array.
    [openValuesKey],
  );

  const handleSingleValueChange = useCallback(
    (value: string) => {
      const sp = props as AccordionGroupSingleProps;
      if (sp.onValueChange) sp.onValueChange(value);
      else setInternalSingleValue(value);
    },
    [singleOnValueChange],
  );

  const handleMultipleValueChange = useCallback(
    (value: string[]) => {
      const mp = props as AccordionGroupMultipleProps;
      if (mp.onValueChange) mp.onValueChange(value);
      else setInternalMultipleValue(value);
    },
    [multipleOnValueChange],
  );

  useEffect(() => {
    measureItems();
    measureFullItems();
  }, [measureItems, measureFullItems, children]);

  // Remeasure when open values change so the first paint already
  // reflects shifted trigger positions.
  useEffect(() => {
    measureItems();
    measureFullItems();
  }, [measureItems, measureFullItems, openValuesKey]);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
  const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
  // Dimming: reduce expanded BG opacity when hovering a non-expanded trigger
  const isHoveringNonOpen = activeIndex !== null && !openItemRects.has(activeIndex);

  // Strip non-HTML props before spreading
  const {
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    collapsible: _collapsible,
    type: _type,
    style: groupStyle,
    ...htmlProps
  } = rest as Record<string, unknown>;

  // Build Radix root props
  const radixProps =
    type === 'multiple'
      ? {
          type: 'multiple' as const,
          value: (props as AccordionGroupMultipleProps).value ?? internalMultipleValue,
          onValueChange: handleMultipleValueChange,
        }
      : {
          type: 'single' as const,
          collapsible: (props as AccordionGroupSingleProps).collapsible ?? true,
          value: (props as AccordionGroupSingleProps).value ?? internalSingleValue,
          onValueChange: handleSingleValueChange,
        };

  const remeasure = useCallback(() => {
    measureItems();
    measureFullItems();
  }, [measureItems, measureFullItems]);

  // Memoized: the group re-renders on every proximity-hover mousemove; a
  // fresh context object each time would re-render every item with it.
  const groupContextValue = useMemo<AccordionGroupContextValue>(
    () => ({
      registerItem,
      registerFullItem,
      activeIndex,
      grouped: true,
      remeasure,
      openValues,
      openItemRects,
    }),
    [registerItem, registerFullItem, activeIndex, remeasure, openValues, openItemRects],
  );

  return (
    <AccordionGroupContext.Provider value={groupContextValue}>
      <AccordionPrimitive.Root {...radixProps} asChild>
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={(e) => {
            // Suppress proximity hover when cursor is over an expanded
            // content area (below the item's trigger). This keeps trigger
            // hover scoped to the trigger row only.
            const container = containerRef.current;
            if (container) {
              const cRect = container.getBoundingClientRect();
              const layoutH = container.offsetHeight;
              const visualH = cRect.height;
              const scale = layoutH > 0 ? visualH / layoutH : 1;
              const localY = (e.clientY - cRect.top) / scale + container.scrollTop;
              for (const [idx, full] of openItemRects) {
                const trigger = itemRects[idx];
                if (!trigger) continue;
                const contentTop = trigger.top + trigger.height;
                const contentBottom = full.top + full.height;
                if (localY >= contentTop && localY <= contentBottom) {
                  setActiveIndex(null);
                  return;
                }
              }
            }
            handlers.onMouseMove(e);
          }}
          onMouseLeave={handlers.onMouseLeave}
          onFocus={(e) => {
            const indexAttr = (e.target as HTMLElement)
              .closest('[data-proximity-index]')
              ?.getAttribute('data-proximity-index');
            if (indexAttr != null) {
              const idx = Number(indexAttr);
              setActiveIndex(idx);
              setFocusedIndex((e.target as HTMLElement).matches(':focus-visible') ? idx : null);
            }
          }}
          onBlur={(e) => {
            if (containerRef.current?.contains(e.relatedTarget as Node)) return;
            setFocusedIndex(null);
            setActiveIndex(null);
          }}
          {...stylex.props(styles.group, groupStyle as StyleXStyles)}
          {...(htmlProps as HTMLAttributes<HTMLDivElement>)}
        >
          {/* Expanded item backgrounds */}
          <AnimatePresence>
            {[...openItemRects.entries()].map(([idx, rect]) => (
              <motion.div
                key={`expanded-${idx}`}
                {...stylex.props(styles.plate, styles.expandedBg, styles.bgRadius)}
                // Fade in from the item's current rect: with initial={false}
                // a newly-opened item's background would pop in at full
                // opacity mid-layout-shift while the previous item's bg is
                // still fading out — reads as a glitch when switching items
                // (especially under /demo's scaled card). Geometry still
                // snaps (duration 0) so the bg hugs the animating item.
                initial={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  opacity: 0,
                }}
                animate={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  opacity: isHoveringNonOpen ? 0.7 : 1,
                }}
                exit={{ opacity: 0, transition: spring.moderate.exit }}
                transition={{
                  top: { duration: 0 },
                  left: { duration: 0 },
                  width: { duration: 0 },
                  height: { duration: 0 },
                  opacity: { duration: 0.12 },
                }}
              />
            ))}
          </AnimatePresence>

          {/* Hover background */}
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                {...stylex.props(styles.plate, styles.hoverBg, styles.bgRadius)}
                initial={{
                  opacity: 0,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                animate={{
                  opacity: 1,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                exit={{ opacity: 0, transition: spring.fast.exit }}
                transition={{
                  ...spring.fast,
                  opacity: { duration: 0.08 },
                }}
              />
            )}
          </AnimatePresence>

          {/* Focus ring */}
          <AnimatePresence>
            {focusRect && (
              <motion.div
                {...stylex.props(styles.plate, styles.focusRing, styles.focusRingRadius)}
                initial={false}
                animate={{
                  left: focusRect.left - 2,
                  top: focusRect.top - 2,
                  width: focusRect.width + 4,
                  height: focusRect.height + 4,
                }}
                exit={{ opacity: 0, transition: spring.fast.exit }}
                transition={{
                  ...spring.fast,
                  opacity: { duration: 0.08 },
                }}
              />
            )}
          </AnimatePresence>

          {children}
        </div>
      </AccordionPrimitive.Root>
    </AccordionGroupContext.Provider>
  );
});

AccordionGroup.displayName = 'AccordionGroup';

// ─── Accordion (Standalone) ──────────────────────────────────────────────────

interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    { children, type = 'single', collapsible = true, defaultValue, value, onValueChange, ...props },
    ref,
  ) => {
    // Track open values for AccordionItemContext
    const [internalSingleValue, setInternalSingleValue] = useState<string>(() => {
      if (type === 'single') {
        return (defaultValue as string) ?? '';
      }
      return '';
    });
    const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(() => {
      if (type === 'multiple') {
        return (defaultValue as string[]) ?? [];
      }
      return [];
    });

    const openValues = new Set<string>(
      type === 'multiple'
        ? ((value as string[] | undefined) ?? internalMultipleValue)
        : (() => {
            const v = (value as string | undefined) ?? internalSingleValue;
            return v ? [v] : [];
          })(),
    );

    const handleSingleChange = useCallback(
      (v: string) => {
        if (onValueChange) (onValueChange as (v: string) => void)(v);
        else setInternalSingleValue(v);
      },
      [onValueChange],
    );

    const handleMultipleChange = useCallback(
      (v: string[]) => {
        if (onValueChange) (onValueChange as (v: string[]) => void)(v);
        else setInternalMultipleValue(v);
      },
      [onValueChange],
    );

    // `value` is always defined here (internal state is seeded from
    // `defaultValue` above), so the Radix root is permanently controlled and
    // forwarding `defaultValue` would be dead.
    const radixProps =
      type === 'multiple'
        ? {
            type: 'multiple' as const,
            value: (value as string[] | undefined) ?? internalMultipleValue,
            onValueChange: handleMultipleChange,
          }
        : {
            type: 'single' as const,
            collapsible,
            value: (value as string | undefined) ?? internalSingleValue,
            onValueChange: handleSingleChange,
          };

    return (
      <AccordionPrimitive.Root {...radixProps} asChild>
        <div ref={ref} {...stylex.props(styles.standalone)} {...props}>
          <StandaloneOpenContext.Provider value={openValues}>
            {children}
          </StandaloneOpenContext.Provider>
        </div>
      </AccordionPrimitive.Root>
    );
  },
);

Accordion.displayName = 'Accordion';

// Standalone context to provide open values without AccordionGroup
const StandaloneOpenContext = createContext<Set<string>>(new Set());

// ─── AccordionItem ───────────────────────────────────────────────────────────

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  index?: number;
  disabled?: boolean;
  children: ReactNode;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, index, disabled, children, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const groupCtx = useAccordionGroup();
    const standaloneOpen = useContext(StandaloneOpenContext);

    const isOpen = groupCtx?.grouped ? groupCtx.openValues.has(value) : standaloneOpen.has(value);

    const triggerRef = useRef<HTMLDivElement>(null);

    // Register trigger element (not full item) for proximity hover
    useEffect(() => {
      if (groupCtx?.grouped && index !== undefined) {
        groupCtx.registerItem(index, triggerRef.current);
        return () => groupCtx.registerItem(index, null);
      }
    }, [index, groupCtx]);

    // Register full item element for expanded background measurement
    useEffect(() => {
      if (groupCtx?.grouped && index !== undefined) {
        if (isOpen) {
          groupCtx.registerFullItem(index, internalRef.current);
        } else {
          groupCtx.registerFullItem(index, null);
        }
        return () => groupCtx.registerFullItem(index, null);
      }
    }, [index, groupCtx, isOpen]);

    return (
      <AccordionItemContext.Provider value={{ index, value, isOpen, triggerRef }}>
        <AccordionPrimitive.Item
          ref={(node) => {
            (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          value={value}
          disabled={disabled}
          data-proximity-index={index}
          {...stylex.props(
            styles.item,
            !groupCtx?.grouped && styles.itemStandalone,
            Boolean(groupCtx?.grouped && index !== undefined && index > 0) && styles.itemFollow,
          )}
          {...props}
        >
          {/* Standalone expanded background */}
          {!groupCtx?.grouped && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  {...stylex.props(styles.insetPlate, styles.expandedBg, styles.bgRadius)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: spring.fast.exit }}
                  transition={{ duration: 0.08 }}
                />
              )}
            </AnimatePresence>
          )}
          {children}
        </AccordionPrimitive.Item>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

// ─── AccordionTrigger ────────────────────────────────────────────────────────

interface AccordionTriggerProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  'className' | 'style'
> {
  children: ReactNode;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, ref) => {
    const ChevronRight = useIcon('chevron-right');
    const groupCtx = useAccordionGroup();
    const { index, isOpen, triggerRef } = useAccordionItemContext();
    const [isHovered, setIsHovered] = useState(false);

    const isActive = groupCtx?.grouped ? groupCtx.activeIndex === index : isHovered;

    const triggerContent = (
      <AccordionPrimitive.Header asChild>
        <div {...stylex.props(styles.header)}>
          <AccordionPrimitive.Trigger
            ref={ref}
            {...stylex.props(
              styles.trigger,
              !groupCtx?.grouped && styles.triggerFocus,
              styles.bgRadius,
            )}
            {...(props as React.ComponentProps<typeof AccordionPrimitive.Trigger>)}
          >
            {/* Label with dual-layer text */}
            <span {...stylex.props(styles.label)}>
              <span {...stylex.props(styles.ghost, styles.weightSemibold)} aria-hidden="true">
                {children}
              </span>
              <span
                {...stylex.props(
                  styles.labelText,
                  isOpen || isActive ? styles.ink : styles.muted,
                  isOpen ? styles.weightSemibold : styles.weightNormal,
                )}
              >
                {children}
              </span>
            </span>

            {/* Chevron — right when collapsed, rotates 90° down when expanded */}
            <motion.span
              {...stylex.props(styles.chevron)}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={spring.fast}
            >
              <ChevronRight
                size={16}
                strokeWidth={isOpen || isActive ? 2 : 1.5}
                className={
                  stylex.props(styles.chevronIcon, isOpen || isActive ? styles.ink : styles.muted)
                    .className
                }
              />
            </motion.span>
          </AccordionPrimitive.Trigger>
        </div>
      </AccordionPrimitive.Header>
    );

    // Grouped hover measures this box with offsetTop/Left against the group
    // (position: relative). It must not itself be positioned, or every plate
    // reports (0, 0) and the highlight sticks to the first row.
    if (groupCtx?.grouped) {
      return (
        <div ref={triggerRef} {...stylex.props(styles.measure)}>
          {triggerContent}
        </div>
      );
    }

    // Standalone mode: local hover with animated BG
    return (
      <div
        {...stylex.props(styles.triggerWrap)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...stylex.props(styles.insetPlate, styles.hoverBg, styles.bgRadius)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              transition={{ duration: 0.08 }}
            />
          )}
        </AnimatePresence>
        {triggerContent}
      </div>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';

// ─── AccordionContent ────────────────────────────────────────────────────────

interface AccordionContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> {
  children: ReactNode;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, ref) => {
    const groupCtx = useAccordionGroup();
    const { isOpen } = useAccordionItemContext();

    // The open height is animated to a self-measured LAYOUT pixel value, not
    // `height: "auto"`: framer resolves an "auto" target by measuring the
    // element's *visual* (transformed) size, so under a scaled ancestor
    // (e.g. /demo's 1.7x card) the animation overshoots to scale× the real
    // height and snaps back when the final "auto" lands — a visible height
    // reduction at the end of every open. offsetHeight and ResizeObserver
    // are transform-immune.
    const innerRef = useRef<HTMLDivElement | null>(null);
    const roRef = useRef<ResizeObserver | null>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    // Items open at mount render `initial: "auto"` and receive their first
    // pixel target a commit later; that hand-off must SNAP (duration 0), not
    // spring — framer would measure the spring's numeric start visually
    // (scaled) and play a shrink. Items that open later spring normally.
    const needsSnap = useRef(isOpen);

    const measureRef = useCallback((el: HTMLDivElement | null) => {
      roRef.current?.disconnect();
      roRef.current = null;
      innerRef.current = el;
      if (!el) return;
      if (el.offsetHeight > 0) setContentHeight(el.offsetHeight);
      const ro = new ResizeObserver(() => {
        // Ignore the 0 that fires while the panel is display:none.
        if (el.offsetHeight > 0) setContentHeight(el.offsetHeight);
      });
      ro.observe(el);
      roRef.current = ro;
    }, []);

    // Re-measure synchronously (pre-paint) when opening, so the spring's
    // target is the fresh layout height from its first frame.
    useIsoLayoutEffect(() => {
      if (isOpen && innerRef.current && innerRef.current.offsetHeight > 0) {
        setContentHeight(innerRef.current.offsetHeight);
      }
    }, [isOpen]);

    useEffect(() => {
      if (contentHeight !== null) needsSnap.current = false;
    }, [contentHeight]);

    // Content stays mounted so it can be measured; fully-closed panels are
    // display:none (hidden) once the exit finishes, keeping them out of the
    // accessibility tree without cutting the animation short.
    const [exitComplete, setExitComplete] = useState(!isOpen);
    if (isOpen && exitComplete) {
      // Reset during render so the panel is un-hidden before the opening
      // animation's first paint.
      setExitComplete(false);
    }

    return (
      <AccordionPrimitive.Content forceMount asChild {...props}>
        <motion.div
          ref={ref}
          hidden={!isOpen && exitComplete}
          {...stylex.props(styles.panel)}
          initial={{ height: isOpen ? 'auto' : 0 }}
          animate={{ height: isOpen ? (contentHeight ?? 0) : 0 }}
          // bounce: 0 — a critically damped spring on body height; pure
          // height has no aesthetic value in bouncing, so a smooth approach
          // reads better.
          transition={needsSnap.current ? { duration: 0 } : { ...spring.moderate, bounce: 0 }}
          onUpdate={() => {
            groupCtx?.remeasure();
          }}
          onAnimationComplete={() => {
            groupCtx?.remeasure();
            if (!isOpen) setExitComplete(true);
          }}
        >
          <div ref={measureRef} {...stylex.props(styles.answer, isOpen && styles.answerIn)}>
            <span {...stylex.props(styles.answerText)}>{children}</span>
          </div>
        </motion.div>
      </AccordionPrimitive.Content>
    );
  },
);

AccordionContent.displayName = 'AccordionContent';

// ─── Exports ─────────────────────────────────────────────────────────────────

export { Accordion, AccordionGroup, AccordionItem, AccordionTrigger, AccordionContent };
export default Accordion;
