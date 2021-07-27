import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";

import {
  getCharacterComics,
  getCharacterDetail,
  getCharacters,
} from "infrastructure/services/marvel";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import SimpleCard from "ui/components/SimpleCard";
import ComicCard from "ui/components/ComicCard";
import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import Banner from "ui/components/Banner";
import Footer from "ui/components/Footer";
import useScreenOrientation from "application/hooks/useScreenOrientation";
import { Card } from "ui/components/Card";

const CharacterComicsPage = ({
  comics,
  character,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const orientation = useScreenOrientation();

  return (
    <div>
      <Head>
        <title>Quadrinhos que o personagem {character.name} aparece</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos onde o personagem ${character.name} aparece.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o personagem ${character.name} participa`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos onde o personagem ${character.name} aparece.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o personagem ${character.name} participa`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos onde o personagem ${character.name} aparece.`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                alt={character.name}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{character.name}</Banner.Title>
              {character.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: character.description,
                  }}
                />
              )}
              <Link passHref href={character.urls[0].url}>
                <Banner.Link target="_blank">
                  <span>Ver no site Marvel</span>
                </Banner.Link>
              </Link>
            </Banner.Info>
          </Banner.Container>
        </Container>
        <Container $row $center>
          {comics?.map((comic) => (
            <ComicCard.Container key={comic.id}>
              <ComicCard.Image
                src={`${comic.thumbnail.path}/${orientation}_incredible.${comic.thumbnail.extension}`}
                alt={comic.title}
                objectFit="cover"
                objectPosition="top"
                width={216}
                height={324}
              />
              <ComicCard.Info>
                <SimpleCard.Title as="h2">{comic.title}</SimpleCard.Title>
                <ComicCard.Text
                  dangerouslySetInnerHTML={{
                    __html:
                      comic.description?.length > 350
                        ? comic.description?.slice(0, 350).padEnd(353, "...")
                        : comic.description,
                  }}
                />
                <Link
                  passHref
                  href={`/comics/:title/:id`}
                  as={`/comics/${comic.title.replace(/[^-a-zA-Z0-9z]+/g, "")}/${
                    comic.id
                  }`}
                >
                  <Card.Link>
                    <ComicCard.Text>Ver mais</ComicCard.Text>
                  </Card.Link>
                </Link>
              </ComicCard.Info>
            </ComicCard.Container>
          ))}
        </Container>
        <Footer />
      </main>
    </div>
  );
};

export const getStaticPaths = async () => {
  const response = await getCharacters({ limit: 14 });

  const paths = response.results.map((character) => ({
    params: {
      id: String(character.id),
      name: character.name.replace(/[^a-zA-Z0-9]+/g, ""),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  const { id } = params as { id: string; name: string };

  const response = await getCharacterComics({ id });
  const {
    results: [{ name, description, thumbnail, urls }],
  } = await getCharacterDetail({ id });

  const character = {
    name,
    description: description || null,
    thumbnail,
    urls,
  };

  return {
    props: {
      character,
      comics: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterComicsPage;
