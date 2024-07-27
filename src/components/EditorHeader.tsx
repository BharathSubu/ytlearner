"use client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

 
import Link from "next/link";
import React from "react";
// import { toast } from "sonner";
 
const EditorHeader = ({
  Tabs,
  setActiveTab,
  activeTab,
  onSave,
  file,
}: any) => {
  return (
    <div className="border-b  border-neutral-800 h-12 flex items-center px-4 w-full">
      {/* file name portion */}
      <div className="flex space-x-2 items-center justify-start w-full">
        
      </div>

      {/* tabs */}
      <div>
        <div className="border border-neutral-600 rounded">
          <div className="flex w-full items-center">
            {
              // tabs
              Tabs.map((tab: any) => (
                <div
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={cn(
                    " cursor-pointer w-24 text-sm text-center hover:bg-neutral-700 px-2 py-1",
                    {
                      "bg-neutral-700 text-white": tab.name === activeTab,
                    },
                    {
                      "border-r border-neutral-500":
                        tab.name !== Tabs[Tabs.length - 1].name,
                    }
                  )}
                >
                  <h1 className="text-sm font-medium">{tab.name}</h1>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* right most */}
      <div className="w-full space-x-4  flex items-center  justify-end">
        <div
          onClick={() => onSave()}
          className="rounded-sm flex text-sm items-center  cursor-pointer px-2 py-1"
        >
          <Save size={20} />
        </div>
       
      </div>
    </div>
  );
};

function Save(props: any) { 
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
        <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
        <path d="M7 3v4a1 1 0 0 0 1 1h7" />
      </svg>
    )
  }
  


export default EditorHeader;