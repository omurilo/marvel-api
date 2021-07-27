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
import { useRouter } from "next/dist/client/router";
import useScreenOrientation from "../application/hooks/useScreenOrientation";

type HomePageProps = {
  characters: Character[];
  comics: Comic[];
  events: Event[];
};

export default function Home({ characters, comics, events }: HomePageProps) {
  const router = useRouter();
  const orientation = useScreenOrientation();

  const handleNavigate = (url: string) => () => {
    router.push(url);
  };

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
              <CardContainer
                key={character.id}
                onClick={handleNavigate(
                  `/characters/${character.name}/${character.id}`
                )}
                alt={`Ir para detalhes de ${character.name}`}
                title={`Ir para detalhes de ${character.name}`}
              >
                <>
                  <figure>
                    <Card.Image
                      src={`${character.thumbnail.path}/${orientation}_fantastic.${character.thumbnail.extension}`}
                      alt={character.name}
                      layout="fill"
                      objectFit="fill"
                    />
                  </figure>
                  <Card.Header>
                    <Card.Title>{character.name}</Card.Title>
                    {character.description && (
                      <Card.Description>
                        <p>{character.description?.slice(0, 64)}</p>
                        <>
                          ...<div>Ver mais</div>
                        </>
                      </Card.Description>
                    )}
                    {character.events.available > 0 && (
                      <Link
                        passHref
                        href="/characters/:name/:id/events"
                        as={`/characters/${character.name}/${character.id}/events`}
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
              </CardContainer>
            ))}
          </div>
        </Container>
        <Container>
          <SectionTitle as="h2">Quadrinhos</SectionTitle>
          <div>
            {comics?.map((comic) => (
              <CardContainer
                key={comic.id}
                onClick={handleNavigate(
                  `/comics/${comic.title.replace(/[^-a-zA-Z0-9]+/g, "")}/${
                    comic.id
                  }`
                )}
                alt={`Ir para detalhes de ${comic.title}`}
                title={`Ir para detalhes de ${comic.title}`}
              >
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
                        href="/comics/:title/:id/characters"
                        as={`/comics/${comic.title.replace(
                          /[^-a-zA-Z0-9]+/g,
                          ""
                        )}/${comic.id}/characters`}
                      >
                        <Card.Link>
                          Personagens: <var>{comic.characters.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                    {comic.events.available > 0 && (
                      <Link
                        passHref
                        href="/comics/:title/:id/events"
                        as={`/comics/${comic.title.replace(
                          /[^-a-zA-Z0-9]+/g,
                          ""
                        )}/${comic.id}/events`}
                      >
                        <Card.Link>
                          Eventos: <var>{comic.events.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                  </Card.Header>
                </>
              </CardContainer>
            ))}
          </div>
        </Container>
        <Container>
          <SectionTitle>Eventos</SectionTitle>
          <div>
            {events?.map((event) => (
              <CardContainer
                key={event.id}
                onClick={handleNavigate(`/events/${event.title}/${event.id}`)}
                alt={`Ir para detalhes de ${event.title}`}
                title={`Ir para detalhes de ${event.title}`}
              >
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
                        href="/events/:title/:id/characters"
                        as={`/events/${event.title}/${event.id}/characters`}
                      >
                        <Card.Link>
                          Personagens: <var>{event.characters.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                    {event.comics.available > 0 && (
                      <Link
                        passHref
                        href="/events/:title/:id/events"
                        as={`/events/${event.title}/${event.id}/events`}
                      >
                        <Card.Link>
                          Quadrinhos: <var>{event.comics.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                  </Card.Header>
                </>
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
