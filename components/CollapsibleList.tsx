'use client';

import Link from "next/link";
type item = {
  name:string;
  src:string
}
type CollapsibleListProps = {
  data: {
    title: string;
    items?: item[];
  }[];
};

export default function CollapsibleList({ data }: CollapsibleListProps) {
  return (
    <div className="w-full max-w-md mx-auto space-x-2 lg:space-x-8 px-2 flex items-center justify-center ">
      {data.map((section, index) => (
        <div
          key={index}
          className="group  rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Title */}
          <div className="w-full flex justify-between  items-center  text-left font-semibold text-zinc-300 cursor-pointer  transition">
            <span>{section.title}</span>
            <span className="text-sm text-red-400 group-hover:text-red-600">
              ▼
            </span>
          </div>
          {/* List (appears on hover) */}
          <ul className="max-h-0 opacity-0 z-100  text-white absolute overflow-hidden rounded-sm lg:rounded-md group-hover:max-h-48 group-hover:opacity-900 group-hover:bg-red-700 transition-all duration-300    text-zinc-200 ">
            {section.items?.map((item, i) => (
              <li key={i} className="py-1 hover:bg-white hover:text-black w-full px-6">
                <Link href={item.src}>
                {item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
