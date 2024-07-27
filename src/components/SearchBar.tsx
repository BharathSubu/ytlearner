/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/GFUUIHmSYEM
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import localDb, { getCachedCourseItems, ICourseItemWithIndex } from "@/lib/database.config"
import Fuse from "fuse.js";
import { queryCache } from "@/lib/database.config"
import {  useRouter } from "next/navigation"

export function SearchBar() {

  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<ICourseItemWithIndex[]>([])
  const [courseItems, setCourseItems] = useState<ICourseItemWithIndex[]>([]);
  const [isFocused, setIsFocused] = useState(false)

  const router = useRouter();

  const handleClick = (courseItem : ICourseItemWithIndex  ) => {
    console.log(courseItem);
    setIsFocused(false);
    setSearchTerm("");
    let index = courseItems.findIndex(item => item.id === courseItem.id);
    router.push(`/courses/${courseItem.parentCourseId}/${courseItem.index}`);
  };
  
  const fuse = new Fuse(courseItems, {
      keys: ["name"],
      minMatchCharLength: 3,
  });

  useEffect(() => {
    async function fetchMyCourseItem() {
        await getCachedCourseItems().then(courseItems => setCourseItems(courseItems));
        console.log("Search query Invalidated");
    }
    fetchMyCourseItem();
  },[queryCache]);
  

  useEffect(() => { 
    if (searchTerm.trim() !== "") {
      setSuggestions(fuse.search(searchTerm).map((result) => result.item));
    } else {
      setSuggestions([])
    } 
  }, [searchTerm])

  const handleSearch = (e : any) => {
    setSearchTerm(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }
  const handleBlur = () => {
    setIsFocused(false)
    setSearchTerm("")
    setSuggestions([])
  }

  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          // onBlur={handleBlur}
          className="w-full rounded-lg bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />               
      </div>
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-background shadow-lg">
          {suggestions.map((courseItem, index) => (
              <li key={index} 
                onClick={() => handleClick(courseItem )}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-muted">
                {courseItem.name}
              </li> 
          ))}
        </ul>
      )}
    </div>
  )
}

function SearchIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function XIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}