import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getCharacterEvents,
  getCharacters,
} from "infrastructure/services/marvel";
import Head from "next/head";

const CharacterEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Eventos que o personagem {props.name} participa</title>
        <meta
          name="description"
          content={`Lista dos eventos onde o personagem ${props.name} aparece.`}
        />
        <meta
          name="og:title"
          content={`Eventos que o personagem ${props.name} participa`}
        />
        <meta
          name="og:description"
          content={`Lista dos eventos onde o personagem ${props.name} aparece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Eventos que o personagem ${props.name} participa`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos eventos onde o personagem ${props.name} aparece.`}
        />
      </Head>
      <h1>{props.name} events</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getCharacters({ limit: 14 });

  const paths = response.results.map((character) => ({
    params: { id: String(character.id), name: character.name },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id, name } = params as { id: string; name: string };

  const response = await getCharacterEvents({ id });

  return {
    props: {
      name,
      events: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterEventsPage;
