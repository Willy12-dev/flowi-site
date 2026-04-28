'use client';

export default function Footer() {
  return (
    <footer
      className="px-8 md:px-12 lg:px-16 pt-12 pb-10 border-t"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <div
          className="display text-[80px] md:text-[160px] lg:text-[220px] leading-[0.85]"
          style={{ color: 'var(--ink)', fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
        >
          Flowi.
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6 pt-8 border-t" style={{ borderColor: 'var(--rule)' }}>
          <p className="meta">© Flowi Group Investments · Nairobi, Kenya</p>
          <div className="flex gap-8 meta">
            <a href="https://www.instagram.com/flowigroup" className="hover:opacity-60">Instagram</a>
            <a href="https://www.tiktok.com/@flowigroup" className="hover:opacity-60">TikTok</a>
            <a href="https://twitter.com/FlowiGroup" className="hover:opacity-60">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
