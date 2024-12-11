import { Await, data, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import { loadEvents } from "./Events";
import { Suspense } from "react";
import EventsList from "../components/EventsList";

export default function EventDetail() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>
            Loading the selected event details...
          </p>
        }
      >
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>Loading all available events...</p>
        }
      >
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

async function loadEvent(eventId) {
  const response = await fetch(`http://localhost:8080/events/${eventId}`);
  if (!response.ok) {
    throw data({ message: "Couldn't fetch event details." }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

export async function eventDetailLoader({ params }) {
  const eventId = params.eventId;
  return {
    event: await loadEvent(eventId), // Added 'await', because this ensures to load the page only after the event details are fetched
    events: loadEvents(), // No 'await', because this ensures to lazy load all events list once after the page is loaded
  };
}

export async function deleteEventAction({ request, params }) {
  const response = await fetch(
    `http://localhost:8080/events/${params.eventId}`,
    {
      method: request.method,
    }
  );
  if (!response.ok) {
    throw data({ message: "Couldn't delete the event." }, { status: 500 });
  }

  return redirect("/events");
}
