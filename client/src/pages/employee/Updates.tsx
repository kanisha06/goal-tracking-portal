import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { toast } from 'sonner';
import { Plus, TrendingUp } from 'lucide-react';
import { QuarterlyUpdate } from '@/types';
import { nanoid } from 'nanoid';

export default function EmployeeUpdates() {
  const { goals, addQuarterlyUpdate } = useGoals();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [notes, setNotes] = useState('');

  const approvedGoals = goals.filter(g => g.status === 'approved');

  const handleAddUpdate = () => {
    if (!selectedGoalId) {
      toast.error('Please select a goal');
      return;
    }

    if (!notes.trim()) {
      toast.error('Progress notes are required');
      return;
    }

    const update: QuarterlyUpdate = {
      id: nanoid(),
      quarter,
      year,
      progressPercentage,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addQuarterlyUpdate(selectedGoalId, update);
    
    // Reset form
    setSelectedGoalId('');
    setQuarter('Q1');
    setYear(new Date().getFullYear());
    setProgressPercentage(0);
    setNotes('');
    setIsOpen(false);
    
    toast.success('Quarterly update added successfully');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress Updates</h1>
          <p className="text-muted-foreground mt-1">Track quarterly progress on your goals</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Quarterly Progress Update</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Select Goal *</Label>
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Choose a goal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedGoals.map(goal => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quarter">Quarter *</Label>
                  <Select value={quarter} onValueChange={(value: any) => setQuarter(value)}>
                    <SelectTrigger id="quarter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1</SelectItem>
                      <SelectItem value="Q2">Q2</SelectItem>
                      <SelectItem value="Q3">Q3</SelectItem>
                      <SelectItem value="Q4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
                </div>
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={5}
                  value={[progressPercentage]}
                  onValueChange={(value) => setProgressPercentage(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Progress Notes *</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe what you've accomplished and any challenges..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUpdate}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals with Updates */}
      <div className="space-y-6">
        {approvedGoals.length > 0 ? (
          approvedGoals.map(goal => (
            <Card key={goal.id} className="p-6">
              <div className="space-y-6">
                {/* Goal Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Weightage</p>
                    <p className="text-2xl font-bold text-primary">{goal.weightage}%</p>
                  </div>
                </div>

                {/* Updates Timeline */}
                {goal.quarterlyUpdates.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground text-sm">Quarterly Updates</h4>
                    <div className="space-y-3">
                      {goal.quarterlyUpdates.map((update, index) => (
                        <div key={update.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0">
                          <div className="flex-shrink-0">
                            <ProgressIndicator
                              value={update.progressPercentage}
                              size="sm"
                              color="blue"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-foreground">
                                {update.quarter} {update.year}
                              </h5>
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{update.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No updates yet. Add one to track progress.</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No approved goals yet. Approve goals first to add progress updates.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
