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
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Project Directory</h2>
        <div className="space-y-4">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-2 p-4 bg-accent/10 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{project.name}</h3>
                <Badge variant="secondary" className="ml-2">
                  #{project.tag}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
