"use client";

import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

type ImageWithSkeletonProps = Omit<ImageProps, "onLoadingComplete"> & {
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackText?: string;
};

export default function ImageWithSkeleton({
  alt,
  containerClassName,
  skeletonClassName,
  fallbackText = "Image unavailable",
  className,
  onLoad,
  onError,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!isLoaded && (
        <Skeleton
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-10 rounded-none bg-muted",
            skeletonClassName,
          )}
        />
      )}
      <Image
        alt={alt}
        {...props}
        className={cn("relative z-0", className)}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setHasError(true);
          setIsLoaded(true);
          onError?.(event);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-muted/80 px-3 text-center text-xs text-muted-foreground">
          {fallbackText}
        </div>
      )}
    </div>
  );
}
