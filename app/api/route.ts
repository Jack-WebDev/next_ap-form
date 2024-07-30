
import { NextRequest, NextResponse } from "next/server";

import {Config} from "sst/node/config"

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


export async function GET(req: NextRequest) {
    return NextResponse.json({hello: "Jack", ...Config}, {status: 200});
}