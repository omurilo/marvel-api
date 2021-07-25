import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import { getEventCharacters, getEvents } from "infrastructure/services/marvel";
import Head from "next/head";

const EventEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Personagens que fazem parte do evento {props.title}</title>
        <meta
          name="description"
          content={`Lista dos personagens que aparecem em ${props.title}`}
        />
        <meta
          name="og:title"
          content={`Personagens que fazem parte do evento ${props.title}`}
        />
        <meta
          name="og:description"
          content={`Lista dos personagens que aparecem em ${props.title}`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Personagens que fazem parte do evento ${props.title}`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos personagens que aparecem em ${props.title}`}
        />
      </Head>
      <h1>{props.title} characters</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getEvents({ limit: 14 });

  const paths = response.results.map((event) => ({
    params: { id: String(event.id), title: event.title },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id, title } = params as { id: string; title: string };

  const response = await getEventCharacters({ id });

  return {
    props: {
      title,
      characters: response.results,
    },
  };
};

export default EventEventsPage;
