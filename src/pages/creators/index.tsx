import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Creator from "domain/entities/creator";
import { getCreators } from "infrastructure/services/marvel";
import useIntersectionObserver from "application/hooks/useIntersectionObserver";
import useScreenOrientation from "application/hooks/useScreenOrientation";

import CardContainer, { Card } from "ui/components/Card";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import { SectionTitle } from "ui/components/SectionTitle";
import Footer from "ui/components/Footer";
import { Loading } from "ui/components/Loading";

type HomePageProps = {
  creators: Creator[];
  total: number;
  limit: number;
  offset: number;
};

export default function Creators({
  creators: initialCreators,
  total,
  limit,
  offset: initialOffset,
}: HomePageProps) {
  const [offset, setOffset] = useState(Number(initialOffset));
  const [creators, setCreators] = useState(initialCreators);

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
        getCreators({ offset, limit }).then((response) =>
          setCreators((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, limit, total, initialOffset]);

  return (
    <div>
      <Head>
        <title>Criadores - Marvel Comics</title>
        <meta
          name="description"
          content="Lista de criadores da Marvel Comics"
        />
      </Head>
      <Header />
      <main>
        <Container>
          <SectionTitle>Criadores</SectionTitle>
          <div>
            {creators?.map((creator) => (
              <CardContainer
                key={creator.id}
                onClick={handleNavigate(
                  `/creators/${creator.firstName.replace(
                    /[^-a-zA-Z0-9]+/g,
                    ""
                  )}/${creator.id}`
                )}
                alt={`Ir para detalhes de ${creator.fullName}`}
                title={`Ir para detalhes de ${creator.fullName}`}
              >
                <>
                  <figure>
                    <Card.Image
                      src={`${creator.thumbnail.path}/${orientation}_fantastic.${creator.thumbnail.extension}`}
                      alt={creator.fullName}
                      layout="fill"
                      objectFit="fill"
                    />
                  </figure>
                  <Card.Header>
                    <Card.Title>{creator.fullName}</Card.Title>
                    {creator.description && (
                      <Card.Description>
                        {creator.description?.slice(0, 64)}
                        <>
                          ...<div>Ver mais</div>
                        </>
                      </Card.Description>
                    )}
                    {creator.events.available > 0 && (
                      <Link
                        passHref
                        href="/creators/:name/:id/events"
                        as={`/creators/${creator.fullName.replace(/[^-a-zA-Z0-9]+/g, "")}/${creator.id}/events`}
                      >
                        <Card.Link>
                          Eventos: <var>{creator.events.available}</var>
                        </Card.Link>
                      </Link>
                    )}
                    {creator.comics.available > 0 && (
                      <Link
                        passHref
                        href="/creators/:name/:id/comics/"
                        as={`/creators/${creator.fullName.replace(/[^-a-zA-Z0-9]+/g, "")}/${creator.id}/comics`}
                      >
                        <Card.Link>
                          Quadrinhos: <var>{creator.comics.available}</var>
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
  const response = await getCreators({ limit: 36 });

  return {
    props: {
      offset: response.offset,
      limit: response.limit,
      total: response.total,
      creators: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
}
