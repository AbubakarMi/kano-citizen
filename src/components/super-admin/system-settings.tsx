
"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Vote } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function SystemSettings() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
          title: `Settings Saved`,
          description: `System-wide settings have been updated.`,
          className: "bg-primary text-primary-foreground border-primary"
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><Settings className="h-6 w-6" /> Platform Settings</CardTitle>
                <CardDescription>Configure system-wide parameters and voting rules for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2"><Vote className="h-5 w-5" /> Voting & Directives</h3>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="voting-threshold" className="flex flex-col gap-1">
                            <span>Directive Threshold</span>
                            <span className="font-normal text-muted-foreground text-xs">Minimum upvotes an idea needs to be eligible for a directive.</span>
                        </Label>
                        <Input id="voting-threshold" type="number" defaultValue="500" className="w-24" />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="anonymous-ideas" className="flex flex-col gap-1">
                            <span>Allow Anonymous Ideas</span>
                             <span className="font-normal text-muted-foreground text-xs">If disabled, all submitted ideas must be tied to a user profile.</span>
                        </Label>
                        <Switch id="anonymous-ideas" defaultChecked />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave}>Save Settings</Button>
            </CardFooter>
        </Card>
    );
}
