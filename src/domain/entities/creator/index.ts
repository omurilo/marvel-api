import { List, Thumbnail, Url } from "../../utils";
import Character from "../character";
import Comic from "../comic";
import Event from "../event";

export default interface Creator {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  suffix: string;
  description: string;
  urls: Url[];
  modified: string;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: List<Comic>;
  events: List<Event>;
}
