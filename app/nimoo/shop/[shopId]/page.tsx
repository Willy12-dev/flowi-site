'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://abtluivjiudgfkszrhif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidGx1aXZqaXVkZ2Zrc3pyaGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTE4NzQsImV4cCI6MjA5MDM4Nzg3NH0.zMQbOJSfFjHmLAehIuorYN-33VxMWyGTc-kscTLVlOk'
);

export default function ShopPage({ params }: { params: { shopId: string } }) {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('nimoo_shops')
      .select('name, type, location')
      .eq('id', params.shopId)
      .single()
      .then(({ data }) => {
        setShop(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.shopId]);

  const type = shop?.type ? shop.type.charAt(0).toUpperCase() + shop.type.slice(1) : '';

  return (
    <div style={{ minHeight: '100vh', background: '#1a1009', color: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ background: '#2d2010', border: '2px solid #eab308', borderRadius: 20, padding: '48px 32px', textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <div style={{ color: '#eab308', fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>Nimoo</div>
        {loading ? (
          <div style={{ color: '#a8927a' }}>Loading shop...</div>
        ) : shop ? (
          <>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{shop.name}</div>
            <div style={{ color: '#a8927a', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 32 }}>
              {type}{shop.location ? ` · ${shop.location}` : ''}
            </div>
            <div style={{ color: '#a8927a', fontSize: 16, marginBottom: 32, lineHeight: 1.5 }}>
              Download Nimoo to browse products, order, and shop from {shop.name}.
            </div>
            <a
              href="https://github.com/Willy12-dev/NIMOO/releases/latest/download/nimoo-v1.0.0.zip"
              style={{ display: 'block', background: '#eab308', color: '#1a1009', fontSize: 18, fontWeight: 700, padding: '16px 32px', borderRadius: 14, textDecoration: 'none' }}
            >
              Download Nimoo
            </a>
            <div style={{ color: '#6b5744', fontSize: 12, marginTop: 24 }}>Free for customers · Supports M-Pesa</div>
          </>
        ) : (
          <div style={{ color: '#a8927a' }}>Shop not found</div>
        )}
      </div>
    </div>
  );
}
