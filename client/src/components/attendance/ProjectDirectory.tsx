import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export function ProjectDirectory() {
  const projects = mockProjects;

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Project Directory</h2>
        <div className="space-y-3">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="shrink-0 capitalize bg-transparent text-gray-500 border border-gray-200 px-2 py-1 text-xs"
                >
                  #{project.tag}
                </Badge>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}