import { useEffect, useState } from "react";

const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function getRelativeTime(value: string): string {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  let duration = seconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "year");
}

interface RelativeTimeProps {
  children: string;
  interval?: number;
}

const RelativeTime = ({ children, interval = 60_000 }: RelativeTimeProps) => {
  const [label, setLabel] = useState(() => getRelativeTime(children));

  useEffect(() => {
    setLabel(getRelativeTime(children));

    const timerId = window.setInterval(() => {
      setLabel(getRelativeTime(children));
    }, interval);

    return () => {
      window.clearInterval(timerId);
    };
  }, [children, interval]);

  return <>{label}</>;
};

export default RelativeTime;

export function FormattedDate({ children }: { children: string }) {
  const date = new Date(children);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return <>{`${year}/${month}/${day}`}</>;
}
