"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/config";

type Point = { day: string; amount: number };

const fmtDay = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "short" });

/** Daily revenue, single series: bars in --chart-1, hover tooltip, table fallback. */
export function RevenueChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.amount), 0);
  const niceMax = max > 0 ? Math.ceil(max / Math.pow(10, Math.floor(Math.log10(max)))) * Math.pow(10, Math.floor(Math.log10(max))) : 1;
  const H = 180;
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <figure>
      <figcaption className="sr-only">Daily revenue for the last {data.length} days</figcaption>
      <div className="relative">
        {/* y gridlines */}
        <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: H }}>
          {(max > 0 ? [1, 0.5, 0] : [0]).map((f) => (
            <div key={f} className="absolute inset-x-0 flex items-center gap-2" style={{ top: (1 - f) * H }}>
              <span className="w-14 shrink-0 -translate-y-1/2 text-right text-[11px] tabular-nums text-muted-foreground">
                {f === 0 ? "0" : formatMoney(niceMax * f).replace(/\.00$/, "")}
              </span>
              <span className="h-px flex-1 -translate-y-1/2 bg-border" />
            </div>
          ))}
        </div>
        <div className="ml-16 flex items-end gap-[2px]" style={{ height: H }} onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => {
            const h = d.amount > 0 ? Math.max(3, (d.amount / niceMax) * H) : 0;
            return (
              <div
                key={d.day}
                className="relative flex h-full flex-1 items-end"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                aria-label={`${fmtDay(d.day)}: ${formatMoney(d.amount)}`}
              >
                <div
                  className="w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height: h,
                    background: "var(--chart-1)",
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
                {hover === i && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
                    <p className="text-muted-foreground">{fmtDay(d.day)}</p>
                    <p className="font-semibold tabular-nums text-foreground">{formatMoney(d.amount)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="ml-16 mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{fmtDay(data[0]?.day ?? "")}</span>
          <span>{fmtDay(data[data.length - 1]?.day ?? "")}</span>
        </div>
      </div>
      {total === 0 && (
        <p className="mt-3 text-center text-sm text-muted-foreground">No paid orders in this period yet.</p>
      )}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs text-muted-foreground">View as table</summary>
        <table className="mt-2 w-full text-xs">
          <tbody>
            {data.filter((d) => d.amount > 0).map((d) => (
              <tr key={d.day} className="border-t border-border">
                <td className="py-1.5">{fmtDay(d.day)}</td>
                <td className="py-1.5 text-right tabular-nums">{formatMoney(d.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
