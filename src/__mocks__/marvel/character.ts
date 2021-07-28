const characters = [
  {
    id: 1009368,
    name: "Iron Man",
    description:
      "Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity. Now with a new outlook on life, Tony uses his money and intelligence to make the world a safer, better place as Iron Man.",
    modified: new Date("2016-09-28T16:08:19.000Z"),
    thumbnail: { path: "", extension: "jpg" },
    resourceURI: "http://gateway.marvel.com/v1/public/characters/1009368",
    comics: {
      available: 2579,
      collectionURI:
        "http://gateway.marvel.com/v1/public/characters/1009368/comics",
      items: [
        {
          resourceURI: "http://gateway.marvel.com/v1/public/comics/43495",
          name: "A+X (2012) #2",
        },
      ],
      returned: 1,
    },
    events: {
      available: 31,
      collectionURI:
        "http://gateway.marvel.com/v1/public/characters/1009368/events",
      items: [
        {
          resourceURI: "http://gateway.marvel.com/v1/public/events/116",
          name: "Acts of Vengeance!",
        },
      ],
      returned: 1,
    },
    urls: [
      {
        type: "detail",
        url: "http://marvel.com/comics/characters/1009368/iron_man?utm_campaign=apiRef&utm_source=956f61bc4828bf761561b6acce8de9c6",
      },
    ],
  },
];

export default characters;
