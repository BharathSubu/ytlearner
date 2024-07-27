"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import localDb, { invalidateCache } from "@/lib/database.config";
import { ICourse, ICourseItem } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useRecoilState } from "recoil";
import { sidebarOpenAtom } from "@/store/atoms/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import useWindowWidth from "@/hooks/windowWidth"; 
import CourseItemCreation from "./CourseItemCreation";

interface CourseProps {
  courseId: string;
}

export default function SideBar({ courseId }: CourseProps) {
  //use useEffect to fetch data from localDb
  const [course, setCourse] = useState<ICourse>();
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenAtom);
  const windowWidth = useWindowWidth();
  const params = useParams<{ courseId: string; courseItemId: string }>();

  const [items, setItems] = useState<ICourseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(0);

  const handleDragStart = (e: any, item: any) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: any, targetIndex: number) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData("text/plain");
    const draggedItem = items.find((item) => item.id === draggedItemId);
    const updatedItems = [...items];
    updatedItems.splice(items.indexOf(draggedItem as any), 1);
    updatedItems.splice(targetIndex, 0, draggedItem as any);
    setItems(updatedItems);
    await localDb.courses.update(parseInt(courseId), {
      courseItems: updatedItems,
    });
    invalidateCache();
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleCheckboxChange = async (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, iscompleted: !item.iscompleted } : item
    );
    setItems(updatedItems);
    await localDb.courses.update(parseInt(courseId), {
      courseItems: updatedItems,
    });
    let updatedProgress = (
      (updatedItems.filter((item) => item.iscompleted).length /
        items.length) *
      100
    ).toFixed(2);
    // await localDb.courses.update(parseInt(courseId), {
    //   progress : updatedProgress ,
    // });
    await localDb.courses.update(parseInt(courseId),(course,ctx) => {
      if(course){
        course.progress = parseInt(updatedProgress);
        return true;
      }
      return false;
    });
  }

  useEffect(() => {
    async function fetchMyCourse() {
      const fetchedCourse = await localDb.courses.get({
        id: parseInt(courseId),
      });
      setCourse(fetchedCourse);
      setItems(fetchedCourse!.courseItems);
    }
    fetchMyCourse();
    //set selected item id if it exists
    if (params.courseItemId) {
      setSelectedItem(parseInt(params.courseItemId));
    }
  }, []);

  useEffect(() => {
    if (windowWidth < 500) {
      setSidebarOpen(false);
    }
  }, []);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <>
      <aside className="hidden md:block bg-background border-r max-h-screen overflow-auto m-2 w-64">
        <SideBarColumn
          courseId={courseId}
          course={course!}
          items={items}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          handleItemClick={handleItemClick}
          handleCheckboxChange={handleCheckboxChange}
        />
      </aside>
      {/* <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"> */}

      <Sheet
        open={sidebarOpen && windowWidth < 768}
        onOpenChange={setSidebarOpen}
      >
        <SheetContent
          side="left"
          className="  bg-background border-r max-h-screen overflow-auto m-2 max-w-xl"
        >
          <SideBarColumn
            courseId={courseId}
            course={course!}
            items={items}
            handleDragOver={handleDragOver}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleItemClick={handleItemClick}
            handleCheckboxChange={handleCheckboxChange}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

//SideBar Toggle

interface SideBarColumnProps {
  courseId: string;
  items: ICourseItem[];
  handleDragOver: (e: any) => void;
  course: ICourse;
  handleDragStart: (e: any, item: any) => void;
  handleDrop: (e: any, targetIndex: number) => void;
  handleItemClick: (item: any) => void;
  handleCheckboxChange: (itemId: string) => void;
}

export function SideBarColumn({
  courseId,
  course,
  items,
  handleDragOver,
  handleDragStart,
  handleDrop,
  handleItemClick,
  handleCheckboxChange,
}: SideBarColumnProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center  justify-between">
        <h3 className="text-lg font-semibold">{course?.name}</h3>
        <CourseItemCreation courseId={courseId} />
      </div>
      <div className="mt-2">
        <ul className="divide-y divide-muted" onDragOver={handleDragOver}>
          {items.map((item, index) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={(e) => handleDragOver(e)}
              onClick={() => handleItemClick(item)}
            >
              <div className="grid grid-cols-10 items-center gap-3">
                <Checkbox
                  id={`checkbox-${item.id}`}
                  defaultChecked={item.iscompleted}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                  className="col-span-1"
                />
                <GripVerticalIcon className="w-4 h-4 text-muted-foreground col-span-1 " />
                <div className="col-span-8">
                  <Link href={`/courses/${courseId}/${index}`}>
                    <Label
                      htmlFor={`item-${item.id}`}
                      className="text-base line-clamp-2 overflow-hidden text-ellipsis"
                    >
                      {item.name}
                    </Label>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ToggleButton({
  onClick,
  sidebarOpen,
}: {
  onClick: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center"
    >
      <span
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
        }`}
      ></span>
      <span
        className={`my-0.5 block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
        }`}
      ></span>
    </button>
  );
}

//work on  modualrization
interface CourseItemProps {
  courseId: string;
  item: ICourseItem;
  selectedItemId: number | null;
  onSelect: (id: number) => void;
  index: number;
}

function CourseItem({ courseId, item, index }: CourseItemProps) {
  const [items, setItems] = useState<ICourseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const handleDragStart = (e: any, item: any) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: any, targetIndex: number) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData("text/plain");
    const draggedItem = items.find((item) => item.id === draggedItemId);
    const updatedItems = [...items];
    updatedItems.splice(items.indexOf(draggedItem as any), 1);
    updatedItems.splice(targetIndex, 0, draggedItem as any);
    setItems(updatedItems);
  };
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };
  const handleCheckboxChange = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.iscompleted } : item
    );
    setItems(updatedItems);
  };

  return (
    <li
      key={item.id}
      className="py-3 flex items-center justify-between cursor-move"
      draggable
      onDragStart={(e) => handleDragStart(e, item)}
      onDrop={(e) => handleDrop(e, index)}
      onDragOver={(e) => handleDragOver(e)}
      onClick={() => handleItemClick(item)}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          id={`checkbox-${item.id}`}
          // checked={item.iscompleted}
          onCheckedChange={() => handleCheckboxChange(item.id)}
        />
        <GripVerticalIcon className="w-4 h-4 text-muted-foreground" />
        <Link href={`/courses/${courseId}/${index}`}>
          <Label
            htmlFor={`item-${item.id}`}
            className="text-base line-clamp-2 overflow-hidden text-ellipsis"
          >
            {item.name}
          </Label>
        </Link>
      </div>
    </li>
  );
}

function Item({
  courseId,
  item,
  selectedItemId,
  onSelect,
  index,
}: CourseItemProps) {
  const isSelected = selectedItemId === index;

  return (
    <Link
      href={`/courses/${courseId}/${index}`}
      className={`flex items-center justify-between   p-4 cursor-pointer ${
        isSelected ? "bg-gray-200  dark:bg-gray-800 shadow-md" : ""
      }`}
      onClick={() => onSelect(index)}
    >
      <div className="flex items-center gap-2">
        {/* <Checkbox id={`item-${item.id}`} /> */}
        <Label
          htmlFor={`item-${item.id}`}
          className="text-base line-clamp-2 overflow-hidden text-ellipsis"
        >
          {item.name}
        </Label>
      </div>
    </Link>
  );
}

function GripVerticalIcon(props: any) {
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
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

