
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, CheckCircle, FolderClock } from "lucide-react"

export function HeroDashboard() {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-card/60 backdrop-blur-xl border rounded-xl shadow-2xl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground">Kano Progress Dashboard</h2>
        <p className="text-sm text-muted-foreground">A snapshot of citizen engagement & government action.</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-3">
            <Card className="h-full bg-background/70">
              <CardHeader>
                <CardTitle className="text-lg">Top Community Idea</CardTitle>
                <CardDescription>Waste-to-Wealth Recycling Project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  A comprehensive recycling program that rewards citizens for separating their waste...
                </p>
                <Progress value={78} className="h-2 mb-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-secondary">78% of Goal</span>
                  <span className="flex items-center font-bold text-secondary"><ArrowUp className="h-4 w-4 mr-1" />256 Votes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full bg-background/70">
              <CardHeader>
                <CardTitle className="text-lg">Live Polls</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center">
                    <span>Community Solar</span> <span className="font-bold text-primary">128</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Public Transport</span> <span className="font-bold text-primary">98</span>
                  </li>
                   <li className="flex justify-between items-center">
                    <span>Youth Tech Training</span> <span className="font-bold text-primary">77</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Card className="bg-background/70">
            <CardHeader>
              <CardTitle className="text-lg">Directives in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Directive</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Streetlight Repair Phase 1</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-accent-foreground border-accent bg-accent">
                        <FolderClock className="h-3 w-3 mr-1.5"/> In Progress
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Drainage Desilting Program</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1.5"/> Completed
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Community Voices</h3>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/Aisha/40/40" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/Musa/40/40" />
              <AvatarFallback>MI</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/Fatima/40/40" />
              <AvatarFallback>FS</AvatarFallback>
            </Avatar>
             <Avatar>
              <AvatarImage src="https://picsum.photos/seed/Umar/40/40" />
              <AvatarFallback>UF</AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              +12k
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
