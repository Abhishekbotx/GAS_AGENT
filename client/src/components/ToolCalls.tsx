interface Tool {
  name: string;
  status: string;
}

export default function ToolCalls({
  tools,
}: {
  tools: Tool[];
}) {
  return (
    <div className="space-y-3">
      {tools.map((tool, index) => (
        <div
          key={index}
          className="rounded-2xl border border-zinc-800 p-4"
        >
          <div className="font-semibold mb-1">
            {tool.name}
          </div>

          <div className="text-sm text-zinc-400">
            {tool.status}
          </div>
        </div>
      ))}
    </div>
  );
}