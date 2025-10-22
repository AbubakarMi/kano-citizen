
"use client";

import * as React from "react"
import { useState } from "react";
import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { FileClock, ListFilter, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LogLevel = "INFO" | "WARN" | "ERROR" | "AUDIT" | "SECURITY";

const logData: {
    id: number;
    timestamp: Date;
    level: LogLevel;
    user: string;
    message: string;
}[] = [
    { id: 1, timestamp: new Date("2024-05-21T10:00:15Z"), level: "INFO", user: "citizen@test.com", message: "User logged in successfully." },
    { id: 2, timestamp: new Date("2024-05-21T10:01:03Z"), level: "WARN", user: "system", message: "API endpoint /api/ideas returned in 350ms (above threshold)." },
    { id: 3, timestamp: new Date("2024-05-21T10:02:40Z"), level: "INFO", user: "citizen1@test.com", message: "New idea 'Community Cleanup Day' submitted." },
    { id: 4, timestamp: new Date("2024-05-21T10:05:22Z"), level: "ERROR", user: "system", message: "Failed to connect to Redis cache: Connection timed out." },
    { id: 5, timestamp: new Date("2024-05-21T10:08:00Z"), level: "AUDIT", user: "superadmin@test.com", message: "Changed role of 'moderator@test.com' to 'System Administrator'." },
    { id: 6, timestamp: new Date("2024-05-21T10:10:11Z"), level: "INFO", user: "citizen3@test.com", message: "Upvoted idea 'Youth Tech Training Program'." },
    { id: 7, timestamp: new Date("2024-05-21T10:12:54Z"), level: "SECURITY", user: "anonymous", message: "Failed login attempt for user 'unknown@user.com' from IP 192.168.1.10." },
    { id: 8, timestamp: new Date("2024-05-20T14:30:00Z"), level: "AUDIT", user: "superadmin@test.com", message: "Issued new directive 'Streetlight Repair Phase 2'." },
    { id: 9, timestamp: new Date("2024-05-20T15:00:00Z"), level: "INFO", user: "mda@test.com", message: "Updated status of directive 'Drainage Desilting' to Completed." },
    { id: 10, timestamp: new Date("2024-05-19T09:00:00Z"), level: "SECURITY", user: "sysadmin@test.com", message: "System maintenance mode enabled." },
];

const levelVariant: Record<LogLevel, "default" | "secondary" | "destructive" | "outline" > = {
    INFO: "default",
    WARN: "accent",
    ERROR: "destructive",
    AUDIT: "secondary",
    SECURITY: "destructive"
}


export const SystemLogs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [levels, setLevels] = useState<Set<LogLevel>>(new Set(["INFO", "WARN", "ERROR", "AUDIT", "SECURITY"]));
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 20),
        to: new Date(),
    })

    const toggleLevel = (level: LogLevel) => {
        setLevels(prev => {
            const newLevels = new Set(prev);
            if (newLevels.has(level)) {
                newLevels.delete(level);
            } else {
                newLevels.add(level);
            }
            return newLevels;
        });
    };

    const filteredLogs = logData.filter(log => {
        const isInDateRange = date?.from && date?.to ? log.timestamp >= date.from && log.timestamp <= date.to : true;
        const matchesLevel = levels.size === 0 || levels.has(log.level);
        const matchesSearch = searchTerm === "" || 
                              log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              log.user.toLowerCase().includes(searchTerm.toLowerCase());
        return isInDateRange && matchesLevel && matchesSearch;
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3"><FileClock className="h-6 w-6" /> System Logs</CardTitle>
                <CardDescription>Access detailed, searchable logs for security, auditing, and advanced debugging purposes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <Input 
                        placeholder="Search logs by message or user..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <div className="flex gap-2">
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    <ListFilter className="mr-2 h-4 w-4" />
                                    Filter Levels
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Log Level</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(["INFO", "WARN", "ERROR", "AUDIT", "SECURITY"] as LogLevel[]).map(level => (
                                     <DropdownMenuCheckboxItem
                                        key={level}
                                        checked={levels.has(level)}
                                        onCheckedChange={() => toggleLevel(level)}
                                    >
                                        {level}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Level</TableHead>
                                <TableHead className="w-[200px]">Timestamp</TableHead>
                                <TableHead className="w-[150px]">User</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Badge variant={levelVariant[log.level]}>{log.level}</Badge>
                                    </TableCell>
                                    <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.message}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {filteredLogs.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No logs found matching your criteria.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
