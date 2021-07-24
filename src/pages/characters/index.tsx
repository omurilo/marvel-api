import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Character from "domain/entities/character";
import { getCharacters } from "infrastructure/services/marvel";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import { SectionTitle } from "../../ui/components/SectionTitle";
import Footer from "../../ui/components/Footer";
import { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../application/hooks/useIntersectionObserver";
import { Loading } from "../../ui/components/Loading";

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

  const observerRef = useRef(null);
  const observer = useIntersectionObserver(observerRef, { threshold: 0.33 });

  useEffect(() => {
    if (observer?.isIntersecting) {
      if (observer.intersectionRatio >= 0.33) {
        setOffset((past) => past + 36);
      }
    }
  }, [observer]);

  useEffect(() => {
    if (offset > initialOffset) {
      if (offset + Number(limit) < Number(total)) {
        getCharacters({ offset, limit }).then((response) =>
          setCharacters((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, limit, total, initialOffset]);

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
                        {character.description?.slice(0, 64)}
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
          <div style={{ width: "100%", marginTop: "2rem" }} ref={observerRef}>
            {observer?.isIntersecting && <Loading />}
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
