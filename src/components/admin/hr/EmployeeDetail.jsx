import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Calendar, Briefcase, CreditCard, Edit, X } from 'lucide-react';
import { StatusBadge } from './HRBadges';

const EmployeeDetail = ({ open, onClose, employee, onEdit }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6 bg-muted/30 border-b">
           <div className="flex items-start justify-between">
              <div className="flex gap-4">
                 <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                    <AvatarImage src={employee.profile_photo_url} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {employee.first_name[0]}{employee.last_name[0]}
                    </AvatarFallback>
                 </Avatar>
                 <div>
                    <h2 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="font-mono">{employee.employee_id}</Badge>
                        <StatusBadge status={employee.status} />
                        <span className="text-sm text-muted-foreground">{employee.employment_type}</span>
                    </div>
                 </div>
              </div>
              <Button variant="outline" size="sm" onClick={onEdit}>
                 <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
           </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 border-b">
                <TabsList className="bg-transparent h-12 w-full justify-start rounded-none p-0">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Overview</TabsTrigger>
                    <TabsTrigger value="employment" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4">Employment</TabsTrigger>
                </TabsList>
            </div>

            <div className="p-6">
                <TabsContent value="overview" className="mt-0 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Mail className="w-4 h-4"/> Contact Information</h3>
                            <div className="grid gap-2 text-sm">
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="col-span-2">{employee.email}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="col-span-2">{employee.phone || '-'}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="col-span-2">
                                        {employee.address}<br/>
                                        {employee.city} {employee.state}<br/>
                                        {employee.country} {employee.postal_code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4"/> Personal Details</h3>
                            <div className="grid gap-2 text-sm">
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">DOB:</span>
                                    <span className="col-span-2">{employee.dob || '-'}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Gender:</span>
                                    <span className="col-span-2">{employee.gender || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="employment" className="mt-0 space-y-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4"/> Job Details</h3>
                            <div className="grid gap-2 text-sm">
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Hire Date:</span>
                                    <span className="col-span-2">{employee.hire_date}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Department ID:</span>
                                    <span className="col-span-2">{employee.department_id || '-'}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Role ID:</span>
                                    <span className="col-span-2">{employee.role_id || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4"/> Compensation</h3>
                            <div className="grid gap-2 text-sm">
                                <div className="grid grid-cols-3">
                                    <span className="text-muted-foreground">Salary:</span>
                                    <span className="col-span-2">{employee.salary ? `${employee.currency || ''} ${employee.salary}` : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </div>
        </Tabs>

        <DialogFooter className="p-4 border-t bg-muted/10">
           <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetail;