import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Character from "domain/entities/character";
import { getCharacters } from "infrastructure/services/marvel";
import useIntersectionObserver from "application/hooks/useIntersectionObserver";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import { SectionTitle } from "ui/components/SectionTitle";
import Footer from "ui/components/Footer";
import { Loading } from "ui/components/Loading";
import useScreenOrientation from "application/hooks/useScreenOrientation";

type HomePageProps = {
  characters: Character[];
  total: number;
  limit: number;
  offset: number;
};

export default function Characters({
  characters: initialCharacters,
  total,
  limit,
  offset: initialOffset,
}: HomePageProps) {
  const [offset, setOffset] = useState(Number(initialOffset));
  const [characters, setCharacters] = useState(initialCharacters);

  const router = useRouter();
  const orientation = useScreenOrientation();
  const observerRef = useRef(null);
  const observer = useIntersectionObserver(observerRef, { threshold: 0.33 });

  const handleNavigate = (character: Character) => () => {
    router.push(`/characters/${character.name.replace(/[^a-zA-Z0-9]+/g, "")}/${character.id}`);
  };

  useEffect(() => {
    if (observer?.isIntersecting) {
      if (observer.intersectionRatio >= 0.33) {
        setOffset((past) => past + limit);
      }
    }
  }, [observer, limit]);

  useEffect(() => {
    if (offset > initialOffset) {
      if (offset < Number(total)) {
        getCharacters({ offset, limit }).then((response) =>
          setCharacters((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, limit, total, initialOffset]);

  return (
    <div>
      <Head>
        <title>Personagens - Marvel Comics</title>
        <meta
          name="description"
          content="Lista de personagens da Marvel Comics"
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
                onClick={handleNavigate(character)}
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
                        {character.description?.slice(0, 64)}
                        <>
                          ...<div>Ver mais</div>
                        </>
                      </Card.Description>
                    )}
                    {character.events.available > 0 && (
                      <Link
                        passHref
                        href="/characters/:name/:id/events"
                        as={`/characters/${character.name.replace(/[^a-zA-Z0-9]+/g, "")}/${character.id}/events`}
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
                        as={`/characters/${character.name.replace(/[^a-zA-Z0-9]+/g, "")}/${character.id}/comics`}
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
  const response = await getCharacters({ limit: 36 });

  return {
    props: {
      offset: response.offset,
      limit: response.limit,
      total: response.total,
      characters: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
}
