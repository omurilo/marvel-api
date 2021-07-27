import { List, Thumbnail } from "domain/utils";
import Character from "domain/entities/character";
import Comic from "domain/entities/comic";
import Creator from "domain/entities/creator";

export default interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: List<Comic>;
  characters: List<Character>;
  creators: List<Creator>;
}
