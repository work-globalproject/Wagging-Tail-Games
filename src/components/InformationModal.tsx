import { useEffect, useState } from 'react';
export function InformationModal() {
  const [page, setPage] = useState<string | null>(null);
  useEffect(() => {
    const open = (event: MouseEvent) => {
      const href = (event.target as Element)?.closest('a')?.getAttribute('href');
      if (href === '/privacy.html' || href === '/support.html') { event.preventDefault(); setPage(href); }
    };
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, []);
  if (!page) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Help and privacy">
    <section className="modal-panel max-w-2xl">
      <button className="modal-close" aria-label="Close help" onClick={() => setPage(null)}>✕</button>
      <iframe title={page.includes('privacy') ? 'Privacy notice' : 'Help and support'} src={page} className="w-full h-[72dvh] mt-8 border-0" />
    </section>
  </div>;
}
