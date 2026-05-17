import React from 'react';
import { Goal } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  getStatusColor,
  getStatusIcon,
  formatDate,
  getAverageProgress,
} from '@/lib/goalUtils';
import * as LucideIcons from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  showProgress?: boolean;
}

export function GoalCard({ goal, onClick, showProgress = true }: GoalCardProps) {
  const averageProgress = getAverageProgress(goal);
  const statusIcon = getStatusIcon(goal.status);
  const IconComponent = (LucideIcons as any)[statusIcon];

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-5 hover:shadow-md transition-shadow cursor-pointer',
        onClick && 'hover:border-primary'
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{goal.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {goal.description}
            </p>
          </div>
          <Badge className={cn('shrink-0', getStatusColor(goal.status))}>
            <IconComponent className="w-3 h-3 mr-1" />
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </Badge>
        </div>

        {/* Weightage */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Weightage</span>
          <span className="font-semibold text-foreground">{goal.weightage}%</span>
        </div>

        {/* Progress Bar */}
        {showProgress && goal.quarterlyUpdates.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average Progress</span>
              <span className="font-semibold text-foreground">{averageProgress}%</span>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>{goal.comments.length} comments</span>
          <span>{goal.quarterlyUpdates.length} updates</span>
          {goal.submittedAt && <span>Submitted {formatDate(goal.submittedAt)}</span>}
        </div>
      </div>
    </Card>
  );
}
