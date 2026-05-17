import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Goal } from '@/types';

export default function ManagerApprovals() {
  const { allGoals, approveGoal, rejectGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);

  const submittedGoals = allGoals.filter(g => g.status === 'submitted');

  const handleApprove = (goal: Goal) => {
    approveGoal(goal.id);
    toast.success(`Goal "${goal.title}" approved successfully`);
    setIsDetailOpen(false);
    setSelectedGoal(null);
  };

  const handleRejectClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsRejectMode(true);
    setIsDetailOpen(true);
  };

  const handleReject = () => {
    if (!selectedGoal) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    rejectGoal(selectedGoal.id, rejectionReason);
    toast.success(`Goal "${selectedGoal.title}" rejected`);
    setRejectionReason('');
    setIsDetailOpen(false);
    setSelectedGoal(null);
    setIsRejectMode(false);
  };

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsRejectMode(false);
    setRejectionReason('');
    setIsDetailOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Goal Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve pending goals</p>
      </div>

      {/* Pending Goals Count */}
      {submittedGoals.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                {submittedGoals.length} goal{submittedGoals.length !== 1 ? 's' : ''} pending approval
              </p>
              <p className="text-sm text-amber-800">Review and approve or reject each goal</p>
            </div>
          </div>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {submittedGoals.length > 0 ? (
          submittedGoals.map(goal => (
            <Card key={goal.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{goal.employeeName}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Weightage: <span className="font-semibold text-foreground">{goal.weightage}%</span>
                    </span>
                    {goal.comments.length > 0 && (
                      <span className="text-muted-foreground">
                        {goal.comments.length} comment{goal.comments.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => handleSelectGoal(goal)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Review
                  </Button>
                  <Button
                    onClick={() => handleApprove(goal)}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectClick(goal)}
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No pending approvals. All goals are reviewed!</p>
          </Card>
        )}
      </div>

      {/* Goal Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedGoal && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isRejectMode ? 'Reject Goal' : 'Review Goal'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {!isRejectMode ? (
                  <>
                    {/* Goal Details */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Goal Title</h3>
                      <p className="text-lg text-foreground">{selectedGoal.title}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedGoal.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Employee</p>
                        <p className="font-semibold text-foreground">{selectedGoal.employeeName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weightage</p>
                        <p className="font-semibold text-foreground">{selectedGoal.weightage}%</p>
                      </div>
                    </div>

                    {/* Comments */}
                    {selectedGoal.comments.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Previous Comments</h3>
                        <div className="space-y-3">
                          {selectedGoal.comments.map(comment => (
                            <div key={comment.id} className="bg-slate-50 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-foreground">{comment.managerName}</p>
                              <p className="text-xs text-muted-foreground mb-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-foreground">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                      <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                        Close
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectClick(selectedGoal)}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedGoal)}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Rejection Form */}
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-rose-900 mb-1">Rejecting Goal</p>
                      <p className="text-sm text-rose-800">{selectedGoal.title}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Rejection Reason *</Label>
                      <Textarea
                        id="reason"
                        placeholder="Explain why this goal is being rejected. This will be visible to the employee."
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRejectMode(false);
                          setRejectionReason('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Confirm Rejection
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
