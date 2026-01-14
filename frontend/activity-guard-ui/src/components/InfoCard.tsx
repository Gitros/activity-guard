import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function InfoCard({ label, children }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-zinc-200 break-words">{children}</div>
    </div>
  );
}
