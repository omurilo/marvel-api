import { createContext, useContext } from "react";

const CreatorsContext = createContext({});

const CreatorsContextProvider = (props: any) => (
  <CreatorsContext.Provider value={props}>
    {props.children}
  </CreatorsContext.Provider>
);

const useCreatorsContext = () => {
  const creators = useContext(CreatorsContext);
  return creators;
};

export { CreatorsContextProvider, useCreatorsContext };
