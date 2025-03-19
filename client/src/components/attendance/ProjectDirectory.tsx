import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Project } from "@shared/schema";

export function ProjectDirectory() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Directory</h2>
        <div className="space-y-3">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg bg-gray-50/80 hover:bg-gray-50/90 transition-colors"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <Badge variant="outline" className="capitalize bg-transparent text-gray-500 border-gray-200">
                  #{project.tag}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}