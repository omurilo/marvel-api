import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getComicCharacters,
  getComicDetail,
  getComicEvents,
  getComics,
} from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";
import Header from "ui/components/Header";
import Banner from "ui/components/Banner";
import SimpleCard from "ui/components/SimpleCard";
import { Card } from "ui/components/Card";
import Footer from "ui/components/Footer";
import { SectionTitle } from "ui/components/SectionTitle";

const ComicPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>{props.comic.title}</title>
        <meta name="description" content={props.comic.description} />
        <meta
          name="og:image"
          content={`${props.comic.thumbnail.path}/portrait_incredible.${props.comic.thumbnail.extension}`}
        />
        <meta name="og:title" content={props.comic.title} />
        <meta name="og:description" content={props.comic.description} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={props.comic.resourceURI} />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta name="twitter:title" content={props.comic.title} />
        <meta name="twitter:description" content={props.comic.description} />
        <meta
          name="twitter:image"
          content={`${props.comic.thumbnail.path}/portrait_incredible.${props.comic.thumbnail.extension}`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${props.comic.thumbnail.path}/portrait_uncanny.${props.comic.thumbnail.extension}`}
                alt={props.comic.title}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{props.comic.title}</Banner.Title>
              {props.comic.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: props.comic.description,
                  }}
                />
              )}
            </Banner.Info>
          </Banner.Container>
        </Container>
        {props.comic.characters.returned > 0 && (
          <Container>
            <SectionTitle>Personagens</SectionTitle>
            <div>
              {props.comic.characters.items.map((character) => (
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
              {props.comic.characters.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/comics/:name/:id/characters"
                    as={`/comics/${props.comic.title.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.comic.id}/characters`}
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
        {props.comic.events.returned > 0 && (
          <Container>
            <SectionTitle>Últimos Eventos</SectionTitle>
            <div>
              {props.comic.events.items.map((event) => (
                <SimpleCard.Container key={event.id}>
                  <Link
                    passHref
                    href="/events/:title/:id"
                    as={`/events/${event.title?.replace(
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
              {props.comic.events.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/comics/:name/:id/events"
                    as={`/comics/${props.comic.title.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.comic.id}/events`}
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
  const response = await getComics({ limit: 14 });

  const paths = response.results.map((comic) => ({
    params: {
      id: String(comic.id),
      title: comic.title.replace(/[^a-zA-Z0-9]+/g, ""),
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
    results: [comic],
  } = await getComicDetail({ id });
  const characters = await getComicCharacters({ id });
  const events = await getComicEvents({ id, limit: 5 });

  comic.characters.items = characters.results;
  comic.characters.returned = characters.count;

  comic.events.items = events.results;
  comic.events.returned = events.count;

  return {
    props: {
      comic,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default ComicPage;
