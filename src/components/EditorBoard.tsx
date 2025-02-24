"use client";

import React, { useEffect, useState, useRef } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";  
import { ExcalidrawElementFiles, IEditor } from "@/lib/types";
import localDb from "@/lib/database.config";

const EditorBoard = ({
    onSaveTrigger,
    courseId,
    courseItemId,
    fileData,
    key
}: {
    onSaveTrigger: any;
    courseId: any;
    courseItemId: any;
    key : any;
    fileData: IEditor;
}) => {
    const [whiteBoard, setWhiteBoard] = useState<ExcalidrawElementFiles>();
    const whiteBoardRef = useRef<ExcalidrawElementFiles>(); // Store the current state without causing re-renders

    useEffect(() => {
        if (!fileData || !fileData.whiteboardFiles) {
            console.warn("fileData or fileData.whiteboard is undefined");
            setWhiteBoard(undefined);
            return;
        }

        async function loadFromStorage() {
            return fileData.whiteboardFiles;
        }

        loadFromStorage().then((content) => {
            setWhiteBoard(content);
            whiteBoardRef.current = content; // Update ref without re-rendering
        });

        console.log("Document for whiteboard loaded");
    }, [fileData,key]);

    const saveWhiteboard = async () => {
        if (!whiteBoardRef.current) return;

        let course = await localDb.courses.where("id").equals(parseInt(courseId)).first();
        if (course) {
            course.courseItems[parseInt(courseItemId)].editor.whiteboardFiles = whiteBoardRef.current;
            await localDb.courses.update(parseInt(courseId), course as any);
            console.log("Saved whiteboard", whiteBoardRef.current);
        }
    };

    // Debounced Save function (prevents excessive re-renders)
    // ignore ts check
    // @ts-ignore
    const handleWhiteboardChange = (excaliDrawElements, appState, files) => {
        const scene: ExcalidrawElementFiles = {
            excalidrawElement: JSON.stringify([...excaliDrawElements]),
            excalidrawState: JSON.stringify(appState),
            excalidrawElementFiles: JSON.stringify(files),
        };
        console.log("handleWhiteboardChange", scene);
        console.log("FIles");
        console.log(files);
        console.log(excaliDrawElements);

        // Only update if the new state is different from the old one
        if (JSON.stringify(scene) !== JSON.stringify(whiteBoardRef.current)) {
            setWhiteBoard(scene);
            whiteBoardRef.current = scene;
            console.log("Updating whiteboard data", scene);
            // Save with a slight delay (debounce)
            setTimeout(saveWhiteboard, 500);
        }
    };

    return (
        <div className="h-full w-full">
            <Excalidraw
                theme="dark"
                initialData={whiteBoard ? {
                    elements: JSON.parse(whiteBoard.excalidrawElement),
                    files: JSON.parse(whiteBoard.excalidrawElementFiles)
                } : undefined}
                UIOptions={{
                    canvasActions: {
                        export: false,
                        loadScene: false,
                        saveAsImage: false,
                    },
                }}
                onChange={handleWhiteboardChange}
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
        </div>
    );
};

export default EditorBoard;
