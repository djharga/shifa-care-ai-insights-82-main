import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  component, 
  fallback = <DefaultFallback />, 
  props = {} 
}) => {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="mr-2 text-muted-foreground">جاري التحميل...</span>
  </div>
); 