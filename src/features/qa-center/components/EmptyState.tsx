import { useTheme, tokens } from "@/lib/theme";

type Props = { message: string; sub?: string };

export default function EmptyState({ message, sub }: Props) {
  const { theme } = useTheme();
  const t = tokens[theme];
  return (
    <div style={{ padding: "2rem 1rem", textAlign: "center", color: t.textFaint, fontSize: 13 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: t.textMuted, marginBottom: 4 }}>
        {message}
      </div>
      {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}
