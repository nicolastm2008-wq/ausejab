import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireSession } from "@/lib/require-session";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_ROWS = 5000;

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Archivo faltante" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "El archivo supera el límite de 10 MB" }, { status: 400 });
  }

  let workbook: XLSX.WorkBook;
  try {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo. Verifica que sea un Excel (.xlsx, .xls) o CSV válido." },
      { status: 400 },
    );
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return NextResponse.json({ error: "El archivo no tiene hojas con datos" }, { status: 400 });
  }
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  if (rows.length === 0) {
    return NextResponse.json({ error: "No se encontraron filas de datos en la hoja" }, { status: 400 });
  }

  const columns = Object.keys(rows[0]);
  const limitedRows = rows.slice(0, MAX_ROWS).map((row) => {
    const clean: Record<string, string> = {};
    for (const col of columns) {
      const value = row[col];
      clean[col] = value === undefined || value === null ? "" : String(value).trim();
    }
    return clean;
  });

  return NextResponse.json({
    ok: true,
    sheetName,
    columns,
    rows: limitedRows,
    totalRows: rows.length,
    truncated: rows.length > MAX_ROWS,
  });
}
