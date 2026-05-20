import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await assertAdmin();
    const fd = await req.formData();
    const file = fd.get("file");
    if (!(file instanceof File))
      return NextResponse.json({ error: "No file" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile(buf);
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
