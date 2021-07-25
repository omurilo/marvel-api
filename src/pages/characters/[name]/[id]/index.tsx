import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";
import Head from "next/head";

import {
  getCharacterDetail,
  getCharacters,
} from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";

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
        <Container>
          <div>
            <h2>{props.character.name}</h2>
            <p>{props.character.description}</p>
            <p>
              <a href={props.character.urls[0].url}>Ver no site Marvel</a>
            </p>
          </div>
        </Container>
      </main>
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

  const { id } = params as { id: string };

  const response = await getCharacterDetail({ id });

  return {
    props: {
      character: response.results[0],
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterPage;
