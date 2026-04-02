import React, { useState, useEffect } from 'react';
import QuickActionModal from './QuickActionModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useHRManagement } from '@/hooks/useHRManagement';
import { Loader2, Check, X as XIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ReviewLeavesQuickAction = ({ isOpen, onClose, onSuccess }) => {
  const { fetchLeaveRequests, approveLeaveRequest, rejectLeaveRequest, fetchEmployees, loading: hookLoading } = useHRManagement();
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Staged changes: { id: { status: 'approved' | 'rejected', reason: '' } }
  const [stagedChanges, setStagedChanges] = useState({});
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setStagedChanges({});
    }
  }, [isOpen]);

  const loadData = async () => {
    const reqs = await fetchLeaveRequests({ status: 'pending' });
    const emps = await fetchEmployees();
    setRequests(reqs || []);
    setEmployees(emps || []);
  };

  const getEmpName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
  };

  const handleStageApprove = (id) => {
    setStagedChanges(prev => ({ ...prev, [id]: { status: 'approved' } }));
  };

  const openRejectModal = (id) => {
    setCurrentRejectId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (currentRejectId) {
      setStagedChanges(prev => ({ ...prev, [currentRejectId]: { status: 'rejected', reason: rejectReason } }));
      setRejectModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const promises = Object.entries(stagedChanges).map(async ([id, change]) => {
      if (change.status === 'approved') {
        // Assuming current user is admin, pass admin ID if available in context, or simplified
        return approveLeaveRequest(id, null); 
      } else {
        return rejectLeaveRequest(id, change.reason);
      }
    });

    await Promise.all(promises);
    setSubmitting(false);
    onSuccess?.();
    onClose();
  };

  const getStatusDisplay = (id) => {
    if (stagedChanges[id]) {
        return stagedChanges[id].status === 'approved' 
            ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved (Pending)</Badge> 
            : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected (Pending)</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
  };

  return (
    <>
      <QuickActionModal
        title="Review Pending Leaves"
        isOpen={isOpen}
        onClose={onClose}
        size="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="max-h-[60vh] overflow-y-auto space-y-3 p-1">
            {requests.map(req => (
              <div key={req.id} className="border rounded-lg p-4 bg-card shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{getEmpName(req.employee_id)}</h4>
                    <div className="text-sm text-muted-foreground flex gap-2 mt-1">
                       <Badge variant="secondary">{req.leave_type}</Badge>
                       <span>{req.days} days ({req.start_date} to {req.end_date})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusDisplay(req.id)}
                    {!stagedChanges[req.id] && (
                        <>
                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStageApprove(req.id)}>
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => openRejectModal(req.id)}>
                                <XIcon className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    {stagedChanges[req.id] && (
                         <Button size="sm" variant="ghost" onClick={() => setStagedChanges(prev => { const n = {...prev}; delete n[req.id]; return n; })}>
                            Undo
                         </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-sm bg-muted/50 p-2 rounded text-muted-foreground">
                   Reason: {req.reason || 'No reason provided'}
                </div>
              </div>
            ))}
            {requests.length === 0 && !hookLoading && (
              <div className="text-center py-8 text-muted-foreground">No pending leave requests</div>
            )}
            {hookLoading && <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/50" /></div>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting || Object.keys(stagedChanges).length === 0}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes ({Object.keys(stagedChanges).length})
            </Button>
          </div>
        </div>
      </QuickActionModal>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
             <Label>Reason for rejection</Label>
             <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Please provide a reason..." />
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
             <Button variant="destructive" onClick={confirmReject}>Confirm Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewLeavesQuickAction;