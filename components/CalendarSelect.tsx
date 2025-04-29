
import React from "react";

interface CalendarSelectProps {
  calendars: { id: string; summary: string }[];
  calendarId: string;
  setCalendarId: (id: string) => void;
  rangeType: string;
  setRangeType: (range: string) => void;
  topCount: number;
  setTopCount: (count: number) => void;
  onFetch: () => void;
}

export default function CalendarSelect({
  calendars,
  calendarId,
  setCalendarId,
  rangeType,
  setRangeType,
  topCount,
  setTopCount,
  onFetch,
}: CalendarSelectProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6 items-center">
      <select className="p-2 rounded border w-full md:w-auto" onChange={(e) => setCalendarId(e.target.value)} value={calendarId}>
        {calendars.map((cal) => (
          <option key={cal.id} value={cal.id}>{cal.summary}</option>
        ))}
      </select>

      <select className="p-2 rounded border w-full md:w-auto" onChange={(e) => setRangeType(e.target.value)} value={rangeType}>
        <option value="current_week">Bieżący tydzień</option>
        <option value="previous_week">Poprzedni tydzień</option>
        <option value="current_month">Bieżący miesiąc</option>
        <option value="previous_month">Poprzedni miesiąc</option>
        <option value="current_quarter">Bieżący kwartał</option>
        <option value="previous_quarter">Poprzedni kwartał</option>
        <option value="current_year">Bieżący rok</option>
        <option value="previous_year">Poprzedni rok</option>
      </select>

      <select className="p-2 rounded border w-full md:w-auto" onChange={(e) => setTopCount(Number(e.target.value))} value={topCount}>
        {[3,5,10,20,30,50].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <button onClick={onFetch} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full md:w-auto">
        Pobierz
      </button>
    </div>
  );
}
