import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SuscriptorModel from "@/models/Suscriptor";
import { SUSCRIPTORES_DATA } from "../../../../scripts/suscriptores-data";

const FIXED_KEY = "ausavesjab-seed-2026-x7k";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = process.env.INIT_SECRET ?? FIXED_KEY;
    if (searchParams.get("key") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await SuscriptorModel.deleteMany({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await SuscriptorModel.insertMany(SUSCRIPTORES_DATA as unknown as object[]);

    const count = await SuscriptorModel.countDocuments();
    return NextResponse.json({ ok: true, inserted: count });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
