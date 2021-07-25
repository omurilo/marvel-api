import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import { getEventComics, getEvents } from "infrastructure/services/marvel";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const EventComicsPage = ({
  title,
  comics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>Quadrinhos que o evento {title} acontece</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos onde o evento ${title} acontece.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o evento ${title} acontece`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos onde o evento ${title} acontece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o evento ${title} acontece`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos onde o evento ${title} acontece.`}
        />
      </Head>
      <main>
        <h1>
          Quadrinhos do evento: <em>{title}</em>
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {comics?.map((comic) => (
            <div
              key={comic.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "stretch",
                flexBasis: "calc(50% - 10px)",
              }}
            >
              <Image
                src={`${comic.thumbnail.path}/portrait_incredible.${comic.thumbnail.extension}`}
                alt={comic.title}
                // layout="responsive"
                objectFit="cover"
                width={216}
                height={324}
              />
              <div style={{ marginLeft: 10 }}>
                <h2>{comic.title}</h2>
                <p>
                  Descrição:{" "}
                  <p dangerouslySetInnerHTML={{ __html: comic.description }} />
                </p>
                <p>
                  Preço:{" "}
                  {comic.prices.map((price) => (
                    <p key={price.type}>
                      {price.type === "printPrice" ? "Impressa" : "Digital"}: $
                      {price.price}
                    </p>
                  ))}
                </p>
                <Link
                  passHref
                  href={`/comics/:title/:id`}
                  as={`/comics/${comic.title}/${comic.id}`}
                >
                  <a>Ver mais</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
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

  const { id, title } = params as { id: string; title: string };

  const response = await getEventComics({ id });

  return {
    props: {
      title,
      comics: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default EventComicsPage;
