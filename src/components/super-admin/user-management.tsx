
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, ShieldQuestion, MoreVertical } from "lucide-react";
import { seededUsers, type User, type UserRole } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Filter out citizens and create a mutable list
const initialAdminUsers = seededUsers.filter(u => u.role !== "Citizen");

interface UserManagementProps {
    availableRoles: UserRole[];
}

export function UserManagement({ availableRoles }: UserManagementProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialAdminUsers);
    const [userToDelete, setUserToDelete] = useState<typeof seededUsers[0] | null>(null);
    const [userToEdit, setUserToEdit] = useState<typeof seededUsers[0] | null>(null);
    const [newRole, setNewRole] = useState<UserRole | "">("");

    const handleDeleteClick = (user: typeof seededUsers[0]) => {
        setUserToDelete(user);
    }

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        setUsers(currentUsers => currentUsers.filter(u => u.email !== userToDelete.email));
        toast({
          title: `User Deleted`,
          description: `User ${userToDelete.name} has been removed from the system.`,
          variant: "destructive"
        });
        setUserToDelete(null);
    }

    const handleEditClick = (user: typeof seededUsers[0]) => {
        setUserToEdit(user);
        setNewRole(user.role);
    }

    const handleConfirmEdit = () => {
        if (!userToEdit || !newRole) return;
        setUsers(currentUsers => currentUsers.map(u => 
            u.email === userToEdit.email ? { ...u, role: newRole } : u
        ));
        toast({
          title: `Role Updated`,
          description: `${userToEdit.name}'s role has been changed to ${newRole}.`,
        });
        setUserToEdit(null);
        setNewRole("");
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3"><Users className="h-6 w-6" /> Manage Administrative Users</CardTitle>
                    <CardDescription>View, edit roles for, and remove all non-citizen users on the platform.</CardDescription>
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
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Edit Role</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteClick(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete User</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                       Showing {users.length} administrative users.
                    </div>
                </CardFooter>
            </Card>

             {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user account
                        for <span className="font-semibold">{userToDelete?.name}</span> and remove their data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {/* Edit Role Dialog */}
            <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShieldQuestion /> Change User Role</DialogTitle>
                    <DialogDescription>
                        Update the role for <span className="font-semibold">{userToEdit?.name}</span>.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select value={newRole || ''} onValueChange={(value) => setNewRole(value as UserRole)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRoles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUserToEdit(null)}>Cancel</Button>
                        <Button type="submit" onClick={handleConfirmEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
