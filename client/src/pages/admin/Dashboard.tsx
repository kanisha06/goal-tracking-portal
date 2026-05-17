import { useGoals } from '@/contexts/GoalsContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricsCard } from '@/components/MetricsCard';
import { calculateMetrics, getGoalsByStatus } from '@/lib/goalUtils';
import { BarChart3, Users, CheckCircle2, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const { allGoals } = useGoals();
  const [, setLocation] = useLocation();
  const metrics = calculateMetrics(allGoals);
  const lockedGoals = getGoalsByStatus(allGoals, 'locked');

  // Group goals by employee
  const goalsByEmployee = allGoals.reduce((acc, goal) => {
    if (!acc[goal.employeeId]) {
      acc[goal.employeeId] = {
        employeeName: goal.employeeName,
        goals: [],
      };
    }
    acc[goal.employeeId].goals.push(goal);
    return acc;
  }, {} as Record<string, { employeeName: string; goals: any[] }>);

  const employeeCount = Object.keys(goalsByEmployee).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System-wide goal management and monitoring</p>
        </div>
        <Button
          onClick={() => setLocation('/admin/goals')}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Lock className="w-4 h-4" />
          Manage Goals
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          icon={Users}
          label="Total Employees"
          value={employeeCount}
          color="blue"
        />
        <MetricsCard
          icon={BarChart3}
          label="Total Goals"
          value={metrics.totalGoals}
          color="slate"
        />
        <MetricsCard
          icon={CheckCircle2}
          label="Approved Goals"
          value={metrics.approvedGoals}
          color="emerald"
        />
        <MetricsCard
          icon={Lock}
          label="Locked Goals"
          value={lockedGoals.length}
          color="rose"
        />
      </div>

      {/* System Health */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
        <h2 className="text-lg font-semibold text-foreground mb-6">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Approval Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary">
                {metrics.totalGoals > 0
                  ? Math.round((metrics.approvedGoals / metrics.totalGoals) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">
                {metrics.approvedGoals}/{metrics.totalGoals} goals
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-amber-600">{metrics.pendingGoals}</p>
              <p className="text-sm text-muted-foreground">goals awaiting approval</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Average Progress</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-emerald-600">{metrics.averageProgress}%</p>
              <p className="text-sm text-muted-foreground">across all goals</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Goals Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Status */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Goals by Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Approved</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        metrics.totalGoals > 0
                          ? (metrics.approvedGoals / metrics.totalGoals) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12">
                  {metrics.approvedGoals}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${
                        metrics.totalGoals > 0
                          ? (metrics.pendingGoals / metrics.totalGoals) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12">
                  {metrics.pendingGoals}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rejected</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500"
                    style={{
                      width: `${
                        metrics.totalGoals > 0
                          ? (metrics.rejectedGoals / metrics.totalGoals) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12">
                  {metrics.rejectedGoals}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Locked</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500"
                    style={{
                      width: `${
                        metrics.totalGoals > 0
                          ? (lockedGoals.length / metrics.totalGoals) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12">
                  {lockedGoals.length}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Weightage Compliance */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Weightage Compliance</h3>
          <div className="space-y-3">
            {Object.entries(goalsByEmployee).map(([employeeId, { employeeName, goals }]) => {
              const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
              const isValid = totalWeightage === 100;

              return (
                <div key={employeeId} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate">{employeeName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isValid ? 'bg-emerald-500' : totalWeightage > 100 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(totalWeightage, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold w-10 text-right ${
                      isValid ? 'text-emerald-600' : totalWeightage > 100 ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {totalWeightage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={() => setLocation('/admin/goals')}
              variant="outline"
              className="w-full justify-start text-left"
            >
              <Lock className="w-4 h-4 mr-2" />
              Lock/Unlock Goals
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              disabled
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users (Coming Soon)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              disabled
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Reports (Coming Soon)
            </Button>
          </div>
        </Card>
      </div>

      {/* Employee Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Employee Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Employee</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Goals</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Approved</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Pending</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Weightage</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(goalsByEmployee).map(([employeeId, { employeeName, goals }]) => {
                const approved = goals.filter(g => g.status === 'approved').length;
                const pending = goals.filter(g => g.status === 'submitted').length;
                const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
                const isValid = totalWeightage === 100;

                return (
                  <tr key={employeeId} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 text-foreground">{employeeName}</td>
                    <td className="text-center py-3 px-4 text-foreground">{goals.length}</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-emerald-600 font-semibold">{approved}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-amber-600 font-semibold">{pending}</span>
                    </td>
                    <td className="text-center py-3 px-4 font-semibold text-foreground">
                      {totalWeightage}%
                    </td>
                    <td className="text-center py-3 px-4">
                      {isValid ? (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          Valid
                        </span>
                      ) : totalWeightage > 100 ? (
                        <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                          Exceeds
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          Incomplete
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
