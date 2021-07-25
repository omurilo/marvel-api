import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import * as React from "react";

import { getEventDetail, getEvents } from "infrastructure/services/marvel";

import { Container } from "ui/components/Container";

const EventPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>{props.event.title}</title>
        <meta name="description" content={props.event.description} />
        <meta
          name="og:image"
          content={`${props.event.thumbnail.path}/portrait_incredible.${props.event.thumbnail.extension}`}
        />
        <meta name="og:title" content={props.event.title} />
        <meta name="og:description" content={props.event.description} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={props.event.resourceURI} />
        <meta name="og:site_name" content="Marvel Events" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta name="twitter:title" content={props.event.title} />
        <meta name="twitter:description" content={props.event.description} />
        <meta
          name="twitter:image"
          content={`${props.event.thumbnail.path}/portrait_incredible.${props.event.thumbnail.extension}`}
        />
      </Head>
      <main>
        <Container>
          <div>
            <h2>{props.event.title}</h2>
            <p>{props.event.description}</p>
            {/* <img
              src={`${props.event.thumbnail.path}/portrait_incredible.${props.event.thumbnail.extension}`}
              alt={props.event.title}
            /> */}
          </div>
        </Container>
      </main>
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

  const { id } = params as { id: string };

  const response = await getEventDetail({ id });

  return {
    props: {
      event: response.results[0],
    },
  };
};

export default EventPage;
