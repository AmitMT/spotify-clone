import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import unprotectedRoutes from '../lib/unprotectedRoutes';

export const middleware = async (req: NextRequest) => {
	// Token will exist if user is logged in
	const token = await getToken({
		req: req as any,
		secret: process.env.JWT_SECRET as string,
	});

	const { pathname } = req.nextUrl;

	// unsecured routes
	if (unprotectedRoutes.every((route) => pathname.startsWith(route))) {
		return NextResponse.next();
	}

	if (!token && !pathname.startsWith('/login')) {
		return NextResponse.redirect('/login');
	}

	return NextResponse.next();
};
