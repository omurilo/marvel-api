import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";

import { getCreatorDetail, getCreators } from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";

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
        <Container>
          <div>
            <h2>{props.creator.fullName}</h2>
            <p>{props.creator.description}</p>
            {/* <img
              src={`${props.creator.thumbnail.path}/portrait_incredible.${props.creator.thumbnail.extension}`}
              alt={props.creator.title}
            /> */}
          </div>
        </Container>
      </main>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getCreators({ limit: 14 });

  const paths = response.results.map((creator) => ({
    params: {
      id: String(creator.id),
      name: creator.firstName || creator.fullName,
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

  const response = await getCreatorDetail({ id });

  return {
    props: {
      creator: response.results[0],
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CreatorPage;
