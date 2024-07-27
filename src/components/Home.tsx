
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";  
import CourseInputForm  from "./CourseInputFormClient";
import Courses from "./Courses";

export default async function Home() {

  return (
    <main className="no-scrollbar mx-auto flex h-full max-w-screen-xl flex-col overflow-y-auto p-4 gap-4  text-lg">
       
    <div className="flex flex-row justify-between items-center">
      Your Content 
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Url</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Url</DialogTitle>
              <DialogDescription>
                Make changes give unique name to youtube playlist
              </DialogDescription>
            </DialogHeader>
            <CourseInputForm /> 
          </DialogContent>
        </Dialog> 
      </div>
      <Courses />
    </main>
  );
}
