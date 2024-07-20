'use client';

import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  KeyboardEvent,
} from 'react';
import { cn, mergeRefs } from '@/lib/utils';
import { PlusIcon, MinusIcon } from 'lucide-react';
import CurrencyInputPrimitive from 'react-currency-input-field';
import { Button } from './ui/button';

interface NumberInputProps {
  placeholder?: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ placeholder, value, onChange, disabled }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isArrowDownPressed, setIsArrowDownPressed] = useState(false);
    const [isArrowUpPressed, setIsArrowUpPressed] = useState(false);

    const onArrowDownPress = useCallback(() => {
      setIsArrowDownPressed(true);
    }, []);

    const onArrowDownRelease = useCallback(() => {
      setIsArrowDownPressed(false);
    }, []);

    const onArrowUpPress = useCallback(() => {
      setIsArrowUpPressed(true);
    }, []);

    const onArrowUpRelease = useCallback(() => {
      setIsArrowUpPressed(false);
    }, []);

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        onArrowDownPress();
      }
      if (event.key === 'ArrowUp') {
        onArrowUpPress();
      }
    };

    const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        onArrowDownRelease();
      }
      if (event.key === 'ArrowUp') {
        onArrowUpRelease();
      }
    };

    const onClickStepDown = () => {
      if (disabled) return;

      if (value === '0') return;

      if (!value) {
        const reversedValue = 0 - 1;
        onChange?.(reversedValue.toString());
        return;
      }

      const reversedValue = parseFloat(value) - 1;
      onChange?.(reversedValue.toString());

      inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const onClickStepUp = () => {
      if (disabled) return;

      if (!value) {
        const reversedValue = 0 + 1;
        onChange?.(reversedValue.toString());
        return;
      }

      const reversedValue = parseFloat(value) + 1;
      onChange?.(reversedValue.toString());

      inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
    };

    return (
      <div className="relative w-full">
        <CurrencyInputPrimitive
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm caret-black ring-offset-background file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={value}
          allowNegativeValue={false}
          allowDecimals={false}
          disabled={disabled}
          step={1}
          onValueChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          ref={mergeRefs([inputRef, ref])}
        />

        <div className="absolute right-0 top-0 flex items-center">
          <Button
            type="button"
            tabIndex={-1}
            variant="outline"
            size="icon"
            className="group/minus rounded-none border-r-0"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => {
              if (e.cancelable) {
                e.preventDefault();
              }
            }}
            onMouseUp={onClickStepDown}
          >
            <MinusIcon
              className={cn(
                'size-4 text-muted-foreground transition-all duration-75 group-hover/minus:text-black group-active/minus:scale-75 group-active/minus:text-black/80',
                {
                  'scale-75 text-black': isArrowDownPressed,
                }
              )}
            />
          </Button>

          <Button
            type="button"
            tabIndex={-1}
            variant="outline"
            size="icon"
            className="group/plus rounded-none rounded-r-md"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => {
              if (e.cancelable) {
                e.preventDefault();
              }
            }}
            onMouseUp={onClickStepUp}
          >
            <PlusIcon
              className={cn(
                'size-4 text-muted-foreground transition-all duration-75 group-hover/plus:text-black group-active/plus:scale-75 group-active/plus:text-black/80',
                {
                  'scale-75 text-black': isArrowUpPressed,
                }
              )}
            />
          </Button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
