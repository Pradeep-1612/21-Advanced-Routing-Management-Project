import { Suspense } from "react";
import EventsList from "../components/EventsList";
import { useLoaderData, Await } from "react-router-dom";

function EventsPage() {
  const { events } = useLoaderData();
  return (
    <>
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

export default EventsPage;

export async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Couldn't fetch events!" }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function eventsLoader() {
  return {
    events: loadEvents(),
  };
}
