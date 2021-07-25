import { createContext, useContext } from "react";

const ComicsContext = createContext({});

const ComicsContextProvider = (props: any) => (
  <ComicsContext.Provider value={props}>
    {props.children}
  </ComicsContext.Provider>
);

const useComicsContext = () => {
  const comics = useContext(ComicsContext);
  return comics;
};

export { ComicsContextProvider, useComicsContext };
