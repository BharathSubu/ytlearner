
import { Course } from "@/components/Course";

export default function Page({
  params, 
}: {
  params: { courseId: string , courseItemId : string }; 
}) {
  return (
    <Course courseId={params.courseId} courseItemId={params.courseItemId} />
  );
}