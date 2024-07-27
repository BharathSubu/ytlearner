/**
 * v0 by Vercel.
 * @see https://v0.dev/t/N4YBBRwhNNO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ICourse } from "@/lib/types"; 

import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; 
import {
  Dialog,
  DialogContent, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"; 

interface CourseCardProps {
  course: ICourse;
  onDelete: (id: number) => void;
}

export default function CourseCard({ course  , onDelete }: CourseCardProps) { 

  const handleDelete = async () => {
    onDelete(course.id);
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <img
        alt={course.name}
        width={course.thumbnail[3].width}
        height={course.thumbnail[3].height}
        src={course.thumbnail[3].url}

        className="object-cover w-full max-h-56"
      />
      <div className="flex dark:bg-indigo-950 flex-col justify-between gap-4 p-5">
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flexx-1 flex-col overflow-hidden">
            <h3 className="text-2xl font-bold truncate">{course.name}</h3>
            <div className="text-muted-foreground text-sm">
              {course.courseItems.length} Chapters
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                ⋮<span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"> 
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2  text-red-500">Delete</button>
                  </DialogTrigger>
                  <DialogContent className=" max-w-xs ">
                    <DialogHeader className="mb-2">
                      <DialogTitle>
                        Delete this course?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                    <Button onClick={handleDelete}>Delete Course</Button>
                  </DialogFooter>
                  </DialogContent> 
                </Dialog> 
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {course.progress}% Complete
            </div>
          </div>
          <Link href={`/courses/${course.id}/0`} prefetch={false}>
            <Button variant="secondary" size="sm">
              Resume
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
