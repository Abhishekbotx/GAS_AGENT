interface Message {
  type: "bot" | "user";
  text: string;
}

export default function Transcript({
  messages,
}: {
  messages: Message[];
}) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex gap-3 ${
            msg.type === "user"
              ? "justify-end"
              : ""
          }`}
        >
          {msg.type === "bot" && (
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center">
              AI
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 max-w-xl">
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}