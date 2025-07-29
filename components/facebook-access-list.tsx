"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Info, MoreHorizontal } from "lucide-react"

interface UserAccess {
  id: string
  name: string
  avatarUrl: string
  permissions: string
  inviteExpiresInDays?: number
  isYou?: boolean
}

const users: UserAccess[] = [
  {
    id: "1",
    name: "Madad Yawari",
    avatarUrl: "/diverse-group.png",
    permissions: "Page Deletion, Permissions, Content, Messages and calls, Community Activity, Ads, Insights",
    inviteExpiresInDays: 31,
  },
  {
    id: "2",
    name: "Zabih Abidy",
    avatarUrl: "/diverse-group.png",
    permissions: "Page Deletion, Permissions, Content, Messages and calls, Community Activity, Ads, Insights",
    inviteExpiresInDays: 30,
  },
  {
    id: "3",
    name: "Zabih Bakhtiari (You)",
    avatarUrl: "/diverse-group.png",
    permissions: "Page Deletion, Permissions, Content, Messages and calls, Community Activity, Ads, Insights",
    isYou: true,
  },
]

export default function FacebookAccessList() {
  return (
    <Card className="w-full max-w-2xl bg-gray-900 text-white border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-xl font-semibold">People with Facebook access</CardTitle>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <Button variant="link" className="text-blue-400 hover:text-blue-300">
          Add New
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-400">{user.permissions}</p>
                {user.inviteExpiresInDays && (
                  <p className="text-sm text-red-400">Invite expires in {user.inviteExpiresInDays} days</p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700">
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">Edit Access</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">Remove Access</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
