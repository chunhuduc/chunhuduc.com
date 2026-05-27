type ChatSendButtonProps = {
  loading: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
};

export default function ChatSendButton({
  loading,
  disabled = false,
  label = "Send",
  loadingLabel = "Sending…",
  className = "",
}: ChatSendButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex min-w-[5.5rem] shrink-0 items-center justify-center gap-2 rounded-lg bg-accent font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
            aria-hidden
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
