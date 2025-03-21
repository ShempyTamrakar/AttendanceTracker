
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

type AttendanceRecord = {
  id: number;
  startTime: Date;
  endTime?: Date;
  notes: string;
};

export function AttendanceTracker() {
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("attendanceHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((record: any) => ({
        ...record,
        startTime: new Date(record.startTime),
        endTime: record.endTime ? new Date(record.endTime) : undefined,
      }));
      setAttendanceHistory(parsedHistory);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));
  }, [attendanceHistory]);

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
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  }, [currentRecord]);

  useEffect(() => {
    const timer = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(timer);
  }, [updateElapsedTime]);

  const handleCheckIn = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now(),
      startTime: new Date(),
      notes: notes, // Save the current notes
    };
    setCurrentRecord(newRecord);
    toast({ title: "Checked in successfully" });
  };

  const handleCheckOut = () => {
    if (currentRecord) {
      const completedRecord = {
        ...currentRecord,
        endTime: new Date(),
      };
      setAttendanceHistory((prev) => [completedRecord, ...prev]);
      setCurrentRecord(null);
      setNotes(""); // Only clear notes after saving to history
      toast({ title: "Checked out successfully" });
    }
  };

  const today = new Date();
  const formattedDate = format(today, "d");
  const formattedMonth = format(today, "MMM");
  const formattedYear = format(today, "yyyy");

  return (
    <div className="space-y-6">
      {/* Attendance Clock */}
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            {/* Clock UI */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
              <div
                className="absolute inset-[12px] rounded-full bg-white shadow-inner flex flex-col items-center justify-center"
                style={{ padding: "10px" }}
              >
                <div className="text-4xl font-bold text-gray-900" style={{ fontSize: "25px" }}>
                  {elapsedTime} Hrs
                </div>
                {/* <span className="text-sm font-medium text-gray-600">Hrs</span> */}
                <div className="text-sm text-gray-500 mt-1">
                  {formattedDate} {formattedMonth} {formattedYear}
                </div>
              </div>
            </div>

            {/* Input and Check-in/Check-out Buttons */}
            <div className="w-full max-w-sm space-y-4">
              <div className="relative">
                <Input
                  placeholder="Add Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={currentRecord !== null}
                  className="pl-4 pr-4 py-2 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-sm"
                />
              </div>

              {currentRecord ? (
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5"
                  onClick={handleCheckOut}
                >
                  Check Out
                </Button>
              ) : (
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5"
                  onClick={handleCheckIn}
                >
                  Check In
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      {attendanceHistory.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Attendance History</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {attendanceHistory.map((record) => (
                  <div key={record.id} className="border-b border-gray-100 pb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {record.startTime.toLocaleTimeString()} - {record.endTime?.toLocaleTimeString()}
                      </span>
                      <span className="text-gray-500">
                        {record.startTime.toLocaleDateString()}
                      </span>
                    </div>
                    {record.notes && <p className="text-sm text-gray-600 mt-1">{record.notes}</p>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
