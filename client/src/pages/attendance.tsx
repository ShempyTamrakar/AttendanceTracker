import { useState } from 'react';
import { AttendanceTracker } from "@/components/attendance/AttendanceTracker";
import { Calendar } from "@/components/attendance/Calendar";
import { ProjectDirectory } from "@/components/attendance/ProjectDirectory";
import { TeamDirectory } from "@/components/attendance/TeamDirectory";
import { UrgentTasks } from "@/components/attendance/UrgentTasks";

type TabType = 'overview' | 'calendar' | 'board' | 'reports' | 'files' | 'all-logs';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-700">Project Management</h1>
          <p className="text-sm text-gray-500">Efficient resource allocation</p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'board', label: 'Board' },
              { id: 'reports', label: 'Reports' },
              { id: 'files', label: 'Files' },
              { id: 'all-logs', label: 'All Logs' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <AttendanceTracker />
            <ProjectDirectory />
          </div>

          {/* Middle Column */}
          <div>
            <Calendar />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <UrgentTasks />
            <TeamDirectory />
          </div>
        </div>
      </div>
    </div>
  );
}