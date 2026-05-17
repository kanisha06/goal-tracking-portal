import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, Users, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation(`/${user.role}`);
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">GoalTracker</h1>
            </div>
            <p className="text-slate-600">Employee Goal Management System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Streamline Your Goal Management
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              A modern platform for setting, tracking, and achieving organizational goals with role-based workflows.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Employee Goals</h3>
              <p className="text-slate-600 text-sm">
                Create, edit, and track your goals with quarterly progress updates.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Manager Approval</h3>
              <p className="text-slate-600 text-sm">
                Review, approve, or provide feedback on team member goals.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Admin Dashboard</h3>
              <p className="text-slate-600 text-sm">
                Monitor organization-wide goals and manage system settings.
              </p>
            </Card>
          </div>

          {/* Key Features */}
          <Card className="p-8 mb-16 bg-white border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Weighted Goals</h4>
                    <p className="text-sm text-slate-600">Total weightage must equal 100% (10-100% per goal)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Goal Limits</h4>
                    <p className="text-sm text-slate-600">Maximum 8 goals per employee per cycle</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Progress Tracking</h4>
                    <p className="text-sm text-slate-600">Quarterly updates with detailed progress notes</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Approval Workflow</h4>
                    <p className="text-sm text-slate-600">Manager review with comments and feedback</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Admin Controls</h4>
                    <p className="text-sm text-slate-600">Lock/unlock goals and view system metrics</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Responsive Design</h4>
                    <p className="text-sm text-slate-600">Works seamlessly on desktop and mobile devices</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              The app is pre-loaded with demo data. Switch between roles using the sidebar to explore different features.
            </p>
            <Button
              size="lg"
              onClick={() => setLocation('/employee')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
