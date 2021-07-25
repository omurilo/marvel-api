import { createContext, useContext } from "react";

const CharactersContext = createContext({});

const CharactersContextProvider = (props: any) => (
  <CharactersContext.Provider value={props}>
    {props.children}
  </CharactersContext.Provider>
);

const useCharactersContext = () => {
  const Characters = useContext(CharactersContext);
  return Characters;
};

export { CharactersContextProvider, useCharactersContext };
