export default function VideoCard({
  src,
  poster,
  titulo,
}: {
  src: string;
  poster: string;
  titulo: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <video
        src={src}
        poster={poster}
        controls
        preload="metadata"
        className="aspect-video w-full bg-slate-900 object-cover"
      >
        Tu navegador no soporta la reproducción de video.
      </video>
      <figcaption className="p-4">
        <p className="text-sm font-semibold text-slate-900">{titulo}</p>
      </figcaption>
    </figure>
  );
}
