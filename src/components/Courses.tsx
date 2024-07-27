"use client";

import { useState, useEffect } from "react";
import localDb from "@/lib/database.config";
import { ICourse } from "@/lib/types";
import CourseCard from "./CourseCard"; // Make sure to adjust the import path if necessary

export default function Courses() {
  // const courses : ICourse[] = useLiveQuery(() => localDb.courses.toArray()) || [];

  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
   
    async function fetchMyCourse() { 
      // await localDb.courses.clear();
      const fetchedCourses = await localDb.courses.toArray();
      setCourses(fetchedCourses); 
      console.log(fetchedCourses);
    }
    fetchMyCourse();
  }, []);

  const handleDeleteCourse = async (id: number) => {
    await localDb.courses.delete(id);
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onDelete={handleDeleteCourse} />
        ))}
      </div>
    </main>
  );
}
