import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle service worker requests
  if (request.nextUrl.pathname === '/sw.js') {
    return new NextResponse(null, { status: 204 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/sw.js',
}; 