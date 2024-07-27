"use client";

import React, { useEffect, useMemo, useRef, useState } from "react"; 
import { IEditor } from "@/lib/types";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, darkDefaultTheme, lightDefaultTheme, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"; 
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import localDb from "@/lib/database.config";
import { useTheme } from "next-themes";

 

const EditorDoc = ({
  onSaveTrigger,
  courseId,
  courseItemId,
  fileData,
}: {
  onSaveTrigger: any;
  courseId: any;
  courseItemId: any;
  fileData: IEditor;
}) => {
  const { theme } = useTheme();
  const ref = useRef<BlockNoteEditor>();

  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");
 
  useEffect(() => { 

    if (!fileData || !fileData.document) {
      console.warn('fileData or fileData.document is undefined');
      setInitialContent(undefined);
      return;
    } 

    async function loadFromStorage() { 
      const storageString = fileData.document;
      return storageString
        ? (JSON.parse(storageString))
        : undefined;
    } 
    loadFromStorage().then((content) => {
      setInitialContent(content);
    });  
    // console.log("Documnet Loaded");
  }, [fileData]);
  
   

  async function saveToStorage(jsonBlocks: Block[]) {
 
     let course = await localDb.courses.where("id").equals(parseInt(courseId)).first();
     course!.courseItems[parseInt(courseItemId)].editor.document = JSON.stringify(jsonBlocks);;
     await localDb.courses.update(parseInt(courseId), course as any);

  }

   const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  const darkTheme = {
    ...lightDefaultTheme,
    colors: {
      ...lightDefaultTheme.colors,
      editor: {
        text: "#ffffff",
        background: "#020817",
      },
      sideMenu: "#ffffff",
      highlights: darkDefaultTheme.colors!.highlights,
    },
  } satisfies Theme;
 

  return (
    <div className=" h-[80vh] resize-none outline-none text-lg leading-relaxed overflow-auto">
      <BlockNoteView
        editor={editor}
        theme={theme === 'dark' ? darkTheme : lightDefaultTheme}
        onChange={() => {
          saveToStorage(editor.document); 
        }}
      />
    </div>
  );
};

export default EditorDoc;
