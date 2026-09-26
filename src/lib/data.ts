import "server-only";
import { connectDB } from "@/lib/db";
import ConfiguracionModel, { type Configuracion } from "@/models/Configuracion";
import JuntaDirectivaModel from "@/models/JuntaDirectiva";
import InformeModel from "@/models/Informe";
import UsuarioModel from "@/models/Usuario";
import PredioModel from "@/models/Predio";
import AvisoModel from "@/models/Aviso";
import FotoGaleriaModel from "@/models/FotoGaleria";

export type ConfiguracionPlain = Configuracion & { _id: string };
export type JuntaPlain = {
  _id: string;
  periodoInicio: number;
  periodoFin: number;
  colorAsociado: string;
  miembros: { nombre: string; cargo: string }[];
  notas: string;
  activa: boolean;
};
export type InformePlain = {
  _id: string;
  anio: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  url: string;
  nombreArchivo: string;
  tamanioBytes: number;
  createdAt: string;
};

export async function getConfiguracion(): Promise<ConfiguracionPlain> {
  await connectDB();
  let doc = await ConfiguracionModel.findOne();
  if (!doc) {
    doc = await ConfiguracionModel.create({});
  }
  return JSON.parse(JSON.stringify(doc));
}

export async function getJuntas(): Promise<JuntaPlain[]> {
  await connectDB();
  const docs = await JuntaDirectivaModel.find().sort({ periodoInicio: -1 });
  return JSON.parse(JSON.stringify(docs));
}

export async function getInformes(): Promise<InformePlain[]> {
  await connectDB();
  const docs = await InformeModel.find().sort({ anio: -1, createdAt: -1 });
  return JSON.parse(JSON.stringify(docs));
}

export type UsuarioPlain = {
  _id: string;
  nombre: string;
  email: string;
  rol: "admin" | "editor";
  activo: boolean;
  ultimoAcceso?: string;
};

export async function getUsuarios(): Promise<UsuarioPlain[]> {
  await connectDB();
  const docs = await UsuarioModel.find().select("-passwordHash").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(docs));
}

export type PredioPlain = {
  _id: string;
  nombreUsuario: string;
  predio: string;
  sector: string;
  vereda: string;
  codigoMedidor: string;
  estado: string;
  telefono: string;
  notas: string;
};

export async function getPredios(): Promise<PredioPlain[]> {
  await connectDB();
  const docs = await PredioModel.find().sort({ sector: 1, nombreUsuario: 1 });
  return JSON.parse(JSON.stringify(docs));
}

export async function getCobertura(): Promise<{ sector: string; veredas: string[]; usuarios: number }[]> {
  await connectDB();
  const docs = await PredioModel.find().select("sector vereda");
  const porSector = new Map<string, { veredas: Set<string>; usuarios: number }>();

  for (const doc of docs) {
    const sector = doc.sector || "Sin sector";
    if (!porSector.has(sector)) porSector.set(sector, { veredas: new Set(), usuarios: 0 });
    const entry = porSector.get(sector)!;
    entry.usuarios += 1;
    if (doc.vereda) entry.veredas.add(doc.vereda);
  }

  return Array.from(porSector.entries())
    .map(([sector, { veredas, usuarios }]) => ({
      sector,
      veredas: Array.from(veredas).sort((a, b) => a.localeCompare(b)),
      usuarios,
    }))
    .sort((a, b) => a.sector.localeCompare(b.sector));
}

export type AvisoPlain = {
  _id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  fechaEvento?: string;
  activo: boolean;
  createdAt: string;
};

export async function getAvisos(): Promise<AvisoPlain[]> {
  await connectDB();
  const docs = await AvisoModel.find().sort({ activo: -1, fechaEvento: 1, createdAt: -1 });
  return JSON.parse(JSON.stringify(docs));
}

export async function getAvisoDestacado(): Promise<AvisoPlain | null> {
  await connectDB();
  const doc = await AvisoModel.findOne({ activo: true }).sort({ fechaEvento: 1, createdAt: -1 });
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
}

export type FotoGaleriaPlain = {
  _id: string;
  titulo: string;
  descripcion: string;
  url: string;
  createdAt: string;
};

export async function getFotosGaleria(): Promise<FotoGaleriaPlain[]> {
  await connectDB();
  const docs = await FotoGaleriaModel.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(docs));
}
