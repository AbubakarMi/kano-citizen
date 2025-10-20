
"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2 } from "lucide-react";
import { seededUsers, type UserRole } from "@/lib/data";

const users = [
    ...seededUsers,
    { name: "Aisha Bello", email: "aisha.b@example.com", role: "Citizen" as UserRole},
    { name: "Musa Ibrahim", email: "musa.i@example.com", role: "Citizen" as UserRole},
    { name: "Fatima Sani", email: "fatima.s@example.com", role: "Citizen" as UserRole},
];

export function UserManagement() {
    const { toast } = useToast();

    const handleAction = (action: string, userName: string) => {
        toast({
          title: `Action: ${action}`,
          description: `Action on user ${userName} was clicked.`,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><Users className="h-6 w-6" /> Manage Users & Roles</CardTitle>
                <CardDescription>View, edit, and assign roles to all users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.email}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                <TableCell className="text-right space-x-2">
                                     <Button variant="ghost" size="icon" onClick={() => handleAction('Edit', user.name)}>
                                        <Edit className="h-4 w-4" />
                                     </Button>
                                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleAction('Delete', user.name)}>
                                        <Trash2 className="h-4 w-4" />
                                     </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
