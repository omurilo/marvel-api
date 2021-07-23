import Comic from "domain/entities/comic";
import Event from "domain/entities/event";
import { List, Thumbnail, Url } from "domain/utils";

interface Character {
  id: number;
  name: string;
  description: string;
  modified: Date;
  resourceURI: string;
  urls: Url[];
  thumbnail: Thumbnail;
  comics: List<Comic>;
  events: List<Event>;
}

export default Character;
