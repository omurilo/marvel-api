import Head from "next/head";
import Link from "next/link";

import Character from "domain/entities/character";
import Comic from "domain/entities/comic";
import Event from "domain/entities/event";
import {
  getCharacters,
  getComics,
  getEvents,
} from "infrastructure/services/marvel";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import Footer from "ui/components/Footer";
import { SectionTitle } from "ui/components/SectionTitle";

type HomePageProps = {
  characters: Character[];
  comics: Comic[];
  events: Event[];
};

export default function Home({ characters, comics, events }: HomePageProps) {
  return (
    <div>
      <Head>
        <title>Marvel - API Consumer</title>
        <meta
          name="description"
          content="List all characters, comics, events and creators of Marvel"
        />
      </Head>
      <Header />
      <main>
        <Container>
          <SectionTitle>Personagens</SectionTitle>
          <div>
            {characters?.map((character) => (
              <CardContainer key={character.id}>
                <Link
                  href="/characters/:id"
                  as={`/characters/${character.id}`}
                  passHref
                >
                  <>
                    <figure>
                      <Card.Image
                        src={`${character.thumbnail.path}/standard_fantastic.${character.thumbnail.extension}`}
                        alt={character.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                    <Card.Header>
                      <Card.Title>{character.name}</Card.Title>
                      <Card.Description>
                        <p>{character.description?.slice(0, 64)}</p>
                        {character.description && (
                          <>
                            ...<div>Ver mais</div>
                          </>
                        )}
                      </Card.Description>
                      {character.events.available > 0 && (
                        <Link
                          passHref
                          href="/characters/:id/events"
                          as={`/characters/${character.id}/events`}
                        >
                          <Card.Link>
                            Eventos: <var>{character.events.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                      {character.comics.available > 0 && (
                        <Link
                          passHref
                          href="/characters/:name/:id/comics/"
                          as={`/characters/${character.name}/${character.id}/comics`}
                        >
                          <Card.Link>
                            Quadrinhos: <var>{character.comics.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                    </Card.Header>
                  </>
                </Link>
              </CardContainer>
            ))}
          </div>
        </Container>
        <Container>
          <SectionTitle as="h2">Quadrinhos</SectionTitle>
          <div>
            {comics?.map((comic) => (
              <CardContainer key={comic.id}>
                <Link href="/comics/:id" as={`/comics/${comic.id}`} passHref>
                  <>
                    <figure>
                      <Card.Image
                        src={`${comic.thumbnail.path}/standard_fantastic.${comic.thumbnail.extension}`}
                        alt={comic.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                    <Card.Header>
                      <Card.Title>{comic.title}</Card.Title>
                      {comic.characters.available > 0 && (
                        <Link
                          passHref
                          href="/comics/:id/characters"
                          as={`/comics/${comic.id}/characters`}
                        >
                          <Card.Link>
                            Personagens: <var>{comic.characters.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                      {comic.events.available > 0 && (
                        <Link
                          passHref
                          href="/comics/:id/events"
                          as={`/comics/${comic.id}/events`}
                        >
                          <Card.Link>
                            Eventos: <var>{comic.events.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                    </Card.Header>
                  </>
                </Link>
              </CardContainer>
            ))}
          </div>
        </Container>
        <Container>
          <SectionTitle>Eventos</SectionTitle>
          <div>
            {events?.map((event) => (
              <CardContainer key={event.id}>
                <Link href="/events/:id" as={`/events/${event.id}`} passHref>
                  <>
                    <figure>
                      <Card.Image
                        src={`${event.thumbnail.path}/standard_fantastic.${event.thumbnail.extension}`}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </figure>
                    <Card.Header>
                      <h2>{event.title}</h2>
                      {event.characters.available > 0 && (
                        <Link
                          passHref
                          href="/events/:id/characters"
                          as={`/events/${event.id}/characters`}
                        >
                          <Card.Link>
                            Personagens: <var>{event.characters.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                      {event.comics.available > 0 && (
                        <Link
                          passHref
                          href="/events/:id/events"
                          as={`/events/${event.id}/events`}
                        >
                          <Card.Link>
                            Quadrinhos: <var>{event.comics.available}</var>
                          </Card.Link>
                        </Link>
                      )}
                    </Card.Header>
                  </>
                </Link>
              </CardContainer>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const { results: characters } = await getCharacters({
    limit: 14,
    offset: Math.round(Math.random() * 14),
  });
  const { results: comics } = await getComics({ limit: 14 });
  const { results: events } = await getEvents({ limit: 14 });

  return {
    props: {
      characters,
      comics,
      events,
    },
    revalidate: 24 * 60 * 60,
  };
}
