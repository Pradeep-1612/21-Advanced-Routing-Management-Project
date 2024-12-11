import { useRouteLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

export default function EditEvent() {
  const { event } = useRouteLoaderData("event-detail");
  return (
    <>
      <EventForm method="PATCH" event={event}></EventForm>
    </>
  );
}
