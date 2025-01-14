import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Approver = {
  id: string;
  name: string;
  avatar: string;
  role: string;
};

const approvers: Approver[] = [
  { id: "1", name: "John Doe", avatar: "", role: "Content Manager" },
  { id: "2", name: "Jane Smith", avatar: "", role: "Social Media Manager" },
  { id: "3", name: "Mike Johnson", avatar: "", role: "Marketing Director" },
];

export const PostScheduler = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [platform, setPlatform] = useState("twitter");
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date || !time || !platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post Scheduled",
      description: `Your post has been scheduled and sent for approval to ${selectedApprovers.length} approver(s).`,
    });
  };

  const toggleApprover = (approverId: string) => {
    setSelectedApprovers(prev =>
      prev.includes(approverId)
        ? prev.filter(id => id !== approverId)
        : [...prev, approverId]
    );
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Schedule Post</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 rounded-md border p-2"
            />
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Select Approvers ({selectedApprovers.length})
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Approvers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {approvers.map((approver) => (
                <div
                  key={approver.id}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedApprovers.includes(approver.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleApprover(approver.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={approver.avatar} />
                      <AvatarFallback>{approver.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{approver.name}</p>
                      <p className="text-sm text-gray-500">{approver.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleSchedule} className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>
    </Card>
  );
};