

"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, ShieldQuestion, MoreVertical, Building, Shield, PlusCircle } from "lucide-react";
import { seededUsers, type User, type UserRole, type MDA } from "@/lib/data";
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
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


const createUserSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  role: z.enum(["MDA Official", "Moderator", "SPD Coordinator", "System Administrator", "Super Admin"]),
  mda: z.string().optional(),
  location: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
}).refine(data => {
    if (data.role === "MDA Official") {
        return !!data.mda;
    }
    return true;
}, {
    message: "MDA assignment is required for MDA Officials.",
    path: ["mda"],
});


// Filter out citizens and create a mutable list
const initialAdminUsers = seededUsers.filter(u => u.role !== "Citizen");

interface UserManagementProps {
    availableRoles: UserRole[];
    mdas: MDA[];
    setMdas: React.Dispatch<React.SetStateAction<MDA[]>>;
    roles: UserRole[];
    setRoles: React.Dispatch<React.SetStateAction<UserRole[]>>;
}

export function UserManagement({ availableRoles, mdas, setMdas, roles, setRoles }: UserManagementProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialAdminUsers);
    const [userToDelete, setUserToDelete] = useState<(typeof seededUsers)[0] | null>(null);
    const [userToEdit, setUserToEdit] = useState<(typeof seededUsers)[0] | null>(null);
    const [newRole, setNewRole] = useState<UserRole | "">("");

    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    
    const [newMdaName, setNewMdaName] = useState("");
    const [newRoleName, setNewRoleName] = useState("");

    const form = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "Password123",
            confirmPassword: "Password123",
            location: "",
        }
    });

    const selectedRole = form.watch("role");

    const handleDeleteClick = (user: (typeof seededUsers)[0]) => {
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

    const handleEditClick = (user: (typeof seededUsers)[0]) => {
        setUserToEdit(user);
        setNewRole(user.role);
    }

    const handleConfirmEdit = () => {
        if (!userToEdit || !newRole) return;
        setUsers(currentUsers => currentUsers.map(u => 
            u.email === userToEdit.email ? { ...u, role: newRole as UserRole } : u
        ));
        toast({
          title: `Role Updated`,
          description: `${userToEdit.name}'s role has been changed to ${newRole}.`,
        });
        setUserToEdit(null);
        setNewRole("");
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
    
    const handleCreateUser = (values: z.infer<typeof createUserSchema>) => {
        const newUser: User = {
            name: values.fullName,
            email: values.email,
            role: values.role as UserRole,
            mda: values.role === "MDA Official" ? values.mda : undefined,
            location: values.location,
            submittedIdeas: [],
            votedOnIdeas: [],
            followedDirectives: [],
            volunteeredFor: [],
        };
        setUsers(prev => [newUser, ...prev]);
        toast({
          title: `User Created`,
          description: `Account for ${values.fullName} has been created with the role ${values.role}.`,
        });

        // Reset form and close dialog
        form.reset();
        setIsCreateUserOpen(false);
    }


    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                 <CardHeader className="flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle>Manage Administrative Users</CardTitle>
                        <CardDescription>View, create, edit roles for, and remove all non-citizen users.</CardDescription>
                    </div>
                    <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New User</Button>
                        </DialogTrigger>
                         <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create a New User</DialogTitle>
                                <DialogDescription>
                                    Fill in the details below to create a new administrative user account.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Aisha Bello" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name@domain.com" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Nassarawa" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableRoles.map(role => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {selectedRole === 'MDA Official' && (
                                        <FormField
                                            control={form.control}
                                            name="mda"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Assign to MDA</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an MDA" />
                                                            </Trigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {mdas.map(mda => (
                                                                <SelectItem key={mda.id} value={mda.id}>{mda.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <DialogFooter className="pt-4">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Create User</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
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
                                    <TableCell><Badge variant="outline">{user.role}{user.role === 'MDA Official' && user.mda ? ` (${mdas.find(m => m.id === user.mda)?.name || ''})` : ''}</Badge></TableCell>
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

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>MDA Management</CardTitle>
                        <CardDescription>Add or remove Ministries, Departments, and Agencies (MDAs).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {mdas.map(mda => (
                            <div key={mda.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                                <span className="text-sm font-medium">{mda.name}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteMda(mda.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-2">
                        <Input 
                            placeholder="Enter new MDA name..." 
                            value={newMdaName} 
                            onChange={(e) => setNewMdaName(e.target.value)}
                        />
                        <Button onClick={handleAddMda}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                    </CardFooter>
                </Card>
                <Card className="shadow-sm">
                     <CardHeader>
                        <CardTitle>Role Management</CardTitle>
                        <CardDescription>Define administrative roles on the platform.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex flex-wrap gap-2">
                        {roles.filter(r => r !== 'Citizen').map(role => (
                           <Badge key={role} variant="secondary">{role}</Badge>
                        ))}
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-2">
                        <Input 
                            placeholder="Enter new role name..." 
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />
                        <Button onClick={handleAddRole}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                    </CardFooter>
                </Card>
            </div>

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
        </div>
    );
}

      
