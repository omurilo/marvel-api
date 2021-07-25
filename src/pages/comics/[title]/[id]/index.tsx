import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";

import { getComicDetail, getComics } from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";

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
        <Container>
          <div>
            <h2>{props.comic.title}</h2>
            <p>{props.comic.description}</p>
            {/* <img
              src={`${props.comic.thumbnail.path}/portrait_incredible.${props.comic.thumbnail.extension}`}
              alt={props.comic.title}
            /> */}
          </div>
        </Container>
      </main>
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

  const { id } = params as { id: string };

  const response = await getComicDetail({ id });

  return {
    props: {
      comic: response.results[0],
    },
    revalidate: 24 * 60 * 60,
  };
};

export default ComicPage;
