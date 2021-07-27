import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getCharacterDetail,
  getCharacterEvents,
  getCharacters,
} from "infrastructure/services/marvel";
import Head from "next/head";
import { Container } from "ui/components/Container";
import Banner from "ui/components/Banner";
import Image from "next/image";
import Link from "next/link";
import SimpleCard from "ui/components/SimpleCard";
import { Card } from "ui/components/Card";
import { SectionTitle } from "ui/components/SectionTitle";
import Header from "ui/components/Header";
import Footer from "ui/components/Footer";

const CharacterEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Eventos que o personagem {props.character.name} participa</title>
        <meta
          name="description"
          content={`Lista dos eventos onde o personagem ${props.character.name} aparece.`}
        />
        <meta
          name="og:title"
          content={`Eventos que o personagem ${props.character.name} participa`}
        />
        <meta
          name="og:description"
          content={`Lista dos eventos onde o personagem ${props.character.name} aparece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Eventos que o personagem ${props.character.name} participa`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos eventos onde o personagem ${props.character.name} aparece.`}
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
        <Container>
          <SectionTitle>Eventos</SectionTitle>
          <div>
            {props.events.map((event) => (
              <SimpleCard.Container key={event.id}>
                <Link
                  passHref
                  href="/events/:title/:id"
                  as={`/events/${event.title?.replace(/[^-a-zA-Z0-9]+/g, "")}/${
                    event.id
                  }`}
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
          </div>
        </Container>
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

  const response = await getCharacterEvents({ id });
  const {
    results: [{ name, description, thumbnail, urls }],
  } = await getCharacterDetail({ id });

  const character = {
    name,
    description: description || null,
    thumbnail,
    urls,
  };

  return {
    props: {
      events: response.results,
      character,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterEventsPage;
