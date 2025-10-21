
"use client";

import { useState } from "react";
import type { User } from "@/lib/data";
import { seededUsers } from "@/lib/data";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";


const allUsers: (User & {status: "Active" | "Suspended"})[] = seededUsers.map((u, i) => ({
    ...u,
    name: u.name,
    email: u.email,
    submittedIdeas: [],
    votedOnIdeas: [],
    followedDirectives: [],
    volunteeredFor: [],
    status: i % 4 === 0 ? "Suspended" : "Active"
}));
// Add more diverse citizens
allUsers.push({ name: "Aisha Bello", email: "citizen1@test.com", role: "Citizen", status: "Active", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });
allUsers.push({ name: "Musa Ibrahim", email: "citizen2@test.com", role: "Citizen", status: "Suspended", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });
allUsers.push({ name: "Fatima Sani", email: "citizen3@test.com", role: "Citizen", status: "Active", submittedIdeas:[], votedOnIdeas:[], followedDirectives:[], volunteeredFor:[] });

export const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><Users className="h-6 w-6" /> User Management</CardTitle>
                <CardDescription>View, edit, suspend, or delete any user account.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell><Badge variant={user.role === 'Citizen' ? 'outline' : 'secondary'}>{user.role}</Badge></TableCell>
                                <TableCell><Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Suspend</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
