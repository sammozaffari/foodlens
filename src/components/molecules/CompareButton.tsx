'use client';

interface CompareButtonProps {
  barcode: string;
  isSelected: boolean;
  onToggle: (barcode: string) => void;
}

export function CompareButton({ barcode, isSelected, onToggle }: CompareButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(barcode);
      }}
      aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
      aria-pressed={isSelected}
      className={`
        flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
        transition-colors duration-150 cursor-pointer flex-shrink-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${isSelected
          ? 'bg-primary text-white'
          : 'bg-transparent text-text-muted border border-border hover:border-border-strong hover:text-text'
        }
      `}
    >
      {isSelected ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      <span>{isSelected ? 'Added' : 'Compare'}</span>
    </button>
  );
}
