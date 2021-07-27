import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getCreatorDetail,
  getCreatorEvents,
  getCreators,
} from "infrastructure/services/marvel";
import Head from "next/head";
import Header from "../../../../ui/components/Header";
import { Container } from "../../../../ui/components/Container";
import Banner from "../../../../ui/components/Banner";
import Image from "next/image";
import { SectionTitle } from "../../../../ui/components/SectionTitle";
import SimpleCard from "../../../../ui/components/SimpleCard";
import Link from "next/link";
import { Card } from "../../../../ui/components/Card";
import Footer from "../../../../ui/components/Footer";

const CharacterEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Eventos que o criador {props.creator.name} participou</title>
        <meta
          name="description"
          content={`Lista dos eventos onde o criador ${props.creator.name} participa.`}
        />
        <meta
          name="og:title"
          content={`Eventos que o criador ${props.creator.name} participou`}
        />
        <meta
          name="og:description"
          content={`Lista dos eventos onde o criador ${props.creator.name} participa.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Eventos que o criador ${props.creator.name} participou`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos eventos onde o criador ${props.creator.name} participa.`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${props.creator.thumbnail.path}/portrait_uncanny.${props.creator.thumbnail.extension}`}
                alt={props.creator.name}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{props.creator.name}</Banner.Title>
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

  const response = await getCreatorEvents({ id });

  const {
    results: [{ fullName: name, description, thumbnail }],
  } = await getCreatorDetail({ id });

  const creator = {
    name,
    description: description || null,
    thumbnail,
  };

  return {
    props: {
      creator,
      events: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterEventsPage;
