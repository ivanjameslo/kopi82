import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/initSupabase';
import { updateSession } from './lib/supabaseServer';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};





// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { updateSession } from './lib/supabaseServer';

// export async function middleware(request: NextRequest) {
//   // Call updateSession to get user data and cookies
//   const { sessionData, supabaseResponse, publicPaths } = await updateSession(request);

//   // Redirect authenticated users away from /login to the home page
//   if (sessionData && request.nextUrl.pathname === '/Login') {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // If there's no session and the user is trying to access a protected page, redirect to /login
//   if (!sessionData && !publicPaths.includes(request.nextUrl.pathname.toLowerCase())) {
//     return NextResponse.redirect(new URL('/Login', request.url));
//   }

//   // Proceed if session exists or if it's a public route
//   return supabaseResponse;
// }

// // Specify the paths that the middleware should run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };