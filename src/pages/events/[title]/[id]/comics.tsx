import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import useScreenOrientation from "application/hooks/useScreenOrientation";

import {
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

const EventComicsPage = ({
  event,
  comics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const orientation = useScreenOrientation();

  return (
    <div>
      <Head>
        <title>Quadrinhos que o evento {event.title} acontece</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos onde o evento ${event.title} acontece.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o evento ${event.title} acontece`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos onde o evento ${event.title} acontece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o evento ${event.title} acontece`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos onde o evento ${event.title} acontece.`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${event.thumbnail.path}/portrait_uncanny.${event.thumbnail.extension}`}
                alt={event.title}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{event.title}</Banner.Title>
              {event.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: event.description,
                  }}
                />
              )}
            </Banner.Info>
          </Banner.Container>
        </Container>
        <Container $row $center>
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
                    __html: comic.description?.length > 350 ? comic.description?.slice(0, 350).padEnd(353, "...") : comic.description,
                  }}
                />
                <Link
                  passHref
                  href={`/comics/:title/:id`}
                  as={`/comics/${comic.title.replace(/[^-a-zA-Z0-9z]+/g, "")}/${
                    comic.id
                  }`}
                >
                  <Card.Link>
                    <ComicCard.Text>Ver mais</ComicCard.Text>
                  </Card.Link>
                </Link>
              </ComicCard.Info>
            </ComicCard.Container>
          ))}
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

  const { results: comics } = await getEventComics({ id, limit: 5 });

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
      comics,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default EventComicsPage;
