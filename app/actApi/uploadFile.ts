"use server";

export async function UploadFile(formFile: FormData, accessToken: string) {
  try {
    const response = await fetch(`http://localhost:5000/file/upload`, {
      method: "POST",
      headers: {
        token: accessToken,
      },
      body: formFile,
    });
    const result = await response.json();
    console.log(result);

    return result;
  } catch (e: any) {
    console.error("Upload ERROR DI SERVER");
    console.log(e);
  }
}


export async function upload_multiple_file(formFile: FormData, accessToken: string){
  try {
    const response = await fetch(`http://localhost:5000/file/upload_multiple`, {
      method: "POST",
      headers: {
        token: accessToken
      },
      body: formFile
    });

    const result = await response.json();
    console.log(result);

    return result;
  }catch(e: any){
    console.error("UPLOAD MULTIPLE ERROR DI SERVER");
    console.log(e);
  }
}

export async function delete_file(filename: string, accessToken: string) {
  try {
    const res = await fetch(`http://localhost:5000/file/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: accessToken,
        filename: filename,
      }),
    });

    const result = await res.json();

    console.log(result);
  } catch (e: any) {
    console.error("DELETE GAGAL");
    console.log(e);
  }
}

export async function get_file(filename:string) {
  try{
    const res = await fetch(`http://localhost:5000/file/get_multiple_without_auth?filename=${filename}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(res.status === 401){
      return "file not found"
    }

    const blob = await res.blob();

    console.log(blob);
    return blob;
  }catch(e:any) {
    console.error("GET FILE ERROR");
    console.log(e);
  }
}