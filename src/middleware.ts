import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // redirect to dashboard from default dir (for testing middleware functionality)
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  // otherwise continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
