/**
 * Google Calendar OAuth Integration
 *
 * Flow:
 * 1. User clicks "Connect Google Calendar"
 * 2. We redirect to Google OAuth consent screen
 * 3. Google redirects back to /gcal?code=... 
 * 4. We exchange the code for access + refresh tokens via Supabase Edge Function
 * 5. Tokens are stored in the `sites` table (google_access_token, google_refresh_token)
 * 6. When a booking is made, we call createCalendarEvent()
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/gcal`;
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
].join(' ');

/** Step 1 — redirect user to Google's consent screen */
export function redirectToGoogleOAuth() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',   // needed to get a refresh_token
    prompt: 'consent',         // force consent so we always get refresh_token
    state: crypto.randomUUID(), // CSRF protection
  });

  // Save state to verify on callback
  sessionStorage.setItem('oauth_state', params.get('state')!);
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/** Step 2 — called on /gcal page after Google redirects back */
export function getOAuthCodeFromURL(): { code: string | null; state: string | null; error: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
  };
}

/** Verify the state param matches what we stored (CSRF check) */
export function verifyOAuthState(returnedState: string): boolean {
  const savedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');
  return savedState === returnedState;
}

/** Step 3 — exchange code for tokens via your Supabase Edge Function */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/google-oauth-exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Token exchange failed');
  }

  return response.json();
}

/** Create a calendar event when a booking is confirmed */
export async function createCalendarEvent(params: {
  accessToken: string;
  summary: string;       // e.g. "Haircut — Ahmed"
  description?: string;
  startTime: string;     // ISO 8601
  endTime: string;       // ISO 8601
  attendeeEmail?: string;
  timeZone?: string;
}): Promise<string> {  // returns event ID
  const event = {
    summary: params.summary,
    description: params.description || '',
    start: { dateTime: params.startTime, timeZone: params.timeZone || 'UTC' },
    end: { dateTime: params.endTime, timeZone: params.timeZone || 'UTC' },
    attendees: params.attendeeEmail ? [{ email: params.attendeeEmail }] : [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
  };

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to create calendar event');
  }

  const data = await res.json();
  return data.id;
}

/** Delete a calendar event when a booking is cancelled */
export async function deleteCalendarEvent(accessToken: string, eventId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok && res.status !== 410) { // 410 = already deleted, that's fine
    throw new Error('Failed to delete calendar event');
  }
}

/** Fetch busy/free slots to show which times are available */
export async function getFreeBusySlots(params: {
  accessToken: string;
  timeMin: string;  // ISO 8601
  timeMax: string;  // ISO 8601
  timeZone?: string;
}): Promise<Array<{ start: string; end: string }>> {
  const body = {
    timeMin: params.timeMin,
    timeMax: params.timeMax,
    timeZone: params.timeZone || 'UTC',
    items: [{ id: 'primary' }],
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to fetch free/busy');

  const data = await res.json();
  return data.calendars?.primary?.busy || [];
}

/** Refresh an expired access token using the stored refresh token */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(`${supabaseUrl}/functions/v1/google-token-refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error('Token refresh failed');
  const data = await res.json();
  return data.access_token;
}
