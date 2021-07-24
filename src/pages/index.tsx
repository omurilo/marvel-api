import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Character from "domain/entities/character";
import { Card, CardHeader, CardImage } from "ui/components/Card";
import { Header } from "ui/components/Header";
import { Nav, NavLink } from "ui/components/Nav";
import { getCharacters } from "infrastructure/services/marvel";

import Logo from "../../public/marvel.svg";
import { Container } from "../ui/components/Container";

type HomePageProps = {
  characters: Character[];
};

export default function Home({ characters }: HomePageProps) {
  return (
    <div>
      <Head>
        <title>Marvel - API Consumer</title>
        <meta
          name="description"
          content="List all characters, comics, events and creators of Marvel"
        />
      </Head>
      <Header>
        <Image
          src={Logo}
          height="52"
          width="130"
          alt="Logo Marvel"
          quality={80}
        />
      </Header>
      <Nav>
        <Link href="/" passHref>
          <NavLink className="nav-link">
            <span>Personagens</span>
          </NavLink>
        </Link>
        <Link href="/" passHref>
          <NavLink className="nav-link">
            <span>Quadrinhos</span>
          </NavLink>
        </Link>
        <Link href="/" passHref>
          <NavLink className="nav-link">
            <span>Criadores</span>
          </NavLink>
        </Link>
        <Link href="/" passHref>
          <NavLink className="nav-link">
            <span>Eventos</span>
          </NavLink>
        </Link>
      </Nav>
      <main>
        <h1>Personagens</h1>
        <Container>
          {characters?.map((character) => (
            <Link
              href="/characters/:id"
              as={`/characters/${character.id}`}
              passHref
              key={character.id}
            >
              <Card>
                <figure>
                  <CardImage
                    src={`${character.thumbnail.path}/standard_fantastic.${character.thumbnail.extension}`}
                    alt={character.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </figure>
                <CardHeader>
                  <h2>{character.name}</h2>
                  <Link
                    passHref
                    href="/characters/:id/events"
                    as={`/characters/${character.id}/events`}
                  >
                    <a>
                      Eventos: <var>{character.events.available}</var>
                    </a>
                  </Link>
                  <Link
                    passHref
                    href="/characters/:id/comics"
                    as={`/characters/${character.id}/comics`}
                  >
                    <a>
                      Quadrinhos: <var>{character.comics.available}</var>
                    </a>
                  </Link>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </Container>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const response = await getCharacters({ limit: 10 });

  console.log(response);

  return {
    props: {
      characters: response.results,
    },
    revalidate: 24 * 60 * 60,
  };
}
