"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X, Trash2 } from "lucide-react"

const RECIPE_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Snack", "Beverage", "Salad"]

interface RecipeFormProps {
    userId: number
    editingRecipe?: {
        id: number
        title: string
        description: string
        ingredients: string
        steps: string
        category: string
        imageUrl: string
        userId: number
    } | null
    onSuccess: () => void
    onCancel?: () => void
    onDelete?: (id: number) => void
}

export function RecipeForm({ userId, editingRecipe, onSuccess, onCancel, onDelete }: RecipeFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [steps, setSteps] = useState("")
    const [category, setCategory] = useState("")
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (editingRecipe) {
            setTitle(editingRecipe.title)
            setDescription(editingRecipe.description)
            setIngredients(editingRecipe.ingredients || "")
            setSteps(editingRecipe.steps || "")
            setCategory(editingRecipe.category || "")
        } else {
            setTitle("")
            setDescription("")
            setIngredients("")
            setSteps("")
            setCategory("")
        }
    }, [editingRecipe])

    const handleDelete = async () => {
        if (!editingRecipe || !onDelete) return

        if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
            return
        }

        setDeleting(true)
        try {
            const response = await fetch(`http://localhost:9999/recipes/${editingRecipe.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete recipe")
            }

            toast({
                title: "Success",
                description: "Recipe deleted successfully",
            })
            onDelete(editingRecipe.id)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete recipe",
            })
        } finally {
            setDeleting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !description || !ingredients || !steps || !category) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all required fields",
            })
            return
        }

        setLoading(true)

        try {
            const url = editingRecipe ? `http://localhost:9999/recipes/${editingRecipe.id}` : "http://localhost:9999/recipes"
            const method = editingRecipe ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    ingredients,
                    steps,
                    category,
                    userId,
                }),
            })

            if (!response.ok) {
                throw new Error(editingRecipe ? "Failed to update recipe" : "Failed to create recipe")
            }

            setTitle("")
            setDescription("")
            setIngredients("")
            setSteps("")
            setCategory("")
            onSuccess()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">{editingRecipe ? "Edit Recipe" : "Create New Recipe"}</CardTitle>
                        <CardDescription>
                            {editingRecipe ? "Update your recipe details" : "Share your amazing recipe with the community"}
                        </CardDescription>
                    </div>
                    {editingRecipe && onCancel && (
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="recipe-title">Recipe Title *</Label>
                        <Input
                            id="recipe-title"
                            type="text"
                            placeholder="e.g., Chocolate Chip Cookies"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipe-category">Category *</Label>
                        <Select value={category} onValueChange={setCategory} disabled={loading} required>
                            <SelectTrigger id="recipe-category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {RECIPE_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipe-description">Description *</Label>
                        <Textarea
                            id="recipe-description"
                            placeholder="Brief description of your recipe..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            required
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipe-ingredients">Ingredients *</Label>
                        <Textarea
                            id="recipe-ingredients"
                            placeholder="List all ingredients (one per line)"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            disabled={loading}
                            required
                            rows={5}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipe-steps">Cooking Steps *</Label>
                        <Textarea
                            id="recipe-steps"
                            placeholder="Step-by-step instructions..."
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            disabled={loading}
                            required
                            rows={6}
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1" disabled={loading || deleting}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingRecipe ? "Update Recipe" : "Create Recipe"}
                        </Button>
                        {editingRecipe && (
                            <>
                                {onCancel && (
                                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
                                        Cancel
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading || deleting}>
                                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
