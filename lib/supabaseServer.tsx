import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {

  const publicPaths = [/^\/Login$/, /^\/appMenu/, /^\/kopi82/];
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value, options }: any) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  console.log('user:', data)

  if (
    !data &&
    !request.nextUrl.pathname.startsWith('/Login') && 
    // exclude "/" route 
    request.nextUrl.pathname !== '/'
    
  ) {
    return NextResponse.redirect(new URL("/Login", request.url))
    }

  // // If no session and the user is trying to access a restricted path, redirect to login
  // if (!data && !publicPaths.some(path => request.nextUrl.pathname.startsWith(path)) && request.nextUrl.pathname !== '/') {
  //   return NextResponse.redirect(new URL('/Login', request.url));
  // }

  // return supabaseResponse
}

// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   const publicPaths = ['/login'];
//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet: any) {
//           cookiesToSet.forEach(({ name, value, options }: any) => request.cookies.set(name, value));
//           supabaseResponse = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }: any) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();
//   console.log('user:', user);

//   return {
//     sessionData: user,
//     supabaseResponse,
//     publicPaths,
//   };
// }


//v2
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   // Define paths accessible without authentication
//   const publicPaths = ['/Login'];
//   const pathname = request.nextUrl.pathname;

//   // Default response to pass through
//   let supabaseResponse = NextResponse.next();

//   // Initialize Supabase client with explicit cookie management
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet: any) => {
//           // Ensure each cookie is set on the response with correct options
//           cookiesToSet.forEach(({ name, value, options }: any) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // Retrieve the user data to validate the session
//   const { data: sessionData, error } = await supabase.auth.getUser();

//   // Debugging purposes: log the session data and errors if any
//   console.log('Session data:', sessionData, 'Error:', error);

//   // Check if the user is not authenticated
//   const isUnauthenticated = !sessionData?.user;
//   const isProtectedRoute = !publicPaths.some((path) => pathname.startsWith(path)) && pathname !== '/';

//   // Redirect to login if unauthenticated and accessing a protected route
//   if (isUnauthenticated && isProtectedRoute) {
//     return NextResponse.redirect(new URL('/Login', request.url));
//   }

//   // Return the updated response with any new or updated cookies
//   return supabaseResponse;
// }
