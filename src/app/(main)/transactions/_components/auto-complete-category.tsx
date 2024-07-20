'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  type KeyboardEvent,
} from 'react';
import { cn, mergeRefs } from '@/lib/utils';
import { Check, ChevronDownIcon, PlusCircleIcon } from 'lucide-react';
import { Command as CommandPrimitive } from 'cmdk';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@//components/ui/command';
import { useCreateCategory } from '@/query/categories';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

interface AutoCompleteCategoryProps {
  options: Option[];
  placeholder?: string;
  value?: string | null | undefined;
  onChange: (value?: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const AutoCompleteCategory = forwardRef<
  HTMLDivElement,
  AutoCompleteCategoryProps
>(
  (
    { options, placeholder, value, onChange, isLoading = false, isDisabled },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const formattedValue = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<Option>(formattedValue as Option);
    const [inputValue, setInputValue] = useState<string>(
      formattedValue?.label || ''
    );

    const createMutation = useCreateCategory();
    const isPending = createMutation.isPending || isDisabled;

    const onCreate = useCallback(
      (value: string | undefined) => {
        if (!value) return;

        createMutation.mutate(
          {
            name: value,
          },
          {
            onSuccess: ({ data }) => {
              const [{ name, id }] = data;

              setSelected({ label: name, value: id } as Option);
              setInputValue(name);
              onChange(id);

              setIsOpen(false);
            },
            onError: () => {
              setIsOpen(true);
            },
          }
        );
      },
      [createMutation, onChange]
    );

    const onKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (!input) {
          return;
        }

        if (isDisabled) {
          return;
        }

        // Keep the options displayed when the user is typing
        if (!isOpen) {
          setIsOpen(true);
        }

        // This is not a default behaviour of the <input /> field
        if (event.key === 'Enter' && input.value !== '') {
          const optionToSelect = options.find(
            (option) => option.label === input.value
          );
          if (optionToSelect) {
            setSelected(optionToSelect);
            // onValueChange?.(optionToSelect);
            onChange(optionToSelect.value);
          }
        }

        if (event.key === 'Escape') {
          event.stopPropagation();
          input.blur();
        }
      },
      [isOpen, options, onChange, isDisabled]
    );

    const onBlur = useCallback(() => {
      setIsOpen(false);
      setInputValue(selected?.label);
    }, [selected]);

    const onSelectOption = useCallback(
      (selectedOption: Option) => {
        setSelected(selectedOption);
        setInputValue(selectedOption.label);
        onChange(selectedOption.value);
        // onValueChange?.(selectedOption);

        // This is a hack to prevent the input from being focused after the user selects an option
        // We can call this hack: "The next tick"
        setTimeout(() => {
          inputRef?.current?.blur();
        }, 0);
      },
      [onChange]
    );

    return (
      <CommandPrimitive
        onKeyDown={onKeyDown}
        // className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input px-1 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex items-center gap-1">
            <CommandPrimitive.Input
              ref={mergeRefs([inputRef, ref])}
              value={inputValue}
              onValueChange={isLoading ? undefined : setInputValue}
              onBlur={onBlur}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              disabled={isPending}
              className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </div>
        </div>
        <div className="relative mt-2">
          <div
            className={cn(
              'absolute top-0 z-10 w-full rounded-xl pb-4 outline-none animate-in fade-in-0 zoom-in-95',
              isOpen ? 'block' : 'hidden'
            )}
          >
            <div className="bg-popover">
              <CommandList className="rounded-md border border-gray-200">
                {isLoading ? (
                  <CommandPrimitive.Loading>
                    <div className="p-1">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CommandPrimitive.Loading>
                ) : null}
                {options.length > 0 && !isLoading ? (
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = selected?.value === option.value;
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onSelect={() => onSelectOption(option)}
                          className={cn(
                            'flex w-full items-center gap-2',
                            !isSelected ? 'pl-8' : null
                          )}
                        >
                          {isSelected ? <Check className="size-4" /> : null}
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ) : null}
                {!isLoading ? (
                  <CommandEmpty className="p-1">
                    <div
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onCreate(inputRef.current?.value);
                      }}
                      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-sm bg-accent px-2 py-1.5 text-sm"
                    >
                      <PlusCircleIcon className="size-4 shrink-0" />
                      <p className="truncate">{`Create "${inputRef.current?.value}"`}</p>
                    </div>
                  </CommandEmpty>
                ) : null}
              </CommandList>
            </div>
          </div>
        </div>
      </CommandPrimitive>
    );
  }
);

AutoCompleteCategory.displayName = 'AutoCompleteCategory';

export { AutoCompleteCategory };

// export const AutoCompleteCategory = ({
//   options,
//   placeholder,
//   value,
//   onChange,
//   isLoading = false,
//   isDisabled,
// }: AutoCompleteCategoryProps) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const formattedValue = useMemo(
//     () => options.find((option) => option.value === value),
//     [options, value]
//   );

//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [selected, setSelected] = useState<Option>(formattedValue as Option);
//   const [inputValue, setInputValue] = useState<string>(
//     formattedValue?.label || ''
//   );

//   const createMutation = useCreateCategory();
//   const isPending = createMutation.isPending || isDisabled;

//   const onCreate = useCallback(
//     (value: string | undefined) => {
//       if (!value) return;

//       createMutation.mutate(
//         {
//           name: value,
//         },
//         {
//           onSuccess: ({ data }) => {
//             const [{ name, id }] = data;

//             setSelected({ label: name, value: id } as Option);
//             setInputValue(name);
//             onChange(id);

//             setIsOpen(false);
//           },
//           onError: () => {
//             setIsOpen(true);
//           },
//         }
//       );
//     },
//     [createMutation, onChange]
//   );

//   const onKeyDown = useCallback(
//     (event: KeyboardEvent<HTMLDivElement>) => {
//       const input = inputRef.current;
//       if (!input) {
//         return;
//       }

//       // Keep the options displayed when the user is typing
//       if (!isOpen) {
//         setIsOpen(true);
//       }

//       // This is not a default behaviour of the <input /> field
//       if (event.key === 'Enter' && input.value !== '') {
//         const optionToSelect = options.find(
//           (option) => option.label === input.value
//         );
//         if (optionToSelect) {
//           setSelected(optionToSelect);
//           // onValueChange?.(optionToSelect);
//           onChange(optionToSelect.value);
//         }
//       }

//       if (event.key === 'Escape') {
//         input.blur();
//       }
//     },
//     [isOpen, options, onChange]
//   );

//   const onBlur = useCallback(() => {
//     setIsOpen(false);
//     setInputValue(selected?.label);
//   }, [selected]);

//   const onSelectOption = useCallback(
//     (selectedOption: Option) => {
//       setInputValue(selectedOption.label);

//       setSelected(selectedOption);
//       // onValueChange?.(selectedOption);
//       onChange(selectedOption.value);

//       // This is a hack to prevent the input from being focused after the user selects an option
//       // We can call this hack: "The next tick"
//       setTimeout(() => {
//         inputRef?.current?.blur();
//       }, 0);
//     },
//     [onChange]
//   );

//   return (
//     <CommandPrimitive
//       onKeyDown={onKeyDown}
//       // className="overflow-visible bg-transparent"
//     >
//       <div className="group rounded-md border border-input px-1 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//         <div className="flex items-center gap-1">
//           <CommandPrimitive.Input
//             ref={inputRef}
//             value={inputValue}
//             onValueChange={isLoading ? undefined : setInputValue}
//             onBlur={onBlur}
//             onFocus={() => setIsOpen(true)}
//             placeholder={placeholder}
//             disabled={isPending}
//             className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
//           />
//           <ChevronDownIcon className="size-4 text-muted-foreground" />
//         </div>
//       </div>
//       <div className="relative mt-2">
//         <div
//           className={cn(
//             'absolute top-0 z-10 w-full rounded-xl pb-4 outline-none animate-in fade-in-0 zoom-in-95',
//             isOpen ? 'block' : 'hidden'
//           )}
//         >
//           <div className="bg-popover">
//             <CommandList className="rounded-md border border-gray-200">
//               {isLoading ? (
//                 <CommandPrimitive.Loading>
//                   <div className="p-1">
//                     <Skeleton className="h-8 w-full" />
//                   </div>
//                 </CommandPrimitive.Loading>
//               ) : null}
//               {options.length > 0 && !isLoading ? (
//                 <CommandGroup>
//                   {options.map((option) => {
//                     const isSelected = selected?.value === option.value;
//                     return (
//                       <CommandItem
//                         key={option.value}
//                         value={option.label}
//                         onMouseDown={(event) => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                         }}
//                         onSelect={() => onSelectOption(option)}
//                         className={cn(
//                           'flex w-full items-center gap-2',
//                           !isSelected ? 'pl-8' : null
//                         )}
//                       >
//                         {isSelected ? <Check className="size-4" /> : null}
//                         {option.label}
//                       </CommandItem>
//                     );
//                   })}
//                 </CommandGroup>
//               ) : null}
//               {!isLoading ? (
//                 <CommandEmpty className="p-1">
//                   <div
//                     onMouseDown={(event) => {
//                       event.preventDefault();
//                       event.stopPropagation();
//                       onCreate(inputRef.current?.value);
//                     }}
//                     className="flex w-full cursor-pointer select-none items-center gap-2 rounded-sm bg-accent px-2 py-1.5 text-sm"
//                   >
//                     <PlusCircleIcon className="size-4 shrink-0" />
//                     <p className="truncate">{`Create "${inputRef.current?.value}"`}</p>
//                   </div>
//                 </CommandEmpty>
//               ) : null}
//             </CommandList>
//           </div>
//         </div>
//       </div>
//     </CommandPrimitive>
//   );
// };
