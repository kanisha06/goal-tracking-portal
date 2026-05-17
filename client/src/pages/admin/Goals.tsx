import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoalCard } from '@/components/GoalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, Unlock } from 'lucide-react';
import { Goal } from '@/types';

export default function AdminGoals() {
  const { allGoals, lockGoal, unlockGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const approvedGoals = allGoals.filter(g => g.status === 'approved');
  const lockedGoals = allGoals.filter(g => g.status === 'locked');

  const handleLockGoal = (goal: Goal) => {
    lockGoal(goal.id);
    toast.success(`Goal "${goal.title}" locked successfully`);
  };

  const handleUnlockGoal = (goal: Goal) => {
    unlockGoal(goal.id);
    toast.success(`Goal "${goal.title}" unlocked successfully`);
  };

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Goal Management</h1>
        <p className="text-muted-foreground mt-1">Lock or unlock approved goals</p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Locked goals</span> cannot be edited by employees or managers. Use this to finalize goals for a period.
        </p>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="approved">
            Approved ({approvedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Locked ({lockedGoals.length})
          </TabsTrigger>
        </TabsList>

        {/* Approved Goals */}
        <TabsContent value="approved" className="space-y-4">
          {approvedGoals.length > 0 ? (
            <div className="grid gap-4">
              {approvedGoals.map(goal => (
                <div key={goal.id} className="relative">
                  <GoalCard
                    goal={goal}
                    onClick={() => handleSelectGoal(goal)}
                  />
                  <div className="absolute top-5 right-5 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectGoal(goal)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleLockGoal(goal)}
                      className="gap-2 bg-slate-600 hover:bg-slate-700"
                    >
                      <Lock className="w-4 h-4" />
                      Lock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No approved goals to lock</p>
            </Card>
          )}
        </TabsContent>

        {/* Locked Goals */}
        <TabsContent value="locked" className="space-y-4">
          {lockedGoals.length > 0 ? (
            <div className="grid gap-4">
              {lockedGoals.map(goal => (
                <div key={goal.id} className="relative">
                  <GoalCard
                    goal={goal}
                    onClick={() => handleSelectGoal(goal)}
                  />
                  <div className="absolute top-5 right-5 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectGoal(goal)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUnlockGoal(goal)}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Unlock className="w-4 h-4" />
                      Unlock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No locked goals</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Goal Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedGoal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGoal.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedGoal.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-semibold text-foreground">{selectedGoal.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weightage</p>
                    <p className="font-semibold text-foreground">{selectedGoal.weightage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground capitalize">{selectedGoal.status}</p>
                  </div>
                </div>

                {/* Quarterly Updates */}
                {selectedGoal.quarterlyUpdates.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Quarterly Updates</h3>
                    <div className="space-y-3">
                      {selectedGoal.quarterlyUpdates.map(update => (
                        <div key={update.id} className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-foreground">
                            {update.quarter} {update.year} - {update.progressPercentage}%
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{update.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedGoal.comments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Comments</h3>
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
                  {selectedGoal.status === 'approved' ? (
                    <Button
                      onClick={() => {
                        handleLockGoal(selectedGoal);
                        setIsDetailOpen(false);
                      }}
                      className="gap-2 bg-slate-600 hover:bg-slate-700"
                    >
                      <Lock className="w-4 h-4" />
                      Lock Goal
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleUnlockGoal(selectedGoal);
                        setIsDetailOpen(false);
                      }}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Unlock className="w-4 h-4" />
                      Unlock Goal
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
