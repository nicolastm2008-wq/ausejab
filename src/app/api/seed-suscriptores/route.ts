import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SuscriptorModel from "@/models/Suscriptor";
import { SUSCRIPTORES_DATA } from "../../../../scripts/suscriptores-data";

const SECRET = process.env.INIT_SECRET;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (!SECRET || searchParams.get("key") !== SECRET) {
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
