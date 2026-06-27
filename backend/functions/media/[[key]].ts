interface Env { MEDIA: R2Bucket; }
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const raw = params.key;
  const key = Array.isArray(raw) ? raw.join('/') : String(raw || '');
  if (!key) return new Response('Missing media key', { status: 400 });
  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not found', { status: 404 });
  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable'
    }
  });
};
