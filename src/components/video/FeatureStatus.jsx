
import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVideoContext } from '@/contexts/VideoContext';

const FeatureStatus = ({ featureName, processing, enabled, error }) => {
  if (!processing && !enabled && !error) return null;

  return (
    <div className="mt-2 text-xs flex items-center gap-2">
      {processing && (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-primary" />
          <span className="text-muted-foreground">Processing {featureName}...</span>
        </>
      )}
      {!processing && enabled && !error && (
        <>
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          <span className="text-green-500">{featureName} Applied</span>
        </>
      )}
      {error && (
        <>
          <AlertCircle className="w-3 h-3 text-destructive" />
          <span className="text-destructive">{error}</span>
        </>
      )}
    </div>
  );
};

export default FeatureStatus;
