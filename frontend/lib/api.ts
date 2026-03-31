const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

async function post<T>(url: string, body: object): Promise<T> {
  const res = await fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json() as Promise<T>;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(BASE + url);
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json() as Promise<T>;
}

export const api = {
  getSituations: () => get<import('../types').Situation[]>('/api/situations'),
  getSituation: (id: string) => get<import('../types').Situation>('/api/situations/' + id),
  getLawyers: () => get<import('../types').Lawyer[]>('/api/lawyers'),
  explainRights: (slug: string, language: string) =>
    post<{ plain_language_rights: string[]; original_sections: import('../types').LawSection[] }>(
      '/api/ai/explain',
      { situation_slug: slug, language }
    ),
  generateDocument: (templateType: string, fields: import('../types').DocumentFormData, language: string) =>
    post<{ document_text: string }>('/api/documents/generate', { templateType, fields, language }),
};
