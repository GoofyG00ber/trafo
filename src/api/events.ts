// src/api/events.ts
const BASE = 'http://localhost:3000/events'

export async function getEvents() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`)
  return res.json()
}

export async function getEvent(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error(`Event not found (${res.status})`)
  return res.json()
}

export async function createEvent(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Create failed (${res.status})`)
  return res.json()
}

export async function updateEvent(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Update failed (${res.status})`)
  return res.json()
}

export async function deleteEvent(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed (${res.status})`)
  return true
}

export default { getEvents, getEvent, createEvent, updateEvent, deleteEvent }
