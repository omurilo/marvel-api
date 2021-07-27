import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import {
  getCreatorComics,
  getCreatorDetail,
  getCreators,
} from "infrastructure/services/marvel";
import useScreenOrientation from "application/hooks/useScreenOrientation";

import Header from "ui/components/Header";
import { Container } from "ui/components/Container";
import Banner from "ui/components/Banner";
import ComicCard from "ui/components/ComicCard";
import SimpleCard from "ui/components/SimpleCard";
import { Card } from "ui/components/Card";
import Footer from "ui/components/Footer";

const CharacterComicsPage = ({
  creator,
  comics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const orientation = useScreenOrientation();

  return (
    <div>
      <Head>
        <title>Quadrinhos que o criador {creator.name} participou</title>
        <meta
          name="description"
          content={`Lista dos quadrinhos que o criador ${creator.name} participou.`}
        />
        <meta
          name="og:title"
          content={`Quadrinhos que o criador ${creator.name} participou`}
        />
        <meta
          name="og:description"
          content={`Lista dos quadrinhos que o criador ${creator.name} participou.`}
        />
        <meta name="og:type" content="article" />
        <meta name="og:site_name" content="Marvel Comics" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@marvel" />
        <meta
          name="twitter:title"
          content={`Quadrinhos que o criador ${creator.name} participou`}
        />
        <meta
          name="twitter:description"
          content={`Lista dos quadrinhos que o criador ${creator.name} participou.`}
        />
      </Head>
      <main>
        <Header />
        <Container $bgColor="black">
          <Banner.Container>
            <figure>
              <Image
                src={`${creator.thumbnail.path}/portrait_uncanny.${creator.thumbnail.extension}`}
                alt={creator.name}
                layout="fill"
                objectFit="fill"
              />
            </figure>
            <Banner.Info>
              <Banner.Title>{creator.name}</Banner.Title>
              {creator.description && (
                <Banner.Description
                  dangerouslySetInnerHTML={{
                    __html: creator.description,
                  }}
                />
              )}
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
                    __html: comic.description?.length > 350 ? comic.description?.slice(0, 350).padEnd(353, "...") : comic.description,
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
  const response = await getCreators({ limit: 14 });

  const paths = response.results.map((creator) => ({
    params: {
      id: String(creator.id),
      name: creator.fullName.replace(/[^a-zA-Z0-9]+/g, ""),
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

  const { results: comics } = await getCreatorComics({ id, limit: 5 });

  const {
    results: [{ fullName, description, thumbnail }],
  } = await getCreatorDetail({ id });

  const creator = {
    name: fullName,
    description: description || null,
    thumbnail,
  };

  return {
    props: {
      creator,
      comics,
    },
    revalidate: 24 * 60 * 60,
  };
};

export default CharacterComicsPage;
