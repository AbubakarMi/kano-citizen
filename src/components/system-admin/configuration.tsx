
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Configuration = () => (
     <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3"><Settings className="h-6 w-6" /> Platform Configuration</CardTitle>
            <CardDescription>Manage available sectors, M&E metrics, notification templates, and other platform-wide settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Idea & Voting Settings</h3>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="voting-threshold" className="flex flex-col gap-1">
                        <span>New Idea Grace Period (Hours)</span>
                        <span className="font-normal text-muted-foreground text-xs">Time before a new idea can be voted on.</span>
                    </Label>
                    <Input id="voting-threshold" type="number" defaultValue="24" className="w-24" />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="anonymous-ideas" className="flex flex-col gap-1">
                        <span>Maintenance Mode</span>
                         <span className="font-normal text-muted-foreground text-xs">Temporarily disable public access for maintenance.</span>
                    </Label>
                    <Switch id="anonymous-ideas" />
                </div>
            </div>
             <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Notification Templates</h3>
                <div className="space-y-2">
                    <Label htmlFor="welcome-email">Welcome Email Subject</Label>
                    <Input id="welcome-email" defaultValue="Welcome to Kano Citizens' Voice!" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="welcome-body">Welcome Email Body</Label>
                    <Textarea id="welcome-body" defaultValue="Thank you for joining the platform. Your voice matters. Start by submitting your first idea or voting on existing ones." />
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button>Save Configuration</Button>
        </CardFooter>
    </Card>
)
