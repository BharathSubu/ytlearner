"use client";

import { SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import localDb from "@/lib/database.config";
import { ICourseItem } from "@/lib/types";
import React from "react";
import { redirect } from "next/navigation";

export default function CourseInputForm() {
  const [error, setError] = useState("");

  const handleAction = async (event: FormData) => {
    //   await localDb.courses.where('id').equals(36).delete();
    //   const courses = await localDb.courses.toArray();
    //   console.log(courses);
    const name = event.get("name") as string;
    const url = event.get("url") as string;
    console.log(event);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!url.trim()) {
      setError("A valid URL is required.");
      return;
    }

    const getPlayListId = extractPlaylistId(url);
    const getVideoId = extractVideoId(url);
    let response;
    if (getPlayListId) {
      response = await fetch(
        "https://youtube-api.bharathsubu2002.workers.dev/playlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId: getPlayListId }),
        }
      );
    } else if (getVideoId) {
      response = await fetch(
        "https://youtube-api.bharathsubu2002.workers.dev/video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId: getVideoId }),
        }
      ); 
    } else {
      setError("Invalid URL");
      return;
    }
    setError("");

    console.log(response);
    const data = await response.json();
    console.log(data);

    if (data.status !== "success") {
      setError("Invalid URL");
      return;
    }

    console.log("localDb");

    const id = await localDb.courses.add({
      name: name,
      url: url,
      courseItems: [],
      progress: 0,
      thumbnail: [],
    });

    console.log("Id of the insered course");
    console.log(id);

    const courseItems: ICourseItem[] = data.playlist.videos.map(
      (video: { id: any; name: any }) => ({
        id: video.id,
        name: video.name,
        iscompleted: false,
        parentCourseId: id,
        isVideo: true,
        editor: {
          document: "",
          whiteboardFiles: {
            excalidrawElement: "",
            excalidrawElementFiles: "",
            excalidrawState: "",
          },
        },
      })
    );

    const thumbnail = data.playlist.thumbnail.map(
      (thumbnail: { url: any; width: any; height: any }) => ({
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height,
      })
    );

    console.log(courseItems);
    console.log(thumbnail);

    // update course with courseItems and thumbnail
    try {
      // await localDb.courses.update(id, {
      //   courseItems: courseItems,
      //   thumbnail: thumbnail,
      // });
      console.log("course");
      // console.log(course);

      await localDb.courses.update(id, (course, ctx) => {
        console.log(course);

        if (course) {
          course.courseItems = courseItems;
          course.thumbnail = thumbnail;
          return true;
        }
        return false;
      });
    } catch (error) {
      console.log(error);
      setError("Error");
      // return;
    }

    const course = await localDb.courses.get(id);
    console.log("course afte update");
    console.log(course);

    redirect(`/courses/${id}/0`);
  };

  function extractPlaylistId(url: string) {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null; 
  }

  //fucntion to get VideoId from youtubeVideos
  function extractVideoId(url: string) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
    return null;  
  }

  return (
    <form action={handleAction}>
      <div className="grid  gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="PlayList Name"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="url" className="text-right">
            Url
          </Label>
          <Input
            id="url"
            name="url"
            placeholder="Youtube Url"
            className="col-span-3"
          />
        </div>
        <span className="text-sm text-red-600 ">{error}</span>
      </div>
      <DialogFooter>
        <Button type="submit">Create Course</Button>
      </DialogFooter>
    </form>
  );
}

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};
