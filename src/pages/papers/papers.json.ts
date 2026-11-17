import type { APIRoute } from 'astro';
import records from '../../../papers/papers.json';

export const GET: APIRoute = () => {
  const citations = records.map(({ id: _id, ...citation }) => citation);
  return Response.json(citations);
};
