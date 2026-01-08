"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ComboboxContextValue<T> {
  items: readonly T[];
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  filteredItems: T[];
}

const ComboboxContext =
  React.createContext<ComboboxContextValue<unknown> | null>(null);

function useCombobox<T>() {
  const context = React.useContext(
    ComboboxContext,
  ) as ComboboxContextValue<T> | null;
  if (!context) {
    throw new Error("useCombobox must be used within a Combobox");
  }
  return context;
}

interface ComboboxProps<T> {
  items: readonly T[];
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  filterFn?: (item: T, inputValue: string) => boolean;
}

function Combobox<T extends string>({
  items,
  children,
  value: controlledValue,
  onValueChange,
  filterFn,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const value = controlledValue ?? internalValue;
  const setValue = onValueChange ?? setInternalValue;

  const defaultFilterFn = React.useCallback(
    (item: T, input: string) =>
      item.toLowerCase().includes(input.toLowerCase()),
    [],
  );

  const filteredItems = React.useMemo(() => {
    const filter = filterFn ?? defaultFilterFn;
    return inputValue
      ? items.filter((item) => filter(item, inputValue))
      : [...items];
  }, [items, inputValue, filterFn, defaultFilterFn]);

  return (
    <ComboboxContext.Provider
      value={{
        items,
        open,
        setOpen,
        value,
        setValue,
        inputValue,
        setInputValue,
        filteredItems,
      }}
    >
      <div className="relative">{children}</div>
    </ComboboxContext.Provider>
  );
}

type ComboboxInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    const { open, setOpen, value, inputValue, setInputValue } = useCombobox();

    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder={placeholder}
          value={inputValue || value}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          {...props}
        />
        <ChevronsUpDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-50" />
      </div>
    );
  },
);
ComboboxInput.displayName = "ComboboxInput";

type ComboboxContentProps = React.HTMLAttributes<HTMLDivElement>;

const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useCombobox();

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ComboboxContent.displayName = "ComboboxContent";

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const ComboboxEmpty = React.forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ className, ...props }, ref) => {
    const { filteredItems } = useCombobox();

    if (filteredItems.length > 0) return null;

    return (
      <div
        ref={ref}
        className={cn("py-6 text-center text-sm", className)}
        {...props}
      />
    );
  },
);
ComboboxEmpty.displayName = "ComboboxEmpty";

interface ComboboxListProps {
  children: (item: string) => React.ReactNode;
}

function ComboboxList({ children }: ComboboxListProps) {
  const { filteredItems } = useCombobox<string>();

  return <>{filteredItems.map((item) => children(item))}</>;
}

interface ComboboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { value, setValue, setOpen, setInputValue } = useCombobox();
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          isSelected && "bg-accent text-accent-foreground",
          className,
        )}
        onClick={() => {
          setValue(itemValue);
          setInputValue("");
          setOpen(false);
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    );
  },
);
ComboboxItem.displayName = "ComboboxItem";

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
};
