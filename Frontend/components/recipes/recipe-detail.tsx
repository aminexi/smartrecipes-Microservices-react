"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { RatingForm } from "./rating-form"
import { RatingList } from "./rating-list"

interface Recipe {
    id: number
    title: string
    description: string
    ingredients: string
    steps: string
    category: string
    imageUrl?: string
    userId: number
}

interface RecipeDetailProps {
    recipeId: number
    userId: number
    onBack: () => void
    onEdit: (recipe: Recipe) => void
    onDelete: () => void
}

export function RecipeDetail({ recipeId, userId, onBack, onEdit, onDelete }: RecipeDetailProps) {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [refreshRatings, setRefreshRatings] = useState(0)
    const { toast } = useToast()

    useEffect(() => {
        fetchRecipe()
    }, [recipeId])

    const fetchRecipe = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:9999/recipes/${recipeId}`)

            if (!response.ok) {
                throw new Error("Failed to fetch recipe")
            }

            const data = await response.json()
            setRecipe(data)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load recipe details",
            })
            onBack()
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this recipe?")) {
            return
        }

        setDeleting(true)
        try {
            const response = await fetch(`http://localhost:9999/recipes/${recipeId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete recipe")
            }

            toast({
                title: "Success",
                description: "Recipe deleted successfully",
            })
            onDelete()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete recipe",
            })
        } finally {
            setDeleting(false)
        }
    }

    const handleRatingAdded = () => {
        setRefreshRatings((prev) => prev + 1)
        toast({
            title: "Success",
            description: "Rating added successfully",
        })
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (!recipe) {
        return null
    }

    const isOwner = recipe.userId === userId

    return (
        <div className="space-y-6">
            {/* Recipe Details */}
            <Card className="shadow-lg">
                {recipe.imageUrl && (
                    <div className="relative h-72 w-full overflow-hidden rounded-t-lg">
                        <img
                            src={recipe.imageUrl || "/placeholder.svg"}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none"
                            }}
                        />
                    </div>
                )}

                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                {recipe.category && (
                                    <Badge variant="secondary" className="text-base">
                                        {recipe.category}
                                    </Badge>
                                )}
                                {isOwner && <Badge variant="outline">Your Recipe</Badge>}
                            </div>
                            <CardTitle className="text-4xl">{recipe.title}</CardTitle>
                            <CardDescription className="text-base">{recipe.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">{recipe.ingredients}</pre>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xl font-semibold mb-3">Cooking Steps</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">{recipe.steps}</pre>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2 flex-wrap">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </Button>
                    {isOwner && (
                        <>
                            <Button variant="default" onClick={() => onEdit(recipe)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Recipe
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Delete Recipe
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Add Rating Form */}
            <RatingForm recipeId={recipeId} userId={userId} onSuccess={handleRatingAdded} />

            {/* Ratings List */}
            <RatingList recipeId={recipeId} refreshTrigger={refreshRatings} />
        </div>
    )
}
