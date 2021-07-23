export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Url {
  url: string;
  type: string;
}

export interface Summary {
  name: string;
  resourceURI: string;
}

export interface Price {
  type: string;
  price: number;
}

export interface Date {
  type: string;
  date: Date;
}

export interface List<T> {
  available: number;
  returned: number;
  collectionURI: string;
  items: Partial<T>[];
}
