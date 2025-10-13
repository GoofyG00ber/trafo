const BASE = 'http://localhost:3000/events'

type EventLike = Record<string, any>

async function handleRes(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch (_) {
    return text
  }
}

export async function getEvents(): Promise<EventLike[]> {
  const res = await fetch(BASE, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Failed to fetch events: ' + res.status)
  return (await handleRes(res)) || []
}

export async function getEvent(id: string | number): Promise<EventLike | null> {
  const res = await fetch(`${BASE}/${encodeURIComponent(String(id))}`, { headers: { Accept: 'application/json' } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch event: ' + res.status)
  return await handleRes(res)
}

export async function createEvent(payload: EventLike): Promise<EventLike> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('Create failed: ' + res.status + ' ' + t)
  }
  return await handleRes(res)
}

export async function updateEvent(id: string | number, payload: EventLike): Promise<EventLike> {
  const res = await fetch(`${BASE}/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('Update failed: ' + res.status + ' ' + t)
  }
  return await handleRes(res)
}

export async function deleteEvent(id: string | number): Promise<void> {
  const res = await fetch(`${BASE}/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('Delete failed: ' + res.status + ' ' + t)
  }
}

export default {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
}
