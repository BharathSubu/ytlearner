/**
 * v0 by Vercel.
 * @see https://v0.dev/t/AgXMAroTbgo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import localDb, { invalidateCache } from "@/lib/database.config";
import { redirect } from "next/navigation";
import { ICourseItem } from "@/lib/types";
import { PartialBlock } from "@blocknote/core";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export default function CourseItemCreation(props: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle>
        <PlusIcon onClick={() => setIsOpen(true)} className="mr-2" />
      </DialogTitle>
      <DialogContent>
        <InputField courseId={props.courseId} />
      </DialogContent>
    </Dialog>
  );
}

function InputField(props: { courseId: string }) {
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("youtube");

  const handleAction = async (event: FormData) => {
    const name = event.get("name") as string;
    const videoUrl = event.get("videoUrl") as string;
    const id = parseInt(props.courseId);
    if (selectedOption === "youtube") {
      const videoId = extractYouTubeVideoId(videoUrl);
      if (!videoId) {
        console.log("Invalid YouTube URL");
        console.log(props.courseId);
        return;
      }

      const newCourseItem: ICourseItem[] = [
        {
          id: videoId,
          name: name,
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
        },
        ...(await localDb.courses.get(id))!.courseItems,
      ];

      await localDb.courses.update(id, {
        courseItems: newCourseItem,
      });

      redirect(`/courses/${id}/0`);
    } else {
      const newCourseItem: ICourseItem[] = [
        {
          id: uuidv4(),
          name: name,
          iscompleted: false,
          parentCourseId: id,
          isVideo: false,
          editor: {
            document: "",
          },
        },
        ...(await localDb.courses.get(id))!.courseItems,
      ];

      await localDb.courses.update(id, {
        courseItems: newCourseItem,
      });

      invalidateCache();
      redirect(`/courses/${id}/0`);
    }
  };

  function extractYouTubeVideoId(url: string) {
    var regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
    return null;
  }

  return (
    <form action={handleAction} className="space-y-6 p-2 ">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="block text-lg font-medium text-gray-700"
        >
          Title
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="PlayList Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="url"
          className="block text-lg font-medium text-gray-700"
        >
          Content Type
        </Label>
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="youtube" id="youtube" className="h-5 w-5" />
            <Label htmlFor="youtube" className="text-gray-700">
              YouTube Video
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="canvas" id="canvas" className="h-5 w-5" />
            <Label htmlFor="canvas" className="text-gray-700">
              Canvas Page
            </Label>
          </div>
        </RadioGroup>
      </div>
      {selectedOption === "youtube" && (
        <div className="space-y-2">
          <Label
            htmlFor="videoUrl"
            className="block text-lg font-medium text-gray-700"
          >
            YouTube Video URL
          </Label>
          <Input
            id="videoUrl"
            placeholder="Enter a YouTube video URL"
            name="videoUrl"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <DialogFooter className="flex justify-end">
        <Button
          type="submit"
          className="px-4 py-2   rounded-md  focus:outline-none focus:ring-2 "
        >
          Create Course
        </Button>
      </DialogFooter>
    </form>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon(props: any) {
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
  );
}
