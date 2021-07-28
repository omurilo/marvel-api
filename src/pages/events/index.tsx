import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { getEvents } from "infrastructure/services/marvel";
import useIntersectionObserver from "application/hooks/useIntersectionObserver";
import useScreenOrientation from "application/hooks/useScreenOrientation";
import Event from "domain/entities/event";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import { SectionTitle } from "ui/components/SectionTitle";
import Footer from "ui/components/Footer";
import { Loading } from "ui/components/Loading";

type HomePageProps = {
  events: Event[];
  total: number;
  limit: number;
  offset: number;
};

export default function Comics({
  events: initialEvents,
  total,
  limit,
  offset: initialOffset,
}: HomePageProps) {
  const [offset, setOffset] = useState(Number(initialOffset));
  const [events, setEvents] = useState(initialEvents);

  const router = useRouter();
  const orientation = useScreenOrientation();
  const observerRef = useRef(null);
  const observer = useIntersectionObserver(observerRef, { threshold: 0.33 });

  const handleNavigate = (url: string) => () => {
    router.push(url);
  };

  useEffect(() => {
    if (observer?.isIntersecting) {
      if (observer.intersectionRatio >= 0.33) {
        setOffset((past) => past + Number(limit));
      }
    }
  }, [observer, limit]);

  useEffect(() => {
    if (offset > initialOffset) {
      if (offset < Number(total)) {
        getEvents({ offset, limit }).then((response) =>
          setEvents((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, limit, total, initialOffset]);

  return (
    <div>
      <Head>
        <title>Eventos - Marvel Comics</title>
        <meta title="description" content="Lista de eventos da Marvel Comics" />
      </Head>
      <Header />
      <main>
        <Container>
          <SectionTitle>Eventos</SectionTitle>
          <div>
            {events?.map((event) => (
              <CardContainer
                key={event.id}
                onClick={handleNavigate(
                  `/events/${event.title.replace(/[^a-zA-Z0-9]+/g, "")}/${
                    event.id
                  }`
                )}
                alt={`Ir para detalhes de ${event.title}`}
                title={`Ir para detalhes de ${event.title}`}
              >
                <>
                  <figure>
                    <Card.Image
                      src={`${event.thumbnail.path}/${orientation}_fantastic.${event.thumbnail.extension}`}
                      alt={event.title}
                      layout="fill"
                      objectFit="fill"
                    />
                  </figure>
                  <Card.Header>
                    <Card.Title>{event.title}</Card.Title>
                    {event.description && (
                      <Card.Description>
                        {event.description?.slice(0, 64)}
                        <>
                          ...<div>Ver mais</div>
                        </>
                      </Card.Description>
                    )}
                    {event.comics.available > 0 && (
                      <Link
                        passHref
                        href="/events/:title/:id/comics"
                        as={`/events/${event.title.replace(
                          /[^a-zA-Z0-9]+/g,
                          ""
                        )}/${event.id}/comics`}
                      >
                        <Card.Link>
                          Quadrinhos: <var>{event.comics.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                    {event.characters.available > 0 && (
                      <Link
                        passHref
                        href="/events/:title/:id/characters"
                        as={`/events/${event.title.replace(
                          /[^a-zA-Z0-9]+/g,
                          ""
                        )}/${event.id}/characters`}
                      >
                        <Card.Link>
                          Personagens: <var>{event.characters.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                  </Card.Header>
                </>
              </CardContainer>
            ))}
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }} ref={observerRef}>
            {offset <= total && observer?.isIntersecting && <Loading />}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const response = await getEvents({ limit: 36 });

  return {
    props: {
      offset: response.offset,
      limit: response.limit,
      total: response.total,
      events: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
}
