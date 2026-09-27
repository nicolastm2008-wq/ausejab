"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import { PREDIO_FIELDS, type PredioFieldKey } from "@/lib/predio-fields";

type ParseResult = {
  sheetName: string;
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
  truncated: boolean;
};

type Mapping = Partial<Record<PredioFieldKey, string>>;

const SIN_USAR = "__sin_usar__";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

const PISTAS: Record<PredioFieldKey, string[]> = {
  nombreUsuario: ["nombre", "usuario", "suscriptor", "propietario"],
  sector: ["sector", "zona"],
  predio: ["predio", "direccion", "finca", "lote"],
  vereda: ["vereda"],
  codigoMedidor: ["medidor", "contador"],
  estado: ["estado"],
  telefono: ["telefono", "celular", "contacto"],
  notas: ["nota", "observacion"],
};

function adivinarMapeo(columns: string[]): Mapping {
  const mapping: Mapping = {};
  for (const field of PREDIO_FIELDS) {
    const pistas = PISTAS[field.key];
    const match = columns.find((col) => {
      const norm = normalizar(col);
      return pistas.some((p) => norm.includes(p));
    });
    if (match) mapping[field.key] = match;
  }
  return mapping;
}

export default function SectoresImportador() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analizando, setAnalizando] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [mapping, setMapping] = useState<Mapping>({});
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<{ creados: number; omitidos: number } | null>(null);

  async function handleAnalizar() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona un archivo Excel (.xlsx, .xls) o CSV");
      return;
    }

    setAnalizando(true);
    setError(null);
    setResultado(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/sectores/importar/parse", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    setAnalizando(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo leer el archivo");
      return;
    }

    setParseResult(data);
    setMapping(adivinarMapeo(data.columns));
  }

  async function handleImportar() {
    if (!parseResult) return;
    if (!mapping.nombreUsuario || !mapping.sector) {
      setError("Debes asignar una columna para \"Nombre del usuario\" y para \"Sector\"");
      return;
    }

    setImportando(true);
    setError(null);

    const registros = parseResult.rows.map((row) => {
      const registro: Record<string, string> = {};
      for (const field of PREDIO_FIELDS) {
        const col = mapping[field.key];
        registro[field.key] = col ? row[col] ?? "" : "";
      }
      return registro;
    });

    const res = await fetch("/api/sectores/importar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registros }),
    });
    const data = await res.json().catch(() => ({}));

    setImportando(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo importar el archivo");
      return;
    }

    setResultado({ creados: data.creados, omitidos: data.omitidos?.length ?? 0 });
    setParseResult(null);
    setMapping({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
          <FileSpreadsheet className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">Importar desde Excel</h2>
          <p className="text-sm text-slate-500">
            Sube el Excel de sectores tal como lo tienes hoy; en el siguiente paso indicas qué columna
            corresponde a cada dato.
          </p>
        </div>
      </div>

      {!parseResult && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="w-full min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-aqua-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-aqua-700"
          />
          <button
            onClick={handleAnalizar}
            disabled={analizando}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-aqua-700 px-4 py-2 text-sm font-semibold text-white hover:bg-aqua-800 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {analizando ? "Analizando..." : "Analizar archivo"}
          </button>
        </div>
      )}

      {parseResult && (
        <div className="mt-5 space-y-5">
          <p className="text-sm text-slate-600">
            Se encontraron <strong>{parseResult.totalRows}</strong> fila(s) y{" "}
            <strong>{parseResult.columns.length}</strong> columna(s) en la hoja &quot;{parseResult.sheetName}&quot;.
            {parseResult.truncated && " Solo se muestran las primeras 5000 filas."}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PREDIO_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={mapping[field.key] ?? SIN_USAR}
                  onChange={(e) =>
                    setMapping((m) => ({
                      ...m,
                      [field.key]: e.target.value === SIN_USAR ? undefined : e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value={SIN_USAR}>— No usar —</option>
                  {parseResult.columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Vista previa (primeras 5 filas)</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {PREDIO_FIELDS.map((field) => (
                      <th key={field.key} className="whitespace-nowrap px-3 py-2 font-medium">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parseResult.rows.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      {PREDIO_FIELDS.map((field) => {
                        const col = mapping[field.key];
                        return (
                          <td key={field.key} className="whitespace-nowrap px-3 py-2 text-slate-600">
                            {col ? row[col] || "—" : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleImportar}
              disabled={importando}
              className="inline-flex items-center gap-2 rounded-full bg-aqua-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aqua-800 disabled:opacity-60"
            >
              {importando ? "Importando..." : `Importar ${parseResult.rows.length} registro(s)`}
            </button>
            <button
              onClick={() => {
                setParseResult(null);
                setMapping({});
                setError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!parseResult && error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {resultado && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Se importaron <strong>{resultado.creados}</strong> registro(s).
            {resultado.omitidos > 0 && ` Se omitieron ${resultado.omitidos} fila(s) sin nombre o sector.`}
          </p>
        </div>
      )}
    </div>
  );
}
