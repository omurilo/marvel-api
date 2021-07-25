import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import { getComicEvents, getComics } from "infrastructure/services/marvel";
import Head from "next/head";

const CharacterEventsPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <div>
      <Head>
        <title>Eventos que acontecem no quadrinho {props.title}</title>
        <meta
          name="description"
          content={`Lista dos eventos que acontecem no quadrinho ${props.title}`}
        />
        <meta
          name="og:title"
          content={`Eventos que acontecem no quadrinho ${props.title}`}
        />
        <meta
          name="og:description"
          content={`Lista dos eventos que acontecem no quadrinho ${props.title}.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Eventos que acontecem no quadrinho ${props.title}`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos eventos que acontecem no quadrinho ${props.title}.`}
        />
      </Head>
      <h1>{props.title} characters</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getComics({ limit: 14 });

  const paths = response.results.map((comic) => ({
    params: { id: String(comic.id), title: comic.title },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id, title } = params as { id: string; title: string };

  const response = await getComicEvents({ id });

  return {
    props: {
      title,
      events: response.results,
    },
  };
};

export default CharacterEventsPage;
