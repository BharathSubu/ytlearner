"use client";
import React, { useEffect, useState } from "react"; 
import EditorHeader from "./EditorHeader";
import dynamic from "next/dynamic";
import { IEditor } from "@/lib/types";
import { useParams } from "next/navigation";
import localDb from "@/lib/database.config";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
// import EditorBoard from "./EditorBoard";
// import EditorDoc from "./EditorDoc";

const EditorDoc = dynamic(() => import("./EditorDoc"), {
  ssr: false,
});

const EditorBoard = dynamic(() => import("./EditorBoard"), {
  ssr: false,
});

export function Editor({
  courseId,
  courseItemId,
}: {
  courseId: string;
  courseItemId: string;
}) {
  //   const convex = useConvex();
  const Tabs = [
    {
      name: "Document",
    },
    {
      name: "Both",
    },
    {
      name: "Canvas",
    },
  ];
  const [activeTab, setActiveTab] = useState(Tabs[0].name);
  const [triggerSave, setTriggerSave] = useState(false);
  const [fileData, setfileData] = useState<IEditor>();

  useEffect(() => {
    console.log("Editor");
    const getFileData = async () => {
        const file = await localDb.courses
          .where("id")
          .equals(parseInt(courseId))
          .first()
          .then((course) => {
            return course?.courseItems[parseInt(courseItemId)].editor;
          });
        setfileData(file);
        console.log(file);
    }; 
    getFileData();
  }, [activeTab]);

  
  return (
    <div className="overflow-hidden w-full">
      <EditorHeader
        Tabs={Tabs}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        onSave={() => setTriggerSave(!triggerSave)}
        file={fileData}
      />
      {activeTab === "Document" ? (
        <div
          style={{
            height: "calc(100vh - 3rem)",
          }}
        >
          <EditorDoc
            onSaveTrigger={triggerSave}
            courseId={courseId}
            courseItemId={courseItemId}
            fileData={fileData!}
          />
        </div>
      ) : 
      activeTab === "Both" ? (
        <ResizablePanelGroup
          style={{
            height: "calc(100vh - 3rem)",
          }}
          direction="horizontal"
        >
          <ResizablePanel defaultSize={50} minSize={40} collapsible={false}>
            <EditorDoc
              onSaveTrigger={triggerSave}
              courseId={courseId}
              courseItemId={courseItemId}
              fileData={fileData!}
            />
          </ResizablePanel>
          <ResizableHandle className=" bg-neutral-600" />
          <ResizablePanel defaultSize={50} minSize={45}>
            <EditorBoard
                onSaveTrigger={triggerSave}
                courseId={courseId}
                courseItemId={courseItemId}
                fileData={fileData!} 
                key={activeTab + Date.now()} 
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) :
       activeTab === "Canvas" ? (
        <div
          style={{
            height: "calc(100vh - 3rem)",
          }}
        >
          <EditorBoard
            onSaveTrigger={triggerSave}
            courseId={courseId}
            courseItemId={courseItemId}
            fileData={fileData!} 
            key={activeTab + Date.now()} 
          />
        </div>
      ) : null}
    </div>
  );
}
