interface FeedbackTagProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FeedbackTag({ label, isSelected, onClick }: FeedbackTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer hover:opacity-[70%] px-4 py-2 rounded-full transition-all border-2 ${
        isSelected
          ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
          : 'bg-[var(--btn-secondary)] border-[var(--btn-secondary)]'
      }`}
      style={!isSelected ? { color: 'var(--btn-secondary-text)' } : {}}
    >
      {label}
    </button>
  );
}
