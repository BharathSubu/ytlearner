"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";  
import { ICourse, IEditor } from "@/lib/types";
import localDb from "@/lib/database.config";

const EditorBoard =  ({
    onSaveTrigger,
    courseId,
    courseItemId,
    fileData
  }: {
    onSaveTrigger: any;
    courseId: any;
    courseItemId: any;
    fileData: IEditor; 
  }) => {
  const [whiteBoard, setWhiteBoard] = useState<any>( );

  useEffect(() => {

    if ( !fileData || !fileData.whiteboard ) {
        console.warn('fileData or fileData.whiteboard is undefined');
        setWhiteBoard(undefined);
        return;
    }

    async function loadFromStorage() {
        const storageString =  fileData.whiteboard ;
        return storageString
          ? (await JSON.parse(storageString) )
          : undefined;
    } 

    loadFromStorage().then((content) => {
        setWhiteBoard(content);
    });  
    console.log("Document for whiteboard loaded");

  }, [fileData]);

  //const updateWhiteBoard = useMutation(api.files.updateWhiteboard);

  const saveWhiteboard = async () => { 
    let course = await localDb.courses.where("id").equals(parseInt(courseId)).first();
    // course!.courseItems[parseInt(courseItemId)].editor?.whiteboard = JSON.stringify(whiteBoard);
    course!.courseItems[parseInt(courseItemId)].editor.whiteboard = JSON.stringify(whiteBoard);
    console.log(whiteBoard);
    await localDb.courses.update(parseInt(courseId), course as any);
  };

   

  return (
    <>
      <div className="h-full w-full">
        { whiteBoard ?  (
          <Excalidraw
            theme="dark"
            initialData={{
              elements: whiteBoard,
            }}
            UIOptions={{
              canvasActions: {
                export: false,
                loadScene: false,
                saveAsImage: false,
              },
            }}
            onChange={(excaliDrawElements, appState, files) => {
              setWhiteBoard(excaliDrawElements);
              saveWhiteboard();
            //   console.log(excaliDrawElements);
            }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.Help />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
            </MainMenu>
            <WelcomeScreen>
              <WelcomeScreen.Hints.MenuHint />
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Hints.HelpHint />
            </WelcomeScreen>
          </Excalidraw>
        ) : (
          <Excalidraw
            theme="dark"
            UIOptions={{
              canvasActions: {
                export: false,
                loadScene: false,
                saveAsImage: false,
              },
            }}
            onChange={(excaliDrawElements, appState, files) => {
              setWhiteBoard(excaliDrawElements);
              console.log("Files")
              console.log(files);
            }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.Help />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
            </MainMenu>
            <WelcomeScreen>
              <WelcomeScreen.Hints.MenuHint />
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Hints.HelpHint />
            </WelcomeScreen>
          </Excalidraw>
        )}
      </div>
    </>
  );
};

export default EditorBoard;