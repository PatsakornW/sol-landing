'use client';

import {
  useId,
  useRef,
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { IconComponent } from '@/lib/icon-context';
import { media } from '../../styles/breakpoints.stylex';
import { fontWeights } from '../../styles/font-weight.stylex';
import { useProximityHover } from '@/hooks/use-proximity-hover';
import { shape } from '../../styles/shape.stylex';
import { color, space } from '../../styles/tokens.stylex';

const styles = stylex.create({
  group: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '18rem',
    maxWidth: '100%',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    cursor: 'text',
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  label: {
    display: 'inline-grid',
    fontSize: 13,
    paddingLeft: 12,
  },
  ghost: {
    gridColumnStart: 1,
    gridRowStart: 1,
    visibility: 'hidden',
  },
  labelText: {
    gridColumnStart: 1,
    gridRowStart: 1,
    color: color.mutedFg,
  },
  labelError: {
    color: color.destructive,
  },
  control: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingInline: 12,
    paddingBlock: 8,
    boxShadow: `0 0 0 1px ${color.border}`,
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: '80ms',
  },
  controlIdle: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px transparent',
  },
  controlHover: {
    backgroundColor: `color-mix(in srgb, ${color.muted} 50%, transparent)`,
    boxShadow: `0 0 0 1px ${color.border}`,
  },
  controlFocus: {
    backgroundColor: color.card,
    boxShadow: `0 0 0 1px ${color.border}`,
  },
  controlError: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px transparent',
  },
  controlErrorActive: {
    backgroundColor: `color-mix(in srgb, ${color.destructiveLight} 60%, transparent)`,
    boxShadow: `0 0 0 1px color-mix(in srgb, ${color.destructive} 50%, transparent)`,
  },
  controlErrorFocus: {
    backgroundColor: color.card,
    boxShadow: `0 0 0 1px color-mix(in srgb, ${color.destructive} 50%, transparent)`,
  },
  icon: {
    flexShrink: 0,
    color: color.mutedFg,
    transitionProperty: 'color, stroke-width',
    transitionDuration: '80ms',
  },
  iconActive: {
    color: color.fg,
  },
  input: {
    width: '100%',
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: 0,
    appearance: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    fontSize: 13,
    color: color.fg,
    outline: 'none',
    fontFamily: 'inherit',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    '::placeholder': {
      color: color.mutedFg,
    },
  },
  error: {
    fontSize: 12,
    color: color.destructive,
    paddingLeft: 12,
  },
  waitlistGroup: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: { default: 220, [media.maxSm]: 'auto' },
    gap: 0,
    width: { default: 'auto', [media.maxSm]: '100%' },
    minWidth: 0,
    maxWidth: 'none',
  },
  /* The dialog keeps the field on one row at every width, so it re-asserts the
     desktop basis against the phone override above. */
  waitlistGroupDialog: {
    flexBasis: 130,
    width: 'auto',
  },
  waitlistField: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 0,
    minWidth: 0,
    cursor: 'text',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  waitlistError: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: 'max-content',
    maxWidth: '100%',
    marginTop: 4,
    fontSize: 12,
    color: color.destructive,
    paddingLeft: 0,
  },
  waitlistControl: {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    minWidth: 0,
    height: space.waitlistSlot,
    minHeight: space.waitlistSlot,
    paddingInline: 12,
    paddingBlock: 0,
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: shape.bgRadius,
    backgroundColor: {
      default: 'rgba(255, 255, 255, 0.09)',
      ':hover': { default: null, [media.hover]: 'rgba(255, 255, 255, 0.12)' },
    },
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    ':focus-within': {
      backgroundColor: 'rgba(255, 255, 255, 0.13)',
      boxShadow:
        'inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.32), 0 0 0 3px rgba(255, 255, 255, 0.1)',
    },
  },
  waitlistIcon: {
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 0.58)',
  },
  waitlistIconFocus: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  waitlistInput: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    height: space.waitlistSlot,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: 0,
    appearance: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    /* 16px on a phone: iOS Safari zooms the page for anything smaller. */
    fontSize: { default: 14, [media.maxSm]: 16 },
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
    color: '#fff',
    caretColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.44)',
    },
    ':-webkit-autofill': {
      WebkitTextFillColor: '#fff',
      caretColor: '#fff',
      transitionProperty: 'background-color',
      transitionDuration: '50000s',
    },
  },
  /* Was `style={{ borderRadius: shape.bgRadius }}` — now a themeable variable. */
  bgRadius: {
    borderRadius: shape.bgRadius,
  },
  /* Inter's variable axes, pinned per weight — see `styles/font-weight.stylex.ts`. */
  weightSemibold: {
    fontVariationSettings: fontWeights.semibold,
  },
  weightMedium: {
    fontVariationSettings: fontWeights.medium,
  },
  weightNormal: {
    fontVariationSettings: fontWeights.normal,
  },
});

interface InputGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  chrome: 'default' | 'waitlist';
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

function useInputGroup() {
  const ctx = useContext(InputGroupContext);
  if (!ctx) throw new Error('useInputGroup must be used within an InputGroup');
  return ctx;
}

interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: ReactNode;
  chrome?: 'default' | 'waitlist';
  layout?: 'page' | 'dialog';
}

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ children, chrome = 'default', layout = 'page', ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { activeIndex, handlers, registerItem, measureItems } = useProximityHover(containerRef);

    useEffect(() => {
      measureItems();
    }, [measureItems, children]);

    const contextValue = useMemo(
      () => ({ registerItem, activeIndex, chrome }),
      [registerItem, activeIndex, chrome],
    );

    return (
      <InputGroupContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
          {...stylex.props(
            chrome === 'waitlist' ? styles.waitlistGroup : styles.group,
            chrome === 'waitlist' && layout === 'dialog' && styles.waitlistGroupDialog,
          )}
          {...props}
        >
          {children}
        </div>
      </InputGroupContext.Provider>
    );
  },
);

InputGroup.displayName = 'InputGroup';

interface InputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'index' | 'className' | 'style'
> {
  label: string;
  placeholder?: string;
  icon?: IconComponent;
  index: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({ label, placeholder, icon: Icon, index, value, onChange, error, disabled, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const fieldId = useId();
    const controlId = `${fieldId}-control`;
    const errorId = `${fieldId}-error`;
    const { registerItem, activeIndex, chrome } = useInputGroup();
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      registerItem(index, internalRef.current);
      return () => registerItem(index, null);
    }, [index, registerItem]);

    const isActive = activeIndex === index;
    const labelActive = isActive || isFocused;

    const controlState: StyleXStyles = disabled
      ? styles.controlIdle
      : error
        ? isFocused
          ? styles.controlErrorFocus
          : isActive
            ? styles.controlErrorActive
            : styles.controlError
        : isFocused
          ? styles.controlFocus
          : isActive
            ? styles.controlHover
            : styles.controlIdle;

    const waitlist = chrome === 'waitlist';

    return (
      <div
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        data-invalid={error ? '' : undefined}
        {...stylex.props(
          waitlist ? styles.waitlistField : styles.field,
          disabled && styles.disabled,
        )}
      >
        <label htmlFor={controlId} {...stylex.props(waitlist ? styles.srOnly : styles.label)}>
          {waitlist ? (
            label
          ) : (
            <>
              <span {...stylex.props(styles.ghost, styles.weightSemibold)} aria-hidden="true">
                {label}
              </span>
              <span
                {...stylex.props(
                  styles.labelText,
                  error ? styles.labelError : false,
                  styles.weightNormal,
                )}
              >
                {label}
              </span>
            </>
          )}
        </label>

        <div
          onMouseDown={(e) => {
            if (e.target === inputRef.current) return;
            e.preventDefault();
            inputRef.current?.focus();
          }}
          {...stylex.props(
            waitlist ? styles.waitlistControl : styles.control,
            !waitlist && controlState,
            !waitlist && styles.bgRadius,
          )}
        >
          {Icon && (
            <Icon
              size={16}
              strokeWidth={labelActive ? 2 : 1.5}
              className={
                stylex.props(
                  waitlist
                    ? [styles.waitlistIcon, isFocused && styles.waitlistIconFocus]
                    : [styles.icon, labelActive && styles.iconActive],
                ).className
              }
            />
          )}
          <input
            ref={inputRef}
            id={controlId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...stylex.props(waitlist ? styles.waitlistInput : styles.input, styles.weightNormal)}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            {...stylex.props(waitlist ? styles.waitlistError : styles.error, styles.weightMedium)}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export { InputGroup, InputField };
export default InputGroup;
