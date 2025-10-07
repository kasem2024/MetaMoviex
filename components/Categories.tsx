import React from 'react'

import CollapsibleList from './CollapsibleList'

function Categories() {
    const data = [
  { title: "Movies", items: ["Popular", "Now Playing", "Upcoming", "Top Rated"] },
  { title: "Tv Shows", items: ["Popular", "Airing Today", "On Tv", "Top Rated"] },
  { title: "People", items: ["Popular People"] },
   { title: "More", items: ["Discussions", "LeaderBoard", "Support","Api Documentation", "Api For Business"] },
];
  return (
    <>
       <CollapsibleList data={data} />
    </>
  )
}

export default Categories