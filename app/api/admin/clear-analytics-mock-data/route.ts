import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // This is handled client-side via localStorage, so we just need to return a successful response
    return NextResponse.json({ success: true, message: "Client-side analytics mock data cleared" });
  } catch (error) {
    console.error('Error clearing mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear mock data' },
      { status: 500 }
    );
  }
}
