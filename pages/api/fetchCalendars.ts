import { google } from "googleapis";

export default async function handler(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: "v3", auth });

  const calendars = await calendar.calendarList.list();
  const items = calendars.data.items?.map(cal => ({
    id: cal.id,
    summary: cal.summary
  })) || [];

  res.status(200).json({ calendars: items });
}
