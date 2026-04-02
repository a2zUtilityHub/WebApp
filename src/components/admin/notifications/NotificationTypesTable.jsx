import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationTypesTable = () => {
  const { settings, loading, updateSetting } = useNotificationSettings();
  const { toast } = useToast();

  const handleToggle = async (id, currentStatus) => {
    const { success, error } = await updateSetting(id, !currentStatus);
    if (success) {
        toast({ title: "Updated", description: "Notification setting updated successfully." });
    } else {
        toast({ title: "Error", description: error, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Setting Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Subscribers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="font-medium capitalize">{setting.setting_name.replace(/_/g, ' ')}</TableCell>
              <TableCell className="text-muted-foreground">{setting.description}</TableCell>
              <TableCell><Badge variant="secondary">{setting.recipient_count} users</Badge></TableCell>
              <TableCell>
                 <Badge variant={setting.is_enabled ? "default" : "secondary"}>
                    {setting.is_enabled ? "Enabled" : "Disabled"}
                 </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Switch 
                    checked={setting.is_enabled}
                    onCheckedChange={() => handleToggle(setting.id, setting.is_enabled)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationTypesTable;