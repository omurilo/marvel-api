import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  getCharacterComics,
  getCharacterDetail,
  getCharacterEvents,
  getCharacters,
} from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";
import Header from "ui/components/Header";
import { SectionTitle } from "ui/components/SectionTitle";
import { Card } from "ui/components/Card";
import SimpleCard from "ui/components/SimpleCard";
import Banner from "ui/components/Banner";
import Footer from "ui/components/Footer";
import character from "../../../../__mocks__/marvel/character";

const CharacterPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>{props.character.name}</title>
        <meta name="description" content={props.character.description} />
        <meta
          name="og:image"
          content={`${props.character.thumbnail.path}/portrait_incredible.${props.character.thumbnail.extension}`}
        />
        <meta name="og:title" content={props.character.name} />
        <meta name="og:description" content={props.character.description} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={props.character.urls[0].url} />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta name="twitter:title" content={props.character.name} />
        <meta
          name="twitter:description"
          content={props.character.description}
        />
        <meta
          name="twitter:image"
          content={`${props.character.thumbnail.path}/portrait_incredible.${props.character.thumbnail.extension}`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${props.character.thumbnail.path}/portrait_uncanny.${props.character.thumbnail.extension}`}
                alt={props.character.name}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{props.character.name}</Banner.Title>
              {props.character.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: props.character.description,
                  }}
                />
              )}
              <Link passHref href={props.character.urls[0].url}>
                <Banner.Link target="_blank">
                  <span>Ver no site Marvel</span>
                </Banner.Link>
              </Link>
            </Banner.Info>
          </Banner.Container>
        </Container>
        {props.character.comics.returned > 0 && (
          <Container>
            <SectionTitle>Últimos lançamentos</SectionTitle>
            <div>
              {props.character.comics.items.map((comic) => (
                <SimpleCard.Container key={comic.id}>
                  <Link
                    passHref
                    href="/comics/:title/:id"
                    as={`/comics/${comic.title?.replace(
                      /[^-a-zA-Z0-9]+/g,
                      ""
                    )}/${comic.id}`}
                  >
                    <Card.Link>
                      <SimpleCard.Image
                        src={`${comic.thumbnail!.path}/portrait_fantastic.${
                          comic.thumbnail!.extension
                        }`}
                        alt={comic.title}
                        width="168"
                        height="252"
                      />
                      <SimpleCard.Title>{comic.title}</SimpleCard.Title>
                    </Card.Link>
                  </Link>
                </SimpleCard.Container>
              ))}
              {props.character.comics.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/characters/:name/:id/comics"
                    as={`/characters/${character.name.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${character.id}/comics`}
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
        {props.character.events.returned > 0 && (
          <Container>
            <SectionTitle>Últimos Eventos</SectionTitle>
            <div>
              {props.character.events.items.map((event) => (
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
              {props.character.comics.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/characters/:name/:id/events"
                    as={`/characters/${character.name.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${character.id}/events`}
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
  const response = await getCharacters({ limit: 14 });

  const paths = response.results.map((character) => ({
    params: {
      id: String(character.id),
      name: character.name.replace(/[^a-zA-Z0-9]+/g, ""),
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
    results: [character],
  } = await getCharacterDetail({ id });

  const comics = await getCharacterComics({ id, limit: 5 });
  const events = await getCharacterEvents({ id, limit: 5 });

  character.comics.items = comics.results;
  character.comics.returned = comics.count;

  character.events.items = events.results;
  character.events.returned = events.count;

  return {
    props: {
      character,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterPage;
