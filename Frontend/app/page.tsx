"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegisterForm } from "@/components/auth/register-form"
import { LoginForm } from "@/components/auth/login-form"
import { RecipeList } from "@/components/recipes/recipe-list"
import { RecipeForm } from "@/components/recipes/recipe-form"
import { RecipeDetail } from "@/components/recipes/recipe-detail"
import { UserProfile } from "@/components/user/user-profile"
import { LogOut, ChefHat, User, Plus, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
    const [user, setUser] = useState<{ id: number; username: string; email: string; } | null>(null)
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
    const [editingRecipe, setEditingRecipe] = useState<{
        id: number
        title: string
        description: string
        ingredients: string
        steps: string
        category: string
        imageUrl: string
        userId: number
    } | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [activeView, setActiveView] = useState<"recipes" | "profile" | "create">("recipes")
    const { toast } = useToast()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const handleLoginSuccess = (userData: { id: number; username: string; email: string; }) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        toast({
            title: "Welcome back!",
            description: `Logged in as ${userData.username}`,
        })
    }

    const handleRegisterSuccess = (userData: { id: number; username: string; email: string;  }) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        toast({
            title: "Registration successful!",
            description: `Welcome, ${userData.username}`,
        })
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem("user")
        setSelectedRecipeId(null)
        setEditingRecipe(null)
        setActiveView("recipes")
        toast({
            title: "Logged out",
            description: "You have been logged out successfully",
        })
    }

    const handleRecipeCreated = () => {
        setRefreshTrigger((prev) => prev + 1)
        setActiveView("recipes")
        toast({
            title: "Success!",
            description: "Recipe created successfully",
        })
    }

    const handleRecipeUpdated = () => {
        setRefreshTrigger((prev) => prev + 1)
        setEditingRecipe(null)
        setSelectedRecipeId(null)
        setActiveView("recipes")
        toast({
            title: "Success!",
            description: "Recipe updated successfully",
        })
    }

    const handleRecipeDeleted = () => {
        setRefreshTrigger((prev) => prev + 1)
        setSelectedRecipeId(null)
        setEditingRecipe(null)
        setActiveView("recipes")
        toast({
            title: "Success!",
            description: "Recipe deleted successfully",
        })
    }

    const handleViewRecipe = (id: number) => {
        setSelectedRecipeId(id)
        setEditingRecipe(null)
    }

    const handleEditRecipe = (recipe: any) => {
        setEditingRecipe(recipe)
        setSelectedRecipeId(null)
        setActiveView("create")
    }

    const handleBackToList = () => {
        setSelectedRecipeId(null)
        setEditingRecipe(null)
        setActiveView("recipes")
    }

    const handleProfileUpdated = (updatedUser: { id: number; username: string; email: string; }) => {
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        toast({
            title: "Success!",
            description: "Profile updated successfully",
        })
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <ChefHat className="h-12 w-12 text-primary" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                                SmartRecipes
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-center max-w-md">
                            Discover, create, and share amazing recipes with the community
                        </p>

                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Get Started</CardTitle>
                                <CardDescription>Login or create an account to continue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="login" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="login">Login</TabsTrigger>
                                        <TabsTrigger value="register">Register</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="login">
                                        <LoginForm onSuccess={handleLoginSuccess} />
                                    </TabsContent>
                                    <TabsContent value="register">
                                        <RegisterForm onSuccess={handleRegisterSuccess} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-orange-50/50">
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ChefHat className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">
                                SmartRecipes
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <nav className="flex gap-2">
                                <Button
                                    variant={activeView === "recipes" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveView("recipes")
                                        setSelectedRecipeId(null)
                                        setEditingRecipe(null)
                                    }}
                                >
                                    <List className="mr-2 h-4 w-4" />
                                    Recipes
                                </Button>
                                <Button
                                    variant={activeView === "create" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveView("create")
                                        setSelectedRecipeId(null)
                                        setEditingRecipe(null)
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create
                                </Button>
                                <Button
                                    variant={activeView === "profile" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveView("profile")
                                        setSelectedRecipeId(null)
                                        setEditingRecipe(null)
                                    }}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Button>
                            </nav>
                            <div className="h-8 w-px bg-border" />
                            <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{user.username}</span>
              </span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {activeView === "profile" ? (
                    <div className="max-w-2xl mx-auto">
                        <UserProfile user={user} onUpdate={handleProfileUpdated} />
                    </div>
                ) : activeView === "create" ? (
                    <div className="max-w-2xl mx-auto">
                        <RecipeForm
                            userId={user.id}
                            editingRecipe={editingRecipe}
                            onSuccess={editingRecipe ? handleRecipeUpdated : handleRecipeCreated}
                            onCancel={editingRecipe ? handleBackToList : undefined}
                            onDelete={editingRecipe ? handleRecipeDeleted : undefined}
                        />
                    </div>
                ) : selectedRecipeId ? (
                    <div className="max-w-4xl mx-auto">
                        <RecipeDetail
                            recipeId={selectedRecipeId}
                            userId={user.id}
                            onBack={handleBackToList}
                            onEdit={handleEditRecipe}
                            onDelete={handleRecipeDeleted}
                        />
                    </div>
                ) : (
                    <RecipeList
                        refreshTrigger={refreshTrigger}
                        onViewRecipe={handleViewRecipe}
                        onEditRecipe={handleEditRecipe}
                        userId={user.id}
                    />
                )}
            </div>
        </main>
    )
}
