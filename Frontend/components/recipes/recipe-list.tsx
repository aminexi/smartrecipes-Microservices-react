"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Eye, Edit, Loader2, Star, ChefHat } from "lucide-react"

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

interface RecipeListProps {
    refreshTrigger: number
    onViewRecipe: (id: number) => void
    onEditRecipe: (recipe: Recipe) => void
    userId: number
}

export function RecipeList({ refreshTrigger, onViewRecipe, onEditRecipe, userId }: RecipeListProps) {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [recipeRatings, setRecipeRatings] = useState<Record<number, { average: number; count: number }>>({})
    const { toast } = useToast()

    useEffect(() => {
        fetchRecipes()
    }, [refreshTrigger])

    const fetchRecipes = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:9999/recipes")

            if (!response.ok) {
                throw new Error("Failed to fetch recipes")
            }

            const data = await response.json()
            setRecipes(data)

            await fetchAllRatings(data)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load recipes",
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchAllRatings = async (recipes: Recipe[]) => {
        const ratingsMap: Record<number, { average: number; count: number }> = {}

        await Promise.all(
            recipes.map(async (recipe) => {
                try {
                    const response = await fetch(`http://localhost:9999/ratings/recipe/${recipe.id}`)

                    if (response.ok) {
                        const data = await response.json()

                        const ratingsArray = data.ratings || data || []

                        if (ratingsArray.length > 0) {
                            const average = ratingsArray.reduce((sum: number, r: any) => sum + r.stars, 0) / ratingsArray.length
                            ratingsMap[recipe.id] = { average, count: ratingsArray.length }
                            console.log(
                                "[v0] Recipe",
                                recipe.id,
                                "has average rating:",
                                average,
                                "from",
                                ratingsArray.length,
                                "ratings",
                            )
                        }
                    }
                } catch (error) {
                    console.error("[v0] Failed to fetch ratings for recipe", recipe.id, error)
                }
            }),
        )

        setRecipeRatings(ratingsMap)
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

    if (recipes.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <ChefHat className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">No recipes yet. Create your first recipe!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-balance">Discover Delicious Recipes</h2>
                <Badge variant="secondary" className="text-base px-4 py-2">
                    {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => {
                    const rating = recipeRatings[recipe.id]
                    const isOwner = recipe.userId === userId

                    return (
                        <Card
                            key={recipe.id}
                            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden group bg-gradient-to-br from-card to-card/50"
                        >
                            <CardHeader className="space-y-3 pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-xl font-bold line-clamp-2 flex-1 leading-tight text-balance">
                                        {recipe.title}
                                    </CardTitle>
                                    {isOwner && (
                                        <Badge variant="outline" className="shrink-0 bg-primary/10">
                                            Yours
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    {recipe.category && (
                                        <Badge variant="secondary" className="font-medium">
                                            {recipe.category}
                                        </Badge>
                                    )}
                                    {rating ? (
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="font-bold text-sm">{rating.average.toFixed(1)}</span>
                                            <span className="text-xs text-muted-foreground">({rating.count})</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      No ratings yet
                    </span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{recipe.description}</p>
                            </CardContent>

                            <CardFooter className="flex gap-2 pt-0">
                                <Button variant="default" size="sm" onClick={() => onViewRecipe(recipe.id)} className="flex-1">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                                {isOwner && (
                                    <Button variant="outline" size="sm" onClick={() => onEditRecipe(recipe)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
