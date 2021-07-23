import Character from "domain/entities/character";
import Event from "domain/entities/event";
import Creator from "domain/entities/creator";
import { Date, List, Price, Summary, Thumbnail } from "../../utils";

interface Comic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: string;
  variantDescription: string;
  description: string;
  modified: Date;
  isbn: string;
  upc: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  resourceURI: string;
  thumbnail: Thumbnail;
  events: Partial<Event>[];
  characters: List<Character>;
  creators: List<Creator>;
  prices: Price[];
  dates: Date[];
  variants: Summary[];
  collections: Summary[];
}

export default Comic;
