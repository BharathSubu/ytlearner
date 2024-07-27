"use client";

import { useEffect, useState } from "react";
import localDb from "@/lib/database.config";
import { ICourseItem } from "@/lib/types";
import { Editor } from "./Editor";

export function Course({
  courseId,
  courseItemId,
}: {
  courseId: string;
  courseItemId: string;
}) {
  const [courseItem, setCourseItem] = useState<ICourseItem>();

  useEffect(() => {
    async function fetchMyCourseItem() {
      const fetchedCourseItem = await localDb.courses
        .where("id")
        .equals(parseInt(courseId))
        .first()
        .then((course) => {
          return course?.courseItems[parseInt(courseItemId)];
        });
      setCourseItem(fetchedCourseItem);
      // console.log("Course");
    }
    fetchMyCourseItem();
  }, []);

 
    return (
      courseItem?.isVideo ? <div className="flex h-screen">
        <main className="flex-1 bg-background p-6">
          <div className="prose prose-gray dark:prose-invert text-xl">
            {courseItem?.name}
          </div>
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
          >
            <iframe
            className="absolute top-0 left-0 w-full h-full"
            title="Youtube player"
            sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation allowfullscreen"
            src={`https://youtube.com/embed/${courseItem?.id}?autoplay=0`}
            allowFullScreen
          ></iframe>  
          </div>
        </main>
      </div>
     : <Editor courseId={courseId} courseItemId={courseItemId}/>);
   
}
