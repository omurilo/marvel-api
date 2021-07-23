import Character from "domain/entities/character";
import Comic from "domain/entities/comic";
import Creator from "domain/entities/creator";
import Event from "domain/entities/event";
import api from "infrastructure/services/api";

enum CharacterOrderBy {
  NAME = "name",
  MODIFIED = "modified",
  DESCNAME = "-name",
  DESCMODIFIED = "-modified",
}

enum ComicOrderBy {
  FOCDATE = "focDate",
  ONSALE_DATE = "onsaleDate",
  TITLE = "title",
  MODIFIED = "modified",
  DESCFOCDATE = "-focDate",
  DESCONSALEDATE = "-onsaleDate",
  DESCTITLE = "-title",
  DESCMODIFIED = "-modified",
}

enum CreatorOrderBy {
  FIRSTNAME = "firstName",
  LASTNAME = "lastName",
  MIDDLENAME = "middleName",
  MODIFIED = "modified",
  DESCFIRSTNAME = "-firstName",
  DESCLASTNAME = "-lastName",
  DESCMIDDLENAME = "-middleName",
  DESCMODIFIED = "-modified",
}

enum EventsOrderBy {
  NAME = "name",
  STARTDATE = "startDate",
  MODIFIED = "modified",
  DESCNAME = "-name",
  DESCSTARTDATE = "-startDate",
  DESCMODIFIED = "-modified",
}

type ApiFunctionProps = {
  id?: number | string;
  name?: string;
  nameStartsWith?: string;
  firstNameStartsWith?: string;
  middleNameStartsWith?: string;
  lastNameStartsWith?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  offset?: number;
  limit?: number;
  orderBy?: CharacterOrderBy | ComicOrderBy | CreatorOrderBy | EventsOrderBy;
};

type ApiResponse<T> = {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
};

const marvelApi = api<ApiFunctionProps>("https://gateway.marvel.com/v1/public");

async function getCharacters({
  offset = 0,
  orderBy = CharacterOrderBy.NAME,
  limit = 100,
  name,
  nameStartsWith,
}: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Character>>(
    "characters",
    {
      offset,
      limit,
      orderBy,
      name,
      nameStartsWith,
    }
  );

  return response.data;
}

async function getCharacterDetail({ id }: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Character>>(
    `characters/${id}`
  );

  return response.data;
}

async function getComics({
  offset = 0,
  orderBy = ComicOrderBy.FOCDATE,
  limit = 100,
  title = undefined,
}: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Comic>>("comics", {
    offset,
    limit,
    orderBy,
    title,
  });

  return response.data;
}

async function getComicDetail({ id }: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Comic>>(
    `comics/${id}`
  );
  return response.data;
}

async function getCreators({
  offset = 0,
  limit = 100,
  orderBy = CreatorOrderBy.FIRSTNAME,
  firstNameStartsWith = undefined,
  middleNameStartsWith = undefined,
  lastNameStartsWith = undefined,
  firstName = undefined,
  middleName = undefined,
  lastName = undefined,
}) {
  const { data: response } = await marvelApi.get<ApiResponse<Creator>>(
    "creators",
    {
      offset,
      limit,
      orderBy,
      firstNameStartsWith,
      middleNameStartsWith,
      lastNameStartsWith,
      firstName,
      middleName,
      lastName,
    }
  );

  return response.data;
}

async function getCreatorDetail({ id }: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Creator>>(
    `creators/${id}`
  );
  return response.data;
}

async function getEvents({
  offset = 0,
  orderBy = EventsOrderBy.STARTDATE,
  limit = 100,
  name = undefined,
  nameStartsWith = undefined,
}: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Character>>(
    "events",
    {
      offset,
      limit,
      orderBy,
      name,
      nameStartsWith,
    }
  );

  return response.data;
}

async function getEventDetail({ id }: ApiFunctionProps) {
  const { data: response } = await marvelApi.get<ApiResponse<Event>>(
    `events/${id}`
  );
  return response.data;
}

export {
  getCharacters,
  getCharacterDetail,
  getComics,
  getComicDetail,
  getCreators,
  getCreatorDetail,
  getEvents,
  getEventDetail,
};
