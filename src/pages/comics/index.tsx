import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import useIntersectionObserver from "application/hooks/useIntersectionObserver";
import { getComics } from "infrastructure/services/marvel";
import Comic from "domain/entities/comic";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import { SectionTitle } from "ui/components/SectionTitle";
import Footer from "ui/components/Footer";
import { Loading } from "ui/components/Loading";
import useScreenOrientation from "../../application/hooks/useScreenOrientation";

type HomePageProps = {
  comics: Comic[];
  total: number;
  limit: number;
  offset: number;
};

export default function Comics({
  comics: initialComics,
  total,
  limit,
  offset: initialOffset,
}: HomePageProps) {
  const [offset, setOffset] = useState(Number(initialOffset));
  const [comics, setComics] = useState(initialComics);

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
        setOffset((past) => past + limit);
      }
    }
  }, [observer, limit]);

  useEffect(() => {
    if (offset > initialOffset) {
      if (offset < Number(total)) {
        getComics({ offset, limit }).then((response) =>
          setComics((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, limit, total, initialOffset]);

  return (
    <div>
      <Head>
        <title>Quadrinhos - Marvel Comics</title>
        <meta
          title="description"
          content="Lista de quadrinhos da Marvel Comics"
        />
      </Head>
      <Header />
      <main>
        <Container>
          <SectionTitle>Quadrinhos</SectionTitle>
          <div>
            {comics?.map((comics) => (
              <CardContainer
                key={comics.id}
                onClick={handleNavigate(``)}
                alt={`Ir para detalhes de ${comics.title}`}
                title={`Ir para detalhes de ${comics.title}`}
              >
                <>
                  <figure>
                    <Card.Image
                      src={`${comics.thumbnail.path}/${orientation}_fantastic.${comics.thumbnail.extension}`}
                      alt={comics.title}
                      layout="fill"
                      objectFit="fill"
                    />
                  </figure>
                  <Card.Header>
                    <Card.Title>{comics.title}</Card.Title>
                    {comics.description && (
                      <Card.Description>
                        {comics.description?.slice(0, 64)}
                        <>
                          ...<div>Ver mais</div>
                        </>
                      </Card.Description>
                    )}
                    {comics.events.available > 0 && (
                      <Link
                        passHref
                        href="/comics/:title/:id/events"
                        as={`/comics/${comics.title}/${comics.id}/events`}
                      >
                        <Card.Link>
                          Eventos: <var>{comics.events.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                    {comics.characters.available > 0 && (
                      <Link
                        passHref
                        href="/comics/:title/:id/characters"
                        as={`/comics/${comics.title}/${comics.id}/characters`}
                      >
                        <Card.Link>
                          Personagens: <var>{comics.characters.available}</var>
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
  const response = await getComics({ limit: 36 });

  return {
    props: {
      offset: response.offset,
      limit: response.limit,
      total: response.total,
      comics: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
}
