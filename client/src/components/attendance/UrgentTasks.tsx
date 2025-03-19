import { Card, CardContent } from "@/components/ui/card";

type Task = {
  id: number;
  title: string;
  status: 'today' | 'yesterday' | 'last_week';
};

const tasks: Task[] = [
  { id: 1, title: "Finish Monthly Reporting", status: "today" },
  { id: 2, title: "Report Signing", status: "yesterday" },
  { id: 3, title: "Report Signing", status: "yesterday" },
  { id: 4, title: "Finish Monthly Reporting", status: "last_week" },
];

export function UrgentTasks() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Urgent Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <span className="text-gray-700">{task.title}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                task.status === 'today' ? 'text-blue-500' :
                task.status === 'yesterday' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {task.status === 'today' ? 'Today' :
                 task.status === 'yesterday' ? 'Yesterday' :
                 'Last Week'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
