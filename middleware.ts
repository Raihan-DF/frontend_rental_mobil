import Cookies from "js-cookie";
import { NextRequest, NextResponse} from "next/server";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value || null;

    const currentUrl = new URL(request.url);
    const currentPath = currentUrl.pathname;

    // jika user mengunjungi route /customer dan anak - anaknya, cek jika access token ngga null brarti boleh lanjut, tapi kalau null brarti di lempar ke halaman login
    if(currentPath.startsWith("/customer") && (!accessToken || accessToken === null)){
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

// config buat ngasih tau Next JS kalau middleware hanya di jalankan di route - route yang di define di dalam config ini aja
export const config = {
    // ini maksudnya brarti kalau user mencoba mengunjungi route /customer bahkan dengan cara
    // memodifikasi url di atas secara manual, middleware akan jalan, tapi selain di route ini middleware gaakan ikut2
    matcher: [
        '/customer/:path*',
    ]
};