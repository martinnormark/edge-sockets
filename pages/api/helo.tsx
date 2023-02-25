// Next.js Edge API Routes: https://nextjs.org/docs/api-routes/edge-api-routes

import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function (req: NextRequest) {
  return NextResponse.json({ name: "John Doe" });
}
