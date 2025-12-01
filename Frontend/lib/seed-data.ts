// Sample data seeding helper
export const sampleUsers = [
    {
        username: "chef_maria",
        email: "maria@example.com",
        password: "password123",
        role: "USER",
    },
    {
        username: "baker_john",
        email: "john@example.com",
        password: "password123",
        role: "USER",
    },
    {
        username: "foodie_sarah",
        email: "sarah@example.com",
        password: "password123",
        role: "USER",
    },
]

export const sampleRecipes = [
    {
        title: "Classic Margherita Pizza",
        description: "Authentic Italian pizza with fresh mozzarella, tomatoes, and basil",
        ingredients:
            "Pizza dough\n500g all-purpose flour\n1 packet active dry yeast\n2 cups warm water\n2 tsp salt\n2 tbsp olive oil\n\nToppings:\n2 cups tomato sauce\n300g fresh mozzarella\nFresh basil leaves\nExtra virgin olive oil\nSalt to taste",
        steps:
            "1. Prepare the dough: Mix warm water with yeast and let sit for 5 minutes\n2. Combine flour and salt, add yeast mixture and olive oil\n3. Knead for 10 minutes until smooth\n4. Let dough rise for 1 hour\n5. Preheat oven to 475°F (245°C)\n6. Roll out dough to desired thickness\n7. Spread tomato sauce evenly\n8. Add torn mozzarella pieces\n9. Bake for 12-15 minutes until crust is golden\n10. Top with fresh basil and drizzle with olive oil",
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        userId: 1,
    },
    {
        title: "Chocolate Lava Cake",
        description: "Decadent molten chocolate cake with a gooey center",
        ingredients:
            "115g dark chocolate\n115g butter\n2 large eggs\n2 egg yolks\n50g sugar\n2 tbsp all-purpose flour\nButter for greasing\nCocoa powder for dusting",
        steps:
            "1. Preheat oven to 425°F (220°C)\n2. Grease 4 ramekins and dust with cocoa powder\n3. Melt chocolate and butter together in double boiler\n4. Whisk eggs, yolks, and sugar until thick\n5. Fold melted chocolate into egg mixture\n6. Gently fold in flour\n7. Divide batter among ramekins\n8. Bake for 12-14 minutes\n9. Centers should be soft\n10. Let cool for 1 minute, invert onto plates\n11. Serve immediately with vanilla ice cream",
        category: "Dessert",
        imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
        userId: 2,
    },
    {
        title: "Thai Green Curry",
        description: "Aromatic and spicy Thai curry with coconut milk and vegetables",
        ingredients:
            "2 tbsp green curry paste\n400ml coconut milk\n300g chicken breast, sliced\n1 bell pepper, sliced\n1 eggplant, cubed\n100g green beans\n2 tbsp fish sauce\n1 tbsp palm sugar\nThai basil leaves\nJasmine rice for serving",
        steps:
            "1. Heat 2 tbsp coconut milk in a wok over medium heat\n2. Add curry paste and fry for 2 minutes\n3. Add chicken and cook until sealed\n4. Pour in remaining coconut milk\n5. Add bell pepper, eggplant, and green beans\n6. Simmer for 15 minutes\n7. Stir in fish sauce and palm sugar\n8. Add Thai basil leaves\n9. Serve hot over jasmine rice",
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
        userId: 1,
    },
    {
        title: "Caesar Salad",
        description: "Classic Caesar salad with homemade dressing and croutons",
        ingredients:
            "2 romaine lettuce hearts\n1 cup croutons\n50g Parmesan cheese, shaved\n\nDressing:\n2 garlic cloves, minced\n2 anchovy fillets\n1 egg yolk\n2 tbsp lemon juice\n1 tsp Dijon mustard\n150ml olive oil\nSalt and pepper",
        steps:
            "1. Make the dressing: Mash garlic and anchovies into a paste\n2. Whisk in egg yolk, lemon juice, and mustard\n3. Slowly drizzle in olive oil while whisking\n4. Season with salt and pepper\n5. Tear lettuce into bite-sized pieces\n6. Toss lettuce with dressing\n7. Add croutons and Parmesan\n8. Serve immediately",
        category: "Salad",
        imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
        userId: 3,
    },
    {
        title: "Beef Tacos",
        description: "Flavorful Mexican beef tacos with fresh toppings",
        ingredients:
            "500g ground beef\n1 onion, diced\n2 garlic cloves, minced\n2 tbsp taco seasoning\n8 taco shells\n\nToppings:\nShredded lettuce\nDiced tomatoes\nShredded cheddar cheese\nSour cream\nSalsa\nLime wedges",
        steps:
            "1. Heat a large skillet over medium-high heat\n2. Cook ground beef until browned, breaking it apart\n3. Add onion and garlic, cook for 3 minutes\n4. Stir in taco seasoning and 1/4 cup water\n5. Simmer for 5 minutes\n6. Warm taco shells according to package\n7. Fill shells with beef mixture\n8. Top with lettuce, tomatoes, cheese, sour cream, and salsa\n9. Serve with lime wedges",
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        userId: 2,
    },
    {
        title: "Blueberry Pancakes",
        description: "Fluffy pancakes loaded with fresh blueberries",
        ingredients:
            "2 cups all-purpose flour\n2 tbsp sugar\n2 tsp baking powder\n1 tsp baking soda\n1/2 tsp salt\n2 eggs\n2 cups buttermilk\n4 tbsp melted butter\n1 cup fresh blueberries\nMaple syrup for serving",
        steps:
            "1. Mix flour, sugar, baking powder, baking soda, and salt\n2. In another bowl, whisk eggs, buttermilk, and melted butter\n3. Combine wet and dry ingredients until just mixed\n4. Gently fold in blueberries\n5. Heat griddle over medium heat\n6. Pour 1/4 cup batter per pancake\n7. Cook until bubbles form on surface\n8. Flip and cook until golden\n9. Serve warm with maple syrup",
        category: "Breakfast",
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
        userId: 3,
    },
]

export const sampleRatings = [
    // Margherita Pizza ratings
    {
        recipeId: 1,
        userId: 2,
        stars: 5,
        comment: "Absolutely perfect! The crust was crispy and the fresh mozzarella made all the difference.",
    },
    { recipeId: 1, userId: 3, stars: 5, comment: "Best pizza recipe I've tried. My family loved it!" },

    // Chocolate Lava Cake ratings
    { recipeId: 2, userId: 1, stars: 5, comment: "Decadent and delicious! The molten center was perfectly gooey." },
    {
        recipeId: 2,
        userId: 3,
        stars: 4,
        comment: "Great dessert, though mine came out a bit too cooked. Will try again!",
    },

    // Thai Green Curry ratings
    { recipeId: 3, userId: 2, stars: 5, comment: "So aromatic and flavorful! This is my new favorite curry recipe." },
    { recipeId: 3, userId: 3, stars: 5, comment: "Restaurant quality! The balance of spice and coconut was perfect." },

    // Caesar Salad ratings
    { recipeId: 4, userId: 1, stars: 4, comment: "Classic and delicious. The homemade dressing really elevates it." },
    { recipeId: 4, userId: 2, stars: 5, comment: "Best Caesar salad I've ever made at home!" },

    // Beef Tacos ratings
    { recipeId: 5, userId: 1, stars: 5, comment: "Quick and easy weeknight dinner. Everyone loved these tacos!" },
    { recipeId: 5, userId: 3, stars: 4, comment: "Very tasty! I added some jalapeños for extra heat." },

    // Blueberry Pancakes ratings
    { recipeId: 6, userId: 1, stars: 5, comment: "So fluffy and delicious! Perfect weekend breakfast." },
    { recipeId: 6, userId: 2, stars: 5, comment: "My kids ask for these every weekend now. Amazing recipe!" },
]
