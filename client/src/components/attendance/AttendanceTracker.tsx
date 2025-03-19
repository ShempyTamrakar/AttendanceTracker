import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CheckInRecord = {
  startTime: Date;
  notes: string;
};

export function AttendanceTracker() {
  const [currentRecord, setCurrentRecord] = useState<CheckInRecord | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const updateElapsedTime = useCallback(() => {
    if (!currentRecord) {
      setElapsedTime("00:00:00");
      return;
    }

    const now = new Date();
    const diff = now.getTime() - currentRecord.startTime.getTime();

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setElapsedTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  }, [currentRecord]);

  useEffect(() => {
    const timer = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(timer);
  }, [updateElapsedTime]);

  const handleCheckIn = () => {
    setCurrentRecord({
      startTime: new Date(),
      notes,
    });
    setNotes("");
    toast({ title: "Checked in successfully" });
  };

  const handleCheckOut = () => {
    setCurrentRecord(null);
    toast({ title: "Checked out successfully" });
  };

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
              disabled={currentRecord !== null}
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />

            {currentRecord ? (
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleCheckOut}
              >
                Check Out
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleCheckIn}
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