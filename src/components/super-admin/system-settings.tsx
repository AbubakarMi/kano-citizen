
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Vote, Building, Trash2, Shield, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { MDA, UserRole } from "@/lib/data";
import { seededUsers } from "@/lib/data";
import { Badge } from "../ui/badge";

interface SystemSettingsProps {
    mdas: MDA[];
    setMdas: React.Dispatch<React.SetStateAction<MDA[]>>;
}

const initialRoles: UserRole[] = [...new Set(seededUsers.map(u => u.role))];


export function SystemSettings({ mdas, setMdas }: SystemSettingsProps) {
    const { toast } = useToast();
    const [newMdaName, setNewMdaName] = useState("");
    const [newRoleName, setNewRoleName] = useState("");
    const [roles, setRoles] = useState<UserRole[]>(initialRoles);

    const handleSave = () => {
        toast({
          title: `Settings Saved`,
          description: `System-wide settings have been updated.`,
          className: "bg-primary text-primary-foreground border-primary"
        });
    }

    const handleAddMda = () => {
        if (!newMdaName.trim()) {
            toast({ variant: "destructive", title: "Invalid Name", description: "MDA name cannot be empty." });
            return;
        }
        const newMda: MDA = {
            id: `mda-${newMdaName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
            name: newMdaName.trim(),
        };
        setMdas(prev => [...prev, newMda]);
        setNewMdaName("");
        toast({ title: "MDA Added", description: `${newMda.name} has been added.` });
    }

    const handleDeleteMda = (mdaId: string) => {
        setMdas(prev => prev.filter(mda => mda.id !== mdaId));
        toast({ title: "MDA Removed", description: "The selected MDA has been removed." });
    }
    
    const handleAddRole = () => {
        if (!newRoleName.trim()) {
            toast({ variant: "destructive", title: "Invalid Name", description: "Role name cannot be empty." });
            return;
        }
        // This is a simulation. In a real app, UserRole would likely be a more flexible string.
        setRoles(prev => [...prev, newRoleName.trim() as UserRole]);
        setNewRoleName("");
        toast({ title: "Role Added", description: `${newRoleName.trim()} has been added.` });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><Settings className="h-6 w-6" /> Platform Settings</CardTitle>
                <CardDescription>Configure system-wide parameters, MDAs, and roles for the platform.</CardDescription>
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

                 <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2"><Building className="h-5 w-5" /> MDA Management</h3>
                    <div className="space-y-2">
                        {mdas.map(mda => (
                            <div key={mda.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                                <span className="text-sm font-medium">{mda.name}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteMda(mda.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Input 
                            placeholder="Enter new MDA name..." 
                            value={newMdaName} 
                            onChange={(e) => setNewMdaName(e.target.value)}
                        />
                        <Button onClick={handleAddMda}><PlusCircle className="mr-2" /> Add MDA</Button>
                    </div>
                 </div>

                 <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2"><Shield className="h-5 w-5" /> Role Management</h3>
                     <div className="flex flex-wrap gap-2">
                        {roles.map(role => (
                           <Badge key={role} variant="outline">{role}</Badge>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Input 
                            placeholder="Enter new role name..." 
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />
                        <Button onClick={handleAddRole}><PlusCircle className="mr-2" /> Add Role</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Note: Adding roles is for demonstration. Role permissions require code-level changes.</p>
                 </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave}>Save All Settings</Button>
            </CardFooter>
        </Card>
    );
}
