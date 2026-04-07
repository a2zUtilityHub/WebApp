import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, FileText, Layout, Ban } from 'lucide-react';

/**
 * Internal documentation component for AdSense policy compliance requirements.
 */
const AdSenseComplianceGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CheckCircle className="text-green-500 h-8 w-8" />
          AdSense Policy Compliance Verification
        </h1>
        <p className="text-muted-foreground mt-2">
          Internal checklist to ensure the platform meets all Google AdSense requirements before and during deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              1. Content Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Minimum Length:</strong> Each page must have at least 300 words of meaningful content.</p>
            <p>• <strong>Originality:</strong> Content must be uniquely written, avoiding scraped or duplicated material.</p>
            <p>• <strong>Value Add:</strong> The site must provide significant value (e.g., tools, utilities) alongside text.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              2. Prohibited Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Absolutely no hate speech, harassment, or discrimination.</p>
            <p>• No illegal content, cracking, hacking, or software piracy.</p>
            <p>• No sexually explicit or adult content.</p>
            <p>• No deceptive practices or misleading advertisements.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-purple-500" />
              3. Ad Placement & Density
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Spacing:</strong> Ensure a minimum of 1 line of text or 24px margin between ads and content.</p>
            <p>• <strong>Labeling:</strong> Ads should be clearly identifiable (labeled "Advertisement").</p>
            <p>• <strong>Density:</strong> Ad content should never exceed the amount of actual page content.</p>
            <p>• <strong>Navigation:</strong> Ads must not push primary navigation or core tools below the fold unexpectedly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              4. User Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>No Incentives:</strong> Do not encourage or incentivize users to click on ads.</p>
            <p>• <strong>Layout Shifts:</strong> Use skeleton loaders to prevent Cumulative Layout Shift (CLS) when ads load.</p>
            <p>• <strong>Site Structure:</strong> Maintain clear navigation, functional links, and a configured robots.txt/sitemap.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50 border-primary/20">
        <CardHeader>
          <CardTitle>Verification Checklist for Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Check <code>/ads.txt</code> is present and reachable.</li>
            <li>Run <code>adSenseComplianceChecker.js</code> scripts against core pages (Home, Blog, Apps).</li>
            <li>Verify empty ad containers collapse cleanly without leaving large white gaps.</li>
            <li>Confirm there are no overlapping ads on mobile viewports.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSenseComplianceGuide;