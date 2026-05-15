import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailIcon = ({
  icon,
  alt,
  lable,
}: {
  icon: string;
  alt: string;
  lable: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{lable}</p>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
};
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let bookings = 16;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      title,
      organizer,
    },
  } = await response.json();

  if (!title) {
    return notFound();
  }

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
        <div className="details">
          <div className="content">
            <Image
              src={image}
              width={800}
              height={800}
              alt="event banner "
              className="banner"
            />
            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{overview}</p>
            </section>
            <section className="flex-col-gap-2">
              <h2>Event Details </h2>
              <EventDetailIcon
                icon="/icons/calendar.svg"
                alt="calender  icon"
                lable={date}
              />
              <EventDetailIcon
                icon="/icons/clock.svg"
                alt="clock Icon"
                lable={time}
              />
              <EventDetailIcon
                icon="/icons/pin.svg"
                alt="location Icon "
                lable={location}
              />
              <EventDetailIcon icon="/icons/mode.svg" alt="mode" lable={mode} />
              <EventDetailIcon
                icon="/icons/audience.svg"
                alt="audience"
                lable={audience}
              />
            </section>
            <EventAgenda agendaItems={agenda} />

            <section className="flex-col-gap-2">
              <h2>About the Organizer </h2>
              <p>{organizer}</p>
            </section>

            <EventTags tags={tags} />
          </div>

          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot </h2>
              {bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} people who have already book there spot!{" "}
                </p>
              ) : (
                <p className="text-sm"> Be The first to book your seat! </p>
              )}
              <BookEvent />
            </div>
          </aside>
        </div>
      </div>

      <div className="flex w-full  flex-col gap-4 pt-20">
        <h2 className="">Similar Events </h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents?.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default page;

// "use client";

// import { IEvent } from "@/database";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface EventResponse {
//   message?: string;
//   data?: IEvent;
//   success?: boolean;
// }

// const EventDetailPage = () => {
//   const [event, setEvent] = useState<EventResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const params = useParams<{ slug: string }>();
//   const slug = params?.slug as string;

//   async function fetchEvent(slug: string): Promise<void> {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch event: ${response.statusText}`);
//       }

//       const eventDetails: EventResponse = await response.json();
//       setEvent(eventDetails);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (slug) {
//       fetchEvent(slug);
//     }
//   }, [slug]);

//   return (
//     <div>
//       {loading && <p>Loading event...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {event && <p>Hare Krishna! {event.message}</p>}
//     </div>
//   );
// };

// export default EventDetailPage;
