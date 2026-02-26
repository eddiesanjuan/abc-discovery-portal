export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-assistant-bg rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-warm-gray rounded-full animate-dot-1" />
        <span className="w-2 h-2 bg-warm-gray rounded-full animate-dot-2" />
        <span className="w-2 h-2 bg-warm-gray rounded-full animate-dot-3" />
      </div>
    </div>
  );
}
