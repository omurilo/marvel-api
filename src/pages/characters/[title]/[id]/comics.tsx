import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getCharacterComics,
  getCharacters,
} from "infrastructure/services/marvel";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const CharacterComicsPage = ({
  name,
  comics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>Quadrinhos que o personagem {name} aparece</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos onde o personagem ${name} aparece.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o personagem ${name} participa`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos onde o personagem ${name} aparece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o personagem ${name} participa`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos onde o personagem ${name} aparece.`}
        />
      </Head>
      <main>
        <h1>
          Quadrinhos do personagem: <em>{name}</em>
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
                <Link passHref href={`/comics/:id`} as={`/comics/${comic.id}`}>
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

  const response = await getCharacterComics({ id });

  return {
    props: {
      name,
      comics: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterComicsPage;
