import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GoalCard } from '@/components/GoalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, Send } from 'lucide-react';
import { calculateTotalWeightage, canAddGoal, getRemainingWeightage } from '@/lib/goalUtils';
import { Goal } from '@/types';
import { nanoid } from 'nanoid';

export default function EmployeeGoals() {
  const { goals, addGoal, updateGoal, deleteGoal, submitGoal } = useGoals();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weightage: 10,
  });

  const totalWeightage = calculateTotalWeightage(goals);
  const remainingWeightage = getRemainingWeightage(goals);
  const draftGoals = goals.filter(g => g.status === 'draft');
  const submittedGoals = goals.filter(g => g.status === 'submitted' || g.status === 'approved' || g.status === 'rejected');

  const handleAddGoal = () => {
    const validation = canAddGoal(goals, formData.weightage);
    
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Goal description is required');
      return;
    }

    const newGoal: Goal = {
      id: nanoid(),
      employeeId: 'user-1',
      employeeName: 'Sarah Johnson',
      title: formData.title,
      description: formData.description,
      weightage: formData.weightage,
      status: 'draft',
      createdAt: new Date(),
      comments: [],
      quarterlyUpdates: [],
    };

    addGoal(newGoal);
    setFormData({ title: '', description: '', weightage: 10 });
    setIsOpen(false);
    toast.success('Goal created successfully');
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    toast.success('Goal deleted');
  };

  const handleSubmitGoal = (goalId: string) => {
    submitGoal(goalId);
    toast.success('Goal submitted for approval');
  };

  const handleEditGoal = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      weightage: goal.weightage,
    });
    setSelectedGoal(goal);
    setIsOpen(true);
  };

  const handleUpdateGoal = () => {
    if (!selectedGoal) return;

    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Goal description is required');
      return;
    }

    const weightageDifference = formData.weightage - selectedGoal.weightage;
    const otherGoalsWeightage = totalWeightage - selectedGoal.weightage;

    if (otherGoalsWeightage + formData.weightage > 100) {
      toast.error('Total weightage would exceed 100%');
      return;
    }

    if (formData.weightage < 10) {
      toast.error('Minimum weightage is 10%');
      return;
    }

    const updated: Goal = {
      ...selectedGoal,
      title: formData.title,
      description: formData.description,
      weightage: formData.weightage,
    };

    updateGoal(updated);
    setFormData({ title: '', description: '', weightage: 10 });
    setSelectedGoal(null);
    setIsOpen(false);
    toast.success('Goal updated successfully');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Goals</h1>
          <p className="text-muted-foreground mt-1">Create and manage your annual goals</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedGoal(null);
                setFormData({ title: '', description: '', weightage: 10 });
              }}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Implement new API authentication"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to achieve..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weightage">Weightage (%)</Label>
                  <span className="text-2xl font-bold text-primary">{formData.weightage}%</span>
                </div>
                <Slider
                  id="weightage"
                  min={10}
                  max={selectedGoal ? totalWeightage - (totalWeightage - selectedGoal.weightage) + 90 : remainingWeightage}
                  step={5}
                  value={[formData.weightage]}
                  onValueChange={(value) => setFormData({ ...formData, weightage: value[0] })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: 10%</span>
                  <span>Available: {selectedGoal ? totalWeightage - (totalWeightage - selectedGoal.weightage) + 90 : remainingWeightage}%</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Current Status:</p>
                <div className="space-y-1 text-sm">
                  <p>Total Goals: <span className="font-semibold">{goals.length}/8</span></p>
                  <p>Total Weightage: <span className="font-semibold">{totalWeightage}%</span></p>
                  <p>Remaining: <span className="font-semibold">{selectedGoal ? totalWeightage - (totalWeightage - selectedGoal.weightage) + 90 : remainingWeightage}%</span></p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={selectedGoal ? handleUpdateGoal : handleAddGoal}
                  className="bg-primary hover:bg-primary/90"
                >
                  {selectedGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weightage Status */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Goal Weightage Status</h3>
            <p className="text-sm text-muted-foreground">Total must equal 100%</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{totalWeightage}%</p>
            {totalWeightage === 100 ? (
              <p className="text-xs text-emerald-600 font-medium">✓ Valid - Ready to submit</p>
            ) : (
              <p className="text-xs text-amber-600 font-medium">
                {totalWeightage < 100 ? `${100 - totalWeightage}% remaining` : 'Exceeds 100%'}
              </p>
            )}
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              totalWeightage === 100
                ? 'bg-emerald-500'
                : totalWeightage > 100
                ? 'bg-rose-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(totalWeightage, 100)}%` }}
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="draft" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draft">
            Draft ({draftGoals.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted & Approved ({submittedGoals.length})
          </TabsTrigger>
        </TabsList>

        {/* Draft Goals */}
        <TabsContent value="draft" className="space-y-4">
          {draftGoals.length > 0 ? (
            <div className="grid gap-4">
              {draftGoals.map(goal => (
                <div key={goal.id} className="relative">
                  <GoalCard goal={goal} showProgress={false} />
                  <div className="absolute top-5 right-5 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditGoal(goal)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSubmitGoal(goal.id)}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="w-4 h-4" />
                      Submit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No draft goals yet. Create one to get started!</p>
            </Card>
          )}
        </TabsContent>

        {/* Submitted Goals */}
        <TabsContent value="submitted" className="space-y-4">
          {submittedGoals.length > 0 ? (
            <div className="grid gap-4">
              {submittedGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsDetailOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No submitted goals yet</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Weightage</p>
                    <p className="text-2xl font-bold text-foreground">{selectedGoal.weightage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold text-foreground capitalize">{selectedGoal.status}</p>
                  </div>
                </div>

                {selectedGoal.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-rose-900 mb-1">Rejection Reason</p>
                    <p className="text-sm text-rose-800">{selectedGoal.rejectionReason}</p>
                  </div>
                )}

                {selectedGoal.comments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Comments</h3>
                    <div className="space-y-3">
                      {selectedGoal.comments.map(comment => (
                        <div key={comment.id} className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-foreground">{comment.managerName}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-foreground">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
