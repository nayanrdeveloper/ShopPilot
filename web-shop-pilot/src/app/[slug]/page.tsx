'use client';

import { useQuery, gql } from '@apollo/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { ClassicTheme } from '@/components/storefront/classic-theme';
import { ModernTheme } from '@/components/storefront/modern-theme';

const GET_PUBLIC_STORE = gql`
  query GetPublicStore($slug: String!) {
    store(slug: $slug) {
      id
      name
      about
      primaryColor
      template
      products {
        id
        name
        description
        price
        imageUrl
        stock
      }
    }
  }
`;

export default function StorePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data, loading, error } = useQuery(GET_PUBLIC_STORE, {
    variables: { slug },
    skip: !slug,
  });

  if (loading) {
    return (
      <div className="container mx-auto space-y-12 px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-[300px] w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.store) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-6 px-4 text-center">
        <h1 className="text-6xl font-black text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="text-3xl font-bold">Store Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't find the shop you're looking for. It might have been moved or deleted.
        </p>
        <Button size="lg" onClick={() => (window.location.href = '/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const store = data.store;
  const template = store.template || 'classic';

  if (template === 'modern') {
    return <ModernTheme store={store} />;
  }

  // Default to Classic
  return <ClassicTheme store={store} />;
}
