import { createContext, useContext } from "react";

const EventsContext = createContext({});

const EventsContextProvider = (props: any) => (
  <EventsContext.Provider value={props}>
    {props.children}
  </EventsContext.Provider>
);

const useEventsContext = () => {
  const events = useContext(EventsContext);
  return events;
};

export { EventsContextProvider, useEventsContext };
