
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import CalendarSelect from "@/components/CalendarSelect";
import EventsTable from "@/components/EventsTable";

export default function Home() {
  const { data: session } = useSession();
  const [calendars, setCalendars] = useState([]);
  const [calendarId, setCalendarId] = useState("primary");
  const [rangeType, setRangeType] = useState("current_month");
  const [topCount, setTopCount] = useState(10);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetch("/api/fetchCalendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.accessToken })
      })
      .then(res => res.json())
      .then(data => setCalendars(data.calendars));
    }
  }, [session]);

  async function fetchData() {
    const res = await fetch("/api/fetchEvents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: session.accessToken, calendarId, rangeType, topCount })
    });
    const data = await res.json();
    setEvents(data.events);
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button onClick={() => signIn("google")} className="p-4 bg-green-600 text-white rounded hover:bg-green-700">
          Zaloguj się przez Google
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button onClick={() => signOut()} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4">
        Wyloguj
      </button>

      <CalendarSelect
        calendars={calendars}
        calendarId={calendarId}
        setCalendarId={setCalendarId}
        rangeType={rangeType}
        setRangeType={setRangeType}
        topCount={topCount}
        setTopCount={setTopCount}
        onFetch={fetchData}
      />

      {events.length > 0 && <EventsTable events={events} />}
    </div>
  );
}
