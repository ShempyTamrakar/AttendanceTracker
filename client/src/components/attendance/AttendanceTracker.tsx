import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { User } from "@shared/schema";

interface AttendanceTrackerProps {
  user: User;
}

export function AttendanceTracker({ user }: AttendanceTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const { data: currentAttendance, refetch } = useQuery({
    queryKey: ["/api/attendance/current", user.id],
    select: (data: any) => data as { checkIn: string } | null,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/attendance/check-in", {
        userId: user.id,
        checkIn: new Date(),
        notes,
      });
    },
    onSuccess: () => {
      refetch();
      setNotes("");
      toast({ title: "Checked in successfully" });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/attendance/check-out/${user.id}`, {});
    },
    onSuccess: () => {
      refetch();
      toast({ title: "Checked out successfully" });
    },
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      if (currentAttendance?.checkIn) {
        const checkInTime = new Date(currentAttendance.checkIn);
        const currentTime = new Date(event.data);
        const diff = currentTime.getTime() - checkInTime.getTime();

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    return () => socket.close();
  }, [currentAttendance]);

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center bg-white shadow-inner">
            <div className="text-4xl font-bold text-gray-900">{elapsedTime}</div>
            <div className="absolute -bottom-2 text-sm text-gray-500 bg-white px-2">Hrs</div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <Input
              placeholder="Add Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={currentAttendance !== null}
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />

            {currentAttendance ? (
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
              >
                Check Out
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
              >
                Check In
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}