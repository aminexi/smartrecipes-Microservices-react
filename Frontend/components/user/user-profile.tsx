"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserIcon } from "lucide-react"

interface UserProfileProps {
    user: {
        id: number
        username: string
        email: string

    }
    onUpdate: (user: { id: number; username: string; email: string;  }) => void
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!username || !email) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Username and email are required",
            })
            return
        }

        setLoading(true)

        try {
            const updateData: any = {
                username,
                email,
            }

            if (password) {
                updateData.password = password
            }

            const response = await fetch(`http://localhost:9999/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            const updatedUser = await response.json()

            onUpdate({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
            })

            setPassword("")
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">My Profile</h2>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Account Details</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="profile-username">Username</Label>
                            <Input
                                id="profile-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile-email">Email</Label>
                            <Input
                                id="profile-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile-password">New Password</Label>
                            <Input
                                id="profile-password"
                                type="password"
                                placeholder="Leave blank to keep current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">Only fill this if you want to change your password</p>
                        </div>



                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="font-medium">{user.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Username</span>
                        <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{user.email}</span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
