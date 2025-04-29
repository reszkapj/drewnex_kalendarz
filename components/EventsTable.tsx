
import React from "react";

interface Event {
  title: string;
  start: string;
  durationMinutes: number;
  groupName: string;
}

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left font-semibold text-sm text-gray-700">Tytuł</th>
            <th className="p-3 text-left font-semibold text-sm text-gray-700">Czas trwania (min)</th>
            <th className="p-3 text-left font-semibold text-sm text-gray-700">Grupa</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, idx) => (
            <tr key={idx} className="hover:bg-blue-50 transition">
              <td className="p-3 border-b text-sm">{event.title}</td>
              <td className="p-3 border-b text-sm">{Math.round(event.durationMinutes)}</td>
              <td className="p-3 border-b text-sm">{event.groupName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
