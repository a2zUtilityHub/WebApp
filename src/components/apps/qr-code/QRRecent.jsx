import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import QRCode from 'qrcode.react';

const QRRecent = ({ recents, loadConfig }) => {
  if (!recents || recents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          You haven't generated any QR codes yet. Your recent codes will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recents.map((config, index) => (
        <Card key={index} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4 truncate">
              <div className="p-1 bg-white rounded-md">
                <QRCode
                  value={config.qrValue}
                  size={40}
                  fgColor={config.fgColor}
                  bgColor={config.bgColor}
                  level="Q"
                  renderAs="svg"
                />
              </div>
              <div className="truncate">
                <p className="font-semibold truncate">{config.qrValue}</p>
                <p className="text-sm text-muted-foreground">Generated on {new Date(config.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => loadConfig(config)}>
              Load <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QRRecent;