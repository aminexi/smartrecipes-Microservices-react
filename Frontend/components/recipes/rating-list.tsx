"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Star } from "lucide-react"

interface Rating {
    id: number
    stars: number
    comment: string
    createdAt: string
}

interface RatingListProps {
    recipeId: number
    refreshTrigger: number
}

export function RatingList({ recipeId, refreshTrigger }: RatingListProps) {
    const [ratings, setRatings] = useState<Rating[]>([])
    const [averageRating, setAverageRating] = useState(0)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchRatings()
    }, [recipeId, refreshTrigger])

    const fetchRatings = async () => {
        setLoading(true)
        try {
            const ratingsResponse = await fetch(`http://localhost:9999/ratings/recipe/${recipeId}`)

            if (!ratingsResponse.ok) {
                throw new Error("Failed to fetch ratings")
            }

            const ratingsData = await ratingsResponse.json()

            const ratingsArray = ratingsData.ratings || ratingsData || []
            setRatings(ratingsArray)

            if (ratingsArray.length > 0) {
                const sum = ratingsArray.reduce((acc: number, r: Rating) => acc + r.stars, 0)
                const avg = sum / ratingsArray.length
                setAverageRating(avg)
            } else {
                setAverageRating(0)
            }
        } catch (error) {
            console.error("[v0] Error fetching ratings:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load ratings",
            })
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (count: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "Recently"

        try {
            const date = new Date(dateString)
            // Check if date is valid
            if (isNaN(date.getTime())) return "Recently"

            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch (error) {
            return "Recently"
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ratings & Reviews</CardTitle>
                        <CardDescription>{ratings.length} reviews</CardDescription>
                    </div>
                    {ratings.length > 0 && (
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Average rating</p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {ratings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No ratings yet. Be the first to rate this recipe!</p>
                ) : (
                    <div className="space-y-4">
                        {ratings.map((rating) => (
                            <div key={rating.id} className="border-b pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    {renderStars(rating.stars)}
                                    <span className="text-sm text-muted-foreground">{formatDate(rating.createdAt)}</span>
                                </div>
                                <p className="text-sm text-foreground">{rating.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
