'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Globe, Share2, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

// If we don't have a toast component yet, we'll use a simple alert or state message
// For now, I'll use a simple state message or browser alert

const GET_STORE_SETTINGS = gql`
  query GetStoreSettings($slug: String!) {
    store(slug: $slug) {
      id
      name
      slug
      about
      template
      seoTitle
      seoDescription
      seoKeywords
      twitter
      instagram
      facebook
      linkedin
      primaryColor
    }
  }
`;

const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $input: UpdateStoreInput!) {
    updateStore(id: $id, input: $input) {
      id
      name
      slug
      template
      primaryColor
      seoTitle
    }
  }
`;

const formSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
  about: z.string().optional(),
  template: z.string().optional(),
  seoTitle: z.string().max(60, 'SEO Title should be under 60 chars').optional(),
  seoDescription: z.string().max(160, 'SEO Description should be under 160 chars').optional(),
  seoKeywords: z.string().optional(),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid Hex Color')
    .optional()
    .or(z.literal('')),
});

type StoreSettingsValues = z.infer<typeof formSchema>;

export function StoreSettingsForm() {
  const authStore = useAuthStore((state) => state.store);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    data,
    loading: fetching,
    error,
  } = useQuery(GET_STORE_SETTINGS, {
    variables: { slug: authStore?.slug },
    skip: !authStore?.slug,
    fetchPolicy: 'network-only',
  });

  const form = useForm<StoreSettingsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      about: '',
      template: 'classic',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      primaryColor: '#000000',
    },
  });

  // Reset form when data arrives
  useEffect(() => {
    if (data?.store && !form.formState.isDirty && !fetching) {
      const s = data.store;
      form.reset({
        name: s.name || '',
        slug: s.slug || '',
        about: s.about || '',
        template: s.template || 'classic',
        seoTitle: s.seoTitle || '',
        seoDescription: s.seoDescription || '',
        seoKeywords: s.seoKeywords || '',
        twitter: s.twitter || '',
        instagram: s.instagram || '',
        facebook: s.facebook || '',
        linkedin: s.linkedin || '',
        primaryColor: s.primaryColor || '#000000',
      });
    }
  }, [data, fetching, form]);

  const [updateStore, { loading: updating }] = useMutation(UPDATE_STORE, {
    onCompleted: () => {
      setSuccessMessage('Store settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (values: StoreSettingsValues) => {
    if (!authStore?.id) return;
    setSuccessMessage('');

    try {
      await updateStore({
        variables: {
          id: authStore.id,
          input: values,
        },
      });
    } catch {
      // Error handled in onError
    }
  };

  if (fetching)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="text-primary h-6 w-6 animate-spin" />
      </div>
    );
  if (error) return <div className="text-red-500">Error loading settings.</div>;
  if (!authStore) return <div>Please log in.</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Store Configuration</h3>
            <p className="text-muted-foreground text-sm">
              Manage your store's identity and visibility.
            </p>
          </div>
          <Button type="submit" disabled={updating || fetching}>
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        {successMessage && (
          <div className="rounded-md bg-green-100 p-4 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-[500px] grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" /> Appearance & Theme
                </CardTitle>
                <CardDescription>Customize how your store looks to customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Store Theme</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                          <div>
                            <RadioGroupItem value="classic" id="classic" className="peer sr-only" />
                            <Label
                              htmlFor="classic"
                              className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4"
                            >
                              <div className="mb-3 flex h-32 w-full items-center justify-center rounded-md bg-stone-100 p-2">
                                <span className="font-serif text-3xl font-bold text-stone-500">
                                  Classic
                                </span>
                              </div>
                              <span className="block w-full text-center font-semibold">
                                Classic Minimal
                              </span>
                              <span className="text-muted-foreground mt-1 block w-full text-center text-xs">
                                Clean, white-label, elegant.
                              </span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
                            <Label
                              htmlFor="modern"
                              className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4"
                            >
                              <div className="mb-3 flex h-32 w-full items-center justify-center rounded-md bg-blue-100 p-2">
                                <span className="font-sans text-3xl font-bold text-blue-600">
                                  Modern
                                </span>
                              </div>
                              <span className="block w-full text-center font-semibold">
                                Modern Vibrant
                              </span>
                              <span className="text-muted-foreground mt-1 block w-full text-center text-xs">
                                Colorful, card-based, bold.
                              </span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <div className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full border p-1 transition-transform hover:scale-105">
                            <Input
                              type="color"
                              className="absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 p-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="#000000"
                              {...field}
                              className="font-mono uppercase"
                              maxLength={7}
                            />
                          </FormControl>
                          <FormDescription>Used for buttons, links, and accents.</FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="general" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" /> Branding
                </CardTitle>
                <CardDescription>Basic store information and appearance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store URL Slug</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="text-muted-foreground bg-muted rounded-l-md border border-r-0 px-3 py-2.5 text-sm">
                              shoppilot.com/
                            </span>
                            <Input {...field} className="rounded-l-none" />
                          </div>
                        </FormControl>
                        <FormDescription>Unique identifier for your store URL.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your store..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Brand Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" className="h-10 w-12 cursor-pointer p-1" {...field} />
                        </FormControl>
                        <FormControl>
                          <Input placeholder="#000000" {...field} className="font-mono" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" /> Search Engine Optimization
                </CardTitle>
                <CardDescription>
                  Improve your store's visibility on search engines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Best Online Store for X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="We sell quality products..." {...field} />
                      </FormControl>
                      <FormDescription>Shown in search results. Keep it catchy.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="fashion, electronics, sale" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated values.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" /> Social Media
                </CardTitle>
                <CardDescription>Connect your social profiles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
