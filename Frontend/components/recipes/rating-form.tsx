"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Star } from "lucide-react"

interface RatingFormProps {
    recipeId: number
    userId: number
    onSuccess: () => void
}

export function RatingForm({ recipeId, userId, onSuccess }: RatingFormProps) {
    const [stars, setStars] = useState(5)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [hasRated, setHasRated] = useState(false)
    const [checkingRating, setCheckingRating] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        checkIfUserRated()
    }, [recipeId, userId])

    const checkIfUserRated = async () => {
        setCheckingRating(true)
        try {
            const response = await fetch(`http://localhost:9999/ratings/recipe/${recipeId}`)
            console.log("[v0] Checking if user", userId, "rated recipe", recipeId)

            if (response.ok) {
                const data = await response.json()
                console.log("[v0] Rating data received:", data)
                const userRating = data.ratings?.find((r: any) => r.userId === userId)
                console.log("[v0] User rating found:", userRating)
                setHasRated(!!userRating)
            }
        } catch (error) {
            console.error("[v0] Failed to check user rating:", error)
        } finally {
            setCheckingRating(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (hasRated) {
            toast({
                variant: "destructive",
                title: "Already Rated",
                description: "You have already rated this recipe",
            })
            return
        }

        if (!comment) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please add a comment",
            })
            return
        }

        if (stars < 1 || stars > 5) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Rating must be between 1 and 5 stars",
            })
            return
        }

        setLoading(true)

        try {
            console.log("[v0] Submitting rating:", { recipeId, userId, stars, comment })

            const response = await fetch("http://localhost:9999/ratings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId,
                    userId,
                    stars,
                    comment,
                }),
            })

            console.log("[v0] Rating submission response status:", response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error("[v0] Rating submission failed:", errorText)
                throw new Error("Failed to add rating")
            }

            const result = await response.json()
            console.log("[v0] Rating submitted successfully:", result)

            setStars(5)
            setComment("")
            setHasRated(true)
            onSuccess()
        } catch (error) {
            console.error("[v0] Error submitting rating:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add rating",
            })
        } finally {
            setLoading(false)
        }
    }

    if (checkingRating) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (hasRated) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Rating</CardTitle>
                    <CardDescription>You have already rated this recipe. Thank you for your feedback!</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Add Your Rating</CardTitle>
                <CardDescription>Share your thoughts about this recipe</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setStars(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="transition-transform hover:scale-110"
                                    disabled={loading}
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoveredStar || stars) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground self-center">
                {stars} {stars === 1 ? "star" : "stars"}
              </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rating-comment">Your Comment</Label>
                        <Textarea
                            id="rating-comment"
                            placeholder="What did you think about this recipe?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                            required
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Rating
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
