import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getEventCharacters,
  getEventComics,
  getEventDetail,
  getEvents,
} from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";
import Header from "ui/components/Header";
import Banner from "ui/components/Banner";
import { SectionTitle } from "ui/components/SectionTitle";
import SimpleCard from "ui/components/SimpleCard";
import { Card } from "ui/components/Card";
import Footer from "ui/components/Footer";

const EventPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>{props.event.title}</title>
        <meta name="description" content={props.event.description} />
        <meta
          name="og:image"
          content={`${props.event.thumbnail.path}/portrait_incredible.${props.event.thumbnail.extension}`}
        />
        <meta name="og:title" content={props.event.title} />
        <meta name="og:description" content={props.event.description} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={props.event.resourceURI} />
        <meta name="og:site_name" content="Marvel Events" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta name="twitter:title" content={props.event.title} />
        <meta name="twitter:description" content={props.event.description} />
        <meta
          name="twitter:image"
          content={`${props.event.thumbnail.path}/portrait_incredible.${props.event.thumbnail.extension}`}
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
        {props.event.characters.returned > 0 && (
          <Container>
            <SectionTitle>Personagens</SectionTitle>
            <div>
              {props.event.characters.items.map((character) => (
                <SimpleCard.Container key={character.id}>
                  <Link
                    passHref
                    href="/characters/:name/:id"
                    as={`/characters/${character.name?.replace(
                      /[^-a-zA-Z0-9]+/g,
                      ""
                    )}/${character.id}`}
                  >
                    <Card.Link>
                      <SimpleCard.Image
                        src={`${character.thumbnail!.path}/portrait_fantastic.${
                          character.thumbnail!.extension
                        }`}
                        alt={character.name}
                        width="168"
                        height="252"
                      />
                      <SimpleCard.Title>{character.name}</SimpleCard.Title>
                    </Card.Link>
                  </Link>
                </SimpleCard.Container>
              ))}
              {props.event.characters.available > 5 ? (
                <SimpleCard.Container>
                  <Link
                    passHref
                    href="/events/:name/:id/characters"
                    as={`/events/${props.event.title.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.event.id}/characters`}
                  >
                    <Banner.Link>
                      <span>Ver todos</span>
                    </Banner.Link>
                  </Link>
                </SimpleCard.Container>
              ) : null}
            </div>
          </Container>
        )}
        {props.event.comics.returned > 0 && (
          <Container>
            <SectionTitle>Últimos Quadrinhos</SectionTitle>
            <div>
              {props.event.comics.items.map((event) => (
                <SimpleCard.Container key={event.id}>
                  <Link
                    passHref
                    href="/comics/:title/:id"
                    as={`/comics/${event.title?.replace(
                      /[^-a-zA-Z0-9]+/g,
                      ""
                    )}/${event.id}`}
                  >
                    <Card.Link>
                      <SimpleCard.Image
                        src={`${event.thumbnail!.path}/portrait_fantastic.${
                          event.thumbnail!.extension
                        }`}
                        alt={event.title}
                        width="168"
                        height="252"
                      />
                      <SimpleCard.Title>{event.title}</SimpleCard.Title>
                    </Card.Link>
                  </Link>
                </SimpleCard.Container>
              ))}
              {props.event.comics.available > 5 ? (
                <SimpleCard.Container>
                  <Link
                    passHref
                    href="/events/:name/:id/comics"
                    as={`/events/${props.event.title.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.event.id}/comics`}
                  >
                    <Banner.Link>
                      <span>Ver todos</span>
                    </Banner.Link>
                  </Link>
                </SimpleCard.Container>
              ) : null}
            </div>
          </Container>
        )}
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

  const { id } = params as { id: string };

  const {
    results: [event],
  } = await getEventDetail({ id });

  const characters = await getEventCharacters({ id, limit: 5 });
  const comics = await getEventComics({ id, limit: 5 });

  event.characters.items = characters.results;
  event.characters.available = characters.count;

  event.comics.items = comics.results;
  event.comics.available = comics.count;

  return {
    props: {
      event,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default EventPage;
