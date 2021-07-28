import { render, screen } from "infrastructure/jest/test-utils";

import Home from "pages/index";

import characters from "__mocks__/marvel/character";

test("Render home page and cards", () => {
  render(<Home characters={characters} comics={[]} events={[]} />);

  const card = screen.getAllByRole("article");
  const chars = screen.getAllByRole("heading", { name: /Personagens/ });
  // const events = screen.getAllByRole("heading", { name: /Personagens/ });
  // const comics = screen.getAllByRole("heading", { name: /Personagens/ });
  const charsLink = screen.getAllByRole("link", { name: /Personagens/ });
  const eventsLink = screen.getAllByRole("link", { name: /Eventos/ });
  const comicsLink = screen.getAllByRole("link", { name: /Eventos/ });

  expect(chars).toHaveLength(1);
  // expect(events).toHaveLength(1);
  // expect(comics).toHaveLength(1);
  expect(charsLink).toHaveLength(1);
  expect(eventsLink).toHaveLength(2);
  expect(comicsLink).toHaveLength(2);
  expect(card).toHaveLength(1);
});
