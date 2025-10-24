import React from 'react'

import CollapsibleList from './CollapsibleList'

function Categories() {
    const data = [
  {
    title: "Movies",
    items: [
      { name: "Popular", src: "/movie" },
      { name: "Now Playing", src: "/movie/nowplaying" },
      { name: "Upcoming", src: "/movie/upcoming" },
      { name: "Top Rated", src: "/movie/toprated" },
    ],
  },
  {
    title: "Tv Shows",
    items: [
      { name: "Popular", src: "/tv" },
      { name: "Airing Today", src: "/tv/airingtoday" },
      { name: "On Tv", src: "/tv/ontv" },
      { name: "Top Rated", src: "/tv/toprated" },
    ],
  },
  {
    title: "People",
    items: [
      { name: "Popular People", src: "/person" },
    ],
  },
];

  return (
    <>
       <CollapsibleList data={data} />
    </>
  )
}

export default Categories