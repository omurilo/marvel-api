import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getCreatorComics,
  getCreatorDetail,
  getCreatorEvents,
  getCreators,
} from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";
import Header from "ui/components/Header";
import Banner from "ui/components/Banner";
import { SectionTitle } from "ui/components/SectionTitle";
import SimpleCard from "ui/components/SimpleCard";
import { Card } from "ui/components/Card";
import Footer from "ui/components/Footer";

const CreatorPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>{props.creator.fullName}</title>
        <meta name="description" content={props.creator.description} />
        <meta
          name="og:image"
          content={`${props.creator.thumbnail.path}/portrait_incredible.${props.creator.thumbnail.extension}`}
        />
        <meta name="og:title" content={props.creator.fullName} />
        <meta name="og:description" content={props.creator.description} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={props.creator.urls[0].url} />
        <meta name="og:site_name" content="Marvel Creators" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta name="twitter:title" content={props.creator.fullName} />
        <meta name="twitter:description" content={props.creator.description} />
        <meta
          name="twitter:image"
          content={`${props.creator.thumbnail.path}/portrait_incredible.${props.creator.thumbnail.extension}`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${props.creator.thumbnail.path}/portrait_uncanny.${props.creator.thumbnail.extension}`}
                alt={props.creator.fullName}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{props.creator.fullName}</Banner.Title>
              {props.creator.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: props.creator.description,
                  }}
                />
              )}
            </Banner.Info>
          </Banner.Container>
        </Container>
        {props.creator.events.returned > 0 && (
          <Container>
            <SectionTitle>Personagens</SectionTitle>
            <div>
              {props.creator.events.items.map((event) => (
                <SimpleCard.Container key={event.id}>
                  <Link
                    passHref
                    href="/events/:name/:id"
                    as={`/events/${event.title?.replace(
                      /[^a-zA-Z0-9]+/g,
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
              {props.creator.comics.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/creators/:name/:id/comics"
                    as={`/creators/${props.creator.fullName.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.creator.id}/comics`}
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
        {props.creator.events.returned > 0 && (
          <Container>
            <SectionTitle>Últimos Eventos</SectionTitle>
            <div>
              {props.creator.events.items.map((event) => (
                <SimpleCard.Container key={event.id}>
                  <Link
                    passHref
                    href="/events/:title/:id"
                    as={`/events/${event.title?.replace(
                      /[^a-zA-Z0-9]+/g,
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
              {props.creator.events.available > 5 ? (
                <SimpleCard.Container $fit>
                  <Link
                    passHref
                    href="/creators/:name/:id/events"
                    as={`/creators/${props.creator.fullName.replace(
                      /[^a-zA-Z0-9]+/g,
                      ""
                    )}/${props.creator.id}/events`}
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
  const response = await getCreators({ limit: 14 });

  const paths = response.results.map((creator) => ({
    params: {
      id: String(creator.id),
      name: creator.fullName.replace(/[^a-zA-Z0-9]+/g, ""),
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
    results: [creator],
  } = await getCreatorDetail({ id });

  const events = await getCreatorEvents({ id, limit: 5 });
  const comics = await getCreatorComics({ id, limit: 5 });

  creator.events.items = events.results;
  creator.events.returned = events.count;

  creator.comics.items = comics.results;
  creator.comics.returned = comics.count;

  return {
    props: {
      creator,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CreatorPage;
