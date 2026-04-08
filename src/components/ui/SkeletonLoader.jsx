import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => (
  <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col h-full">
    <Skeleton className="w-full h-64 bg-muted/40" />
    <div className="p-4 space-y-3 flex-grow bg-gradient-to-b from-transparent to-muted/5">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-auto pt-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 p-8">
    <Skeleton className="w-full h-96 md:h-[500px] rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2 mt-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="mt-12">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border border-border/50 bg-background/60 backdrop-blur-sm rounded-2xl mb-4 shadow-sm">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2 flex-grow">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);