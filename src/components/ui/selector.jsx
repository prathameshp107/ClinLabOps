import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Selector({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyText = "No results found.",
  searchPlaceholder = "Search...",
  className,
  buttonClassName,
  popoverClassName,
  disabled = false,
  renderOption,
  renderValue,
}) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const selectedOption = options.find((option) => option.value === value);
  const listRef = React.useRef(null);

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      onValueChange(options[highlightedIndex].value, options[highlightedIndex]);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!open) setHighlightedIndex(-1);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", buttonClassName)}
          disabled={disabled}
        >
          <div className="flex items-center overflow-hidden">
            {selectedOption?.icon && (
              <selectedOption.icon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            {selectedOption ? (
              <span className="truncate">
                {renderValue
                  ? renderValue(selectedOption)
                  : renderOption
                    ? renderOption(selectedOption)
                    : selectedOption.label}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[--radix-popover-trigger-width] p-0", popoverClassName)}
        align="start"
        onKeyDown={handleKeyDown}
      >
        <Command className={className}>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option, idx) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onValueChange(option.value, option);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer",
                  highlightedIndex === idx && "bg-accent text-accent-foreground"
                )}
                aria-selected={highlightedIndex === idx}
              >
                <div className="flex w-full items-center">
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="flex-1">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
