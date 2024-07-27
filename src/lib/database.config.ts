"use client";

import Dexie, { type EntityTable } from 'dexie';
import { ICourse, ICourseItem, Todo } from "./types";   

const localDb = new Dexie('FriendsDatabase' ) as Dexie & {
    courses: EntityTable<
      ICourse,
      'id' // primary key "id" (for the typings only)
    >;
    todo: EntityTable<
      Todo,
      'id' // primary key "id" (for the typings only)
    >;
  };

  // Schema declaration:
localDb.version(1).stores({
    courses : '++id, name, age' ,
    todo: '++id, name, completed'
    // primary key "id" (for the runtime!)
});


localDb.open().then(()=>{
  console.log("Database successfully opened");
}).catch(err => {
  if (err.name === 'InvalidStateError') {
    console.log("Firefox private mode node supported.")
  } else {
    console.log(err);
  }
});

type QueryCache = {
  [key: string]: any;  
};
 
export let queryCache: QueryCache = {};
 
async function getCachedQuery<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
  console.log("getCachedQuery");
  if (queryCache[key]) {
    return queryCache[key] as T;
  }
  const result = await queryFn();
  queryCache[key] = result;
  return result;
}

export interface ICourseItemWithIndex extends ICourseItem {
  index: number; //index repective to the course.courseitem array
}
 
async function getAllCourseItems () {
  let courseItems : ICourseItemWithIndex[] = [];
  await localDb.courses.toArray().then(courses => courses.map(course => course.courseItems.map((item,index) => {
    const itemWithIndex: ICourseItemWithIndex = {
      ...item,
      index: index,
    };
    courseItems.push(itemWithIndex);
  })));
  console.log("getAllCourseItems");
  console.log(courseItems);
  return courseItems;
}
 
export async function getCachedCourseItems() {
  console.log("getCachedCourseItems");
  // return getCachedQuery('allCourses', getAllCourseItems);
  return getAllCourseItems();
}

localDb.courses.hook("creating", () => {
    invalidateCache();
});
  

localDb.courses.hook("deleting", () => {
    invalidateCache();
});

export function invalidateCache() {
  queryCache = new Map();
  console.log("Cache invalidated");
}

export default localDb;