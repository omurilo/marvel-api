import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import useScreenOrientation from "application/hooks/useScreenOrientation";

import {
  getComics,
  getEventComics,
  getEventDetail,
  getEvents,
} from "infrastructure/services/marvel";

import Footer from "ui/components/Footer";
import { Card } from "ui/components/Card";
import ComicCard from "ui/components/ComicCard";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import Banner from "ui/components/Banner";
import SimpleCard from "ui/components/SimpleCard";
import useIntersectionObserver from "application/hooks/useIntersectionObserver";
import { Loading } from "ui/components/Loading";
import { SectionTitle } from "ui/components/SectionTitle";

const EventComicsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const [offset, setOffset] = React.useState(Number(props.offset));
  const [comics, setComics] = React.useState(props.comics);

  const observerRef = React.useRef(null);
  const orientation = useScreenOrientation();

  const observer = useIntersectionObserver(observerRef, { threshold: 0.33 });

  React.useEffect(() => {
    if (observer?.isIntersecting) {
      if (observer.intersectionRatio >= 0.33) {
        setOffset((past) => past + Number(props.limit));
      }
    }
  }, [observer, props.limit]);

  React.useEffect(() => {
    if (offset > props.offset) {
      if (offset < Number(props.total)) {
        getComics({ offset, limit: props.limit }).then((response) =>
          setComics((past) => [...past, ...response.results])
        );
      }
    }
  }, [offset, props.limit, props.total, props.offset]);

  return (
    <div>
      <Head>
        <title>Quadrinhos que o evento {props.event.title} acontece</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos onde o evento ${props.event.title} acontece.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o evento ${props.event.title} acontece`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos onde o evento ${props.event.title} acontece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o evento ${props.event.title} acontece`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos onde o evento ${props.event.title} acontece.`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${props.event.thumbnail.path}/portrait_uncanny.${props.event.thumbnail.extension}`}
                alt={props.event.title}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{props.event.title}</Banner.Title>
              {props.event.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: props.event.description,
                  }}
                />
              )}
            </Banner.Info>
          </Banner.Container>
        </Container>
        <Container>
          <SectionTitle>Quadrinhos</SectionTitle>
          <div>
            {comics?.map((comic) => (
              <ComicCard.Container key={comic.id}>
                <ComicCard.Image
                  src={`${comic.thumbnail.path}/${orientation}_incredible.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  objectFit="cover"
                  objectPosition="top"
                  width={216}
                  height={324}
                />
                <ComicCard.Info>
                  <SimpleCard.Title as="h2">{comic.title}</SimpleCard.Title>
                  <ComicCard.Text
                    dangerouslySetInnerHTML={{
                      __html:
                        comic.description?.length > 350
                          ? comic.description?.slice(0, 350).padEnd(353, "...")
                          : comic.description,
                    }}
                  />
                  <Link
                    passHref
                    href={`/comics/:title/:id`}
                    as={`/comics/${comic.title.replace(
                      /[^-a-zA-Z0-9z]+/g,
                      ""
                    )}/${comic.id}`}
                  >
                    <Card.Link>
                      <ComicCard.Text>Ver mais</ComicCard.Text>
                    </Card.Link>
                  </Link>
                </ComicCard.Info>
              </ComicCard.Container>
            ))}
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }} ref={observerRef}>
            {offset <= props.total && observer?.isIntersecting && <Loading />}
          </div>
        </Container>
        <Footer />
      </main>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getEvents({ limit: 14 });

  const paths = response.results.map((event) => ({
    params: {
      id: String(event.id),
      title: event.title.replace(/[^a-zA-Z0-9]+/g, ""),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id } = params as { id: string; title: string };

  const response = await getEventComics({ id, limit: 14 });

  const {
    results: [{ title, description, thumbnail }],
  } = await getEventDetail({ id });

  const event = {
    title,
    description: description || null,
    thumbnail,
  };

  return {
    props: {
      event,
      comics: response.results,
      offset: response.offset,
      limit: response.limit,
      total: response.total,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default EventComicsPage;
