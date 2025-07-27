// app/page.tsx
'use client';

import { Providers } from '../providers';
import { TokenTable } from '../components/TokenTable';

export default function HomePage() {
  return (
    <Providers>
      <TokenTable />
    </Providers>
  );
}