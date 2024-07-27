export interface ICourse {
    id: number;
    name: string;
    url: string;
    thumbnail: IThumbnail[];
    courseItems: ICourseItem[];
    progress: number; 
}

export interface ICourseItem {
    id: string;
    name: string; 
    editor: IEditor;
    isVideo: boolean;
    parentCourseId : number; 
    iscompleted: boolean; 
    // timestamp: number;
}

export interface Todo {
    id: number;
    name: string;
    completed: boolean;
}

export interface IEditor  {
    document: string,
    whiteboard: string
}

export interface IThumbnail {
    url: string;
    width: number;
    height: number;
}
