'use client';

import { ShoppingCart, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import { Badge } from '@/components/ui/badge';

const GET_STORE_BRANDING = gql`
  query GetStoreBranding($slug: String!) {
    store(slug: $slug) {
      id
      name
      primaryColor
    }
  }
`;

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params?.slug as string;

  const { data } = useQuery(GET_STORE_BRANDING, {
    variables: { slug },
    skip: !slug,
  });

  const storeName = data?.store?.name || 'Store';
  const primaryColor = data?.store?.primaryColor || '#000000';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Public Store Header */}
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <Link
              href={`/${slug}`}
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <span className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
                {storeName}
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Search className="text-muted-foreground h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-muted-foreground/20 hover:border-primary/50 relative transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                style={{ backgroundColor: primaryColor }}
              >
                0
              </Badge>
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="w-full flex-1">{children}</main>

      <footer className="border-t bg-white py-12">
        <div className="container flex flex-col items-center justify-between gap-6 px-4 sm:px-8 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg font-bold">{storeName}</h4>
            <p className="text-muted-foreground max-w-xs text-sm">
              Quality products sent directly to your doorstep.
            </p>
          </div>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-muted-foreground/50 text-xs">
            &copy; {new Date().getFullYear()} {storeName}
          </div>
        </div>
      </footer>
    </div>
  );
}
