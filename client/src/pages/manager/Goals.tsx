import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoalCard } from '@/components/GoalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { Goal, Comment } from '@/types';
import { nanoid } from 'nanoid';

export default function ManagerGoals() {
  const { allGoals, addComment } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const approvedGoals = allGoals.filter(g => g.status === 'approved');
  const submittedGoals = allGoals.filter(g => g.status === 'submitted');
  const rejectedGoals = allGoals.filter(g => g.status === 'rejected');

  const handleAddComment = () => {
    if (!selectedGoal || !commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const comment: Comment = {
      id: nanoid(),
      managerId: 'user-2',
      managerName: 'Michael Chen',
      text: commentText,
      createdAt: new Date(),
    };

    addComment(selectedGoal.id, comment);
    setCommentText('');
    toast.success('Comment added successfully');
  };

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Goals</h1>
        <p className="text-muted-foreground mt-1">Review and comment on team member goals</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submitted">
            Submitted ({submittedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedGoals.length})
          </TabsTrigger>
        </TabsList>

        {/* Submitted Goals */}
        <TabsContent value="submitted" className="space-y-4">
          {submittedGoals.length > 0 ? (
            <div className="grid gap-4">
              {submittedGoals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className="cursor-pointer"
                >
                  <GoalCard goal={goal} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No goals pending approval</p>
            </Card>
          )}
        </TabsContent>

        {/* Approved Goals */}
        <TabsContent value="approved" className="space-y-4">
          {approvedGoals.length > 0 ? (
            <div className="grid gap-4">
              {approvedGoals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className="cursor-pointer"
                >
                  <GoalCard goal={goal} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No approved goals</p>
            </Card>
          )}
        </TabsContent>

        {/* Rejected Goals */}
        <TabsContent value="rejected" className="space-y-4">
          {rejectedGoals.length > 0 ? (
            <div className="grid gap-4">
              {rejectedGoals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className="cursor-pointer"
                >
                  <GoalCard goal={goal} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No rejected goals</p>
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
                {/* Goal Info */}
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

                {selectedGoal.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-rose-900 mb-1">Rejection Reason</p>
                    <p className="text-sm text-rose-800">{selectedGoal.rejectionReason}</p>
                  </div>
                )}

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

                {/* Comments Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments ({selectedGoal.comments.length})
                  </h3>

                  {/* Existing Comments */}
                  {selectedGoal.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {selectedGoal.comments.map(comment => (
                        <div key={comment.id} className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">{comment.managerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm text-foreground">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Form */}
                  <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <Label htmlFor="comment" className="text-sm">Add a Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your feedback or suggestions..."
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleAddComment}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
