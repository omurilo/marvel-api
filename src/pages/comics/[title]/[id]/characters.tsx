import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getComicCharacters,
  getCharacters,
  getComics,
} from "infrastructure/services/marvel";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const CharacterComicsPage = ({
  title,
  characters,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Head>
        <title>Personagens que aparecem no quadrinho {title}</title>
        <meta
          name="description"
          content={`Lista dos personagens que aparecem no quadrinho ${title}.`}
        />
        <meta
          name="og:title"
          content={`Personagens que aparecem no quadrinho ${title}`}
        />
        <meta
          name="og:description"
          content={`Lista dos personagens que aparecem no quadrinho ${title}.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Personagens que aparecem no quadrinho ${title}`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos personagens que aparecem no quadrinho ${title}.`}
        />
      </Head>
      <main>
        <h1>
          Personagens do quadrinho: <em>{title}</em>
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {characters?.map((character) => (
            <div
              key={character.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "stretch",
                flexBasis: "calc(50% - 10px)",
              }}
            >
              <Image
                src={`${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`}
                alt={character.name}
                objectFit="cover"
                width={216}
                height={324}
              />
              <div style={{ marginLeft: 10 }}>
                <h2>{character.name}</h2>
                <p>
                  Descrição:{" "}
                  <p
                    dangerouslySetInnerHTML={{ __html: character.description }}
                  />
                </p>
                <Link
                  passHref
                  href={`/characters/:id`}
                  as={`/characters/${character.id}`}
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
  const response = await getComics({ limit: 14 });

  const paths = response.results.map((character) => ({
    params: { id: String(character.id), title: character.title },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id, title } = params as { id: string; title: string };

  const response = await getComicCharacters({ id });

  return {
    props: {
      title,
      characters: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterComicsPage;
