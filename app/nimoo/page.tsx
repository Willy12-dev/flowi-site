export const metadata = {
  title: 'Nimoo - Smart POS for Small Businesses',
  description: 'Track sales, manage inventory, accept M-Pesa, and let customers order directly from your shop.',
};

export default function NimooDownload() {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1009', color: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ background: '#2d2010', border: '2px solid #eab308', borderRadius: 20, padding: '48px 32px', textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <div style={{ color: '#eab308', fontSize: 48, fontWeight: 'bold', marginBottom: 8 }}>Nimoo</div>
        <div style={{ color: '#a8927a', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
          Smart POS for your business. Track sales, manage inventory, accept M-Pesa, and let customers order directly.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="https://github.com/Willy12-dev/NIMOO/releases/latest/download/nimoo-v1.0.0.zip"
            style={{ display: 'block', background: '#eab308', color: '#1a1009', fontSize: 18, fontWeight: 700, padding: '16px 32px', borderRadius: 14, textDecoration: 'none' }}
          >
            Download for Android
          </a>
        </div>
        <div style={{ color: '#6b5744', fontSize: 12, marginTop: 24 }}>Free for shops · Supports M-Pesa · Made in Kenya</div>
      </div>
    </div>
  );
}
