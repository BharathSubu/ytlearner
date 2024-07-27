// pages/api/getContentItems/route.ts 
import { Client, Playlist } from "youtubei";
import { NextResponse } from "next/server";  

 

const youtube = new Client();



async function getPlaylist(playlistId: string) { 

  const playlist: Playlist = await youtube.getPlaylist(playlistId as string); 
   
  const jsonPlaylist = {
    id: playlist.id,
    title: playlist.title, 
    thumbnail : playlist.thumbnails.map(item => ({
      url: item.url,
      width: item.width,
      height: item.height,
    })),
    videos: playlist.videos.items.map((item ) => ({
      id: item.id,
      name: item.title,  
    })),
  }; 
 
  return jsonPlaylist;
}

async function getProps(request: Request){ 
  const playlist = await request.json(); 
  return playlist.playlistId;
}

export async function POST(request: Request) {
  
  try {
    
    let playlistId = await getProps(request);  
    const jsonPlaylist =  await getPlaylist(playlistId as string); 

    const response = NextResponse.json({
      status: "success",
      playlist: jsonPlaylist,
    });

    // console.log(jsonPlaylist);

    return response;

  } catch (error) { 

    const response = NextResponse.json({
      status: "error",
      error: "Failed to fetch playlist",
    });
    console.log(error);
    return response;
  }
}
