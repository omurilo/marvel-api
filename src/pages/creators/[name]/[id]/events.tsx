import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import { getCreatorEvents, getCreators } from "infrastructure/services/marvel";
import Head from "next/head";

const CharacterEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Eventos que o criador {props.name} participou</title>
        <meta
          name="description"
          content={`Lista dos eventos onde o criador ${props.name} participa.`}
        />
        <meta
          name="og:title"
          content={`Eventos que o criador ${props.name} participou`}
        />
        <meta
          name="og:description"
          content={`Lista dos eventos onde o criador ${props.name} participa.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Eventos que o criador ${props.name} participou`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos eventos onde o criador ${props.name} participa.`}
        />
      </Head>
      <h1>{props.name} events</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getCreators({ limit: 14 });

  const paths = response.results.map((creator) => ({
    params: { id: String(creator.id), name: creator.firstName },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id, name } = params as { id: string; name: string };

  const response = await getCreatorEvents({ id });

  return {
    props: {
      name,
      events: response.results,
    },
  };
};

export default CharacterEventsPage;
