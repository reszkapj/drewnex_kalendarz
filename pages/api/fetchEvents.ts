import { google } from "googleapis";
import {
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";

export default async function handler(req, res) {
  const { token, calendarId, rangeType, customStart, customEnd, topCount } = req.body;

  if (!token) return res.status(400).json({ error: "Missing Google token" });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: "v3", auth });

  let timeMin, timeMax;
  const now = new Date();

  switch (rangeType) {
    case "previous_week":
      timeMin = startOfWeek(subDays(now, 7));
      timeMax = endOfWeek(subDays(now, 7));
      break;
    case "current_week":
      timeMin = startOfWeek(now);
      timeMax = endOfWeek(now);
      break;
    case "previous_month":
      timeMin = startOfMonth(subDays(now, 30));
      timeMax = endOfMonth(subDays(now, 30));
      break;
    case "current_month":
      timeMin = startOfMonth(now);
      timeMax = endOfMonth(now);
      break;
    case "previous_quarter":
      timeMin = startOfQuarter(subDays(now, 90));
      timeMax = endOfQuarter(subDays(now, 90));
      break;
    case "current_quarter":
      timeMin = startOfQuarter(now);
      timeMax = endOfQuarter(now);
      break;
    case "previous_year":
      timeMin = startOfYear(subDays(now, 365));
      timeMax = endOfYear(subDays(now, 365));
      break;
    case "current_year":
      timeMin = startOfYear(now);
      timeMax = endOfYear(now);
      break;
    case "custom":
      timeMin = new Date(customStart);
      timeMax = new Date(customEnd);
      break;
    default:
      return res.status(400).json({ error: "Invalid range type" });
  }

  const eventsRes = await calendar.events.list({
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500,
  });

  const events = eventsRes.data.items || [];

  const groupMapping = ["Lasy", "Banki", "Tartak", "Sprzedaż"];
  const processedEvents = events.map(event => {
    const title = event.summary || "Bez tytułu";
    const start = new Date(event.start?.dateTime || event.start?.date);
    const end = new Date(event.end?.dateTime || event.end?.date);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;

    let groupName = "Inne";
    for (const prefix of groupMapping) {
      if (title.startsWith(prefix)) {
        groupName = prefix;
        break;
      }
    }

    return {
      title,
      start,
      end,
      durationMinutes,
      groupName,
    };
  });

  // ✅ Grupowanie po tytule
  const groupedEvents = {};

  for (const event of processedEvents) {
    const key = event.title;

    if (!groupedEvents[key]) {
      groupedEvents[key] = {
        title: event.title,
        durationMinutes: 0,
        count: 0,
        groupName: event.groupName,
      };
    }

    groupedEvents[key].durationMinutes += event.durationMinutes;
    groupedEvents[key].count += 1;
  }

  // Zamień na tablicę
  const finalEvents = Object.values(groupedEvents);

  // Posortuj po czasie trwania malejąco
  finalEvents.sort((a, b) => b.durationMinutes - a.durationMinutes);

  // Przytnij do topCount
  const topEvents = finalEvents.slice(0, topCount || 10);

  res.status(200).json({ events: topEvents });
}
