import { useQuery } from "@tanstack/react-query";
import { AttendanceTracker } from "@/components/attendance/AttendanceTracker";
import { Calendar } from "@/components/attendance/Calendar";
import { ProjectDirectory } from "@/components/attendance/ProjectDirectory";
import { TeamDirectory } from "@/components/attendance/TeamDirectory";
import { User } from "@shared/schema";

export default function AttendancePage() {
  // For demo purposes, we'll use the first user
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  if (!users?.length) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-500">Efficient resource allocation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <AttendanceTracker user={users[0]} />
            <ProjectDirectory />
          </div>

          <div className="space-y-6">
            <Calendar />
          </div>

          <div className="space-y-6">
            <TeamDirectory />
          </div>
        </div>
      </div>
    </div>
  );
}
