import { List, Thumbnail } from "../../utils";
import Character from "../character";
import Comic from "../comic";
import Creator from "../creator";

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
