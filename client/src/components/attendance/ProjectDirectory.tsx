import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export function ProjectDirectory() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Project Directory</h2>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </div>
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
              <Badge>{project.tag}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}