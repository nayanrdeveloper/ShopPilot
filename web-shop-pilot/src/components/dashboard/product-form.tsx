'use client';

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Upload, X } from 'lucide-react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const GET_SIGNATURE = gql`
  query GetUploadSignature {
    getUploadSignature {
      signature
      timestamp
      cloudName
      apiKey
    }
  }
`;

const GENERATE_DESCRIPTION = gql`
  mutation GenerateDescription($name: String!, $category: String!) {
    generateDescription(name: $name, category: $category)
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $price: Float!
    $sku: String!
    $storeId: String!
    $stock: Int
    $description: String
    $imageUrl: String
  ) {
    createProduct(
      name: $name
      price: $price
      sku: $sku
      storeId: $storeId
      stock: $stock
      description: $description
      imageUrl: $imageUrl
    ) {
      id
    }
  }
`;

// Define Schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().min(0),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
});

// Infer Type
type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const router = useRouter();
  const store = useAuthStore((state) => state.store);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Use explicit type generics and cast resolver to any to bypass compatibility issues
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      stock: 0,
      imageUrl: '',
      category: 'General',
    },
  });

  const [getSignature] = useLazyQuery(GET_SIGNATURE);
  const [generateDesc, { loading: aiLoading }] = useMutation(GENERATE_DESCRIPTION);
  const [createProduct, { loading: createLoading }] = useMutation(CREATE_PRODUCT);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      form.setValue('imageUrl', '');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);
      const { data: sigData } = await getSignature();
      const { signature, timestamp, cloudName, apiKey } = sigData.getUploadSignature;

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed', error);
      setUploading(false);
      return null;
    }
  };

  const handleAI = async () => {
    const name = form.getValues('name');
    const category = form.getValues('category') || 'General';
    if (!name) return;

    try {
      const { data } = await generateDesc({ variables: { name, category } });
      form.setValue('description', data.generateDescription);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      let imageUrl = values.imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      await createProduct({
        variables: {
          name: values.name,
          price: values.price,
          sku: values.sku,
          stock: values.stock,
          description: values.description,
          imageUrl,
          storeId: store?.id,
        },
      });

      router.push('/dashboard/products');
      router.refresh();
    } catch (error) {
      console.error('Failed to create product', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-4">
                {previewUrl ? (
                  <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                    <Image src={previewUrl} alt="Preview" className="object-cover" fill />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImageFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                    <div className="text-muted-foreground flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="mb-2 h-8 w-8" />
                      <p className="text-sm">Click to upload product image</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Wireless Headphones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (for AI)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electronics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-purple-600 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/20"
                    onClick={handleAI}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-3 w-3" />
                    )}
                    Generate with AI
                  </Button>
                </div>
                <FormControl>
                  <Textarea placeholder="Product details..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="PROD-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || createLoading}>
              {(uploading || createLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? 'Uploading Image...' : createLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
