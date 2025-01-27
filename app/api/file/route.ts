import { NextResponse } from "next/server";
import { get_file } from "@/app/actApi/uploadFile";

/**
 * http://localhost:3000/api/file?filename=aisdjasoidj.jpg
 */
export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    

    if(!filename){
        return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
    }

    const blob = await get_file(filename);

    if(!blob){
        return NextResponse.json({ error: 'failed to fetch file' }, { status: 500 });
    }

    if(blob === "file not found"){
        return NextResponse.json({ error: "file not found" }, { status: 404 });
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`
        }
    })
}