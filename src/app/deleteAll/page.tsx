"use client";

import { useEffect } from "react";
import localDb from "@/lib/database.config";

export default function DeleteAll() {
  useEffect(() => {
    localDb.courses.clear();  
  }, []);

  return <div>Deleted all data</div>;
}