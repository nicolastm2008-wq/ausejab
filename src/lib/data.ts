import "server-only";
import { connectDB } from "@/lib/db";
import ConfiguracionModel, { type Configuracion } from "@/models/Configuracion";
import JuntaDirectivaModel from "@/models/JuntaDirectiva";
import InformeModel from "@/models/Informe";
import UsuarioModel from "@/models/Usuario";
import PredioModel from "@/models/Predio";

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
