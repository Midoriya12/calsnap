
import type { Recipe } from '@/types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Spaghetti Carbonara',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="spaghetti carbonara"
    cuisine: 'Italian',
    ingredients: ['200g Spaghetti', '2 large Eggs', '50g Pancetta or Guanciale, diced', '25g Pecorino Romano cheese, grated', 'Freshly ground Black Pepper', 'Salt to taste'],
    instructions: [
      'Cook spaghetti according to package directions. Reserve 1/2 cup of pasta water.',
      'While pasta cooks, fry pancetta in a skillet until crispy. Remove from heat.',
      'In a bowl, whisk eggs, grated Pecorino Romano, and a generous amount of black pepper.',
      'Drain pasta and immediately add it to the skillet with pancetta. Toss to combine.',
      'Quickly pour in the egg mixture, stirring constantly to prevent eggs from scrambling. If too thick, add a little reserved pasta water until creamy.',
      'Serve immediately with extra grated cheese and pepper.'
    ],
    dietaryRestrictions: ['Non-Veg'],
    calories: 600,
    description: 'A creamy and delicious classic Italian pasta dish, rich in flavor and tradition.',
    preparationTime: '30 minutes',
    servings: 2,
    viewCount: 1250,
    saveCount: 320,
  },
  {
    id: '2',
    name: 'Vegan Lentil Soup',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="lentil soup"
    cuisine: 'Global',
    ingredients: ['1 cup Red Lentils, rinsed', '4 cups Vegetable Broth', '1 medium Carrot, diced', '1 Celery stalk, diced', '1 medium Onion, chopped', '2 cloves Garlic, minced', '1 tsp Turmeric powder', '1 tsp Cumin powder', 'Salt and Pepper to taste', '1 tbsp Olive Oil'],
    instructions: [
      'Heat olive oil in a large pot or Dutch oven over medium heat.',
      'Add onion, carrot, and celery. Cook until softened, about 5-7 minutes.',
      'Stir in garlic, turmeric, and cumin. Cook for 1 minute more until fragrant.',
      'Add rinsed lentils and vegetable broth. Bring to a boil.',
      'Reduce heat, cover, and simmer for 20-25 minutes, or until lentils are tender.',
      'Season with salt and pepper. Serve hot, optionally with a squeeze of lemon juice.'
    ],
    dietaryRestrictions: ['Vegan', 'Gluten-Free', 'Veg', 'Low Fat', 'High Fiber'],
    calories: 350,
    description: 'A hearty and nutritious vegan soup perfect for a cold day, packed with vegetables and spices.',
    preparationTime: '45 minutes',
    servings: 4,
    viewCount: 890,
    saveCount: 150,
  },
  {
    id: '3',
    name: 'Chicken Teriyaki Stir-fry',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="chicken stirfry"
    cuisine: 'Japanese',
    ingredients: ['1 lb Chicken Breast, cut into strips', '1 head Broccoli, cut into florets', '1 Red Bell Pepper, sliced', '1/4 cup Soy Sauce', '2 tbsp Mirin', '1 tbsp Sugar', '1 tsp Ginger, grated', '1 clove Garlic, minced', '1 tbsp Sesame Oil', 'Cooked Rice for serving'],
    instructions: [
      'In a small bowl, whisk together soy sauce, mirin, sugar, ginger, and garlic for the teriyaki sauce.',
      'Heat sesame oil in a large skillet or wok over medium-high heat.',
      'Add chicken strips and cook until browned and cooked through. Remove from skillet.',
      'Add broccoli and bell pepper to the skillet. Stir-fry for 3-5 minutes until tender-crisp.',
      'Return chicken to the skillet. Pour teriyaki sauce over everything.',
      'Cook, stirring, for 2-3 minutes until sauce has thickened and coated the chicken and vegetables.',
      'Serve hot over cooked rice.'
    ],
    dietaryRestrictions: ['Non-Veg'],
    calories: 450,
    description: 'A quick and flavorful chicken stir-fry with a sweet and savory teriyaki sauce and crisp vegetables.',
    preparationTime: '25 minutes',
    servings: 3,
    viewCount: 2100,
    saveCount: 550,
  },
  {
    id: '4',
    name: 'Quinoa Salad with Roasted Vegetables',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="quinoa salad"
    cuisine: 'Mediterranean',
    ingredients: ['1 cup Quinoa, rinsed', '2 cups Water or Vegetable Broth', '1 Zucchini, diced', '1 Eggplant, diced', '1 Red Onion, sliced', '1 cup Cherry Tomatoes, halved', '1/2 cup Feta Cheese, crumbled', '1/4 cup Kalamata Olives, halved', 'Dressing: 3 tbsp Olive Oil, 1 tbsp Lemon Juice, Salt, Pepper'],
    instructions: [
      'Preheat oven to 400°F (200°C). Toss zucchini, eggplant, and red onion with a little olive oil, salt, and pepper. Roast for 20-25 minutes until tender.',
      'Cook quinoa according to package directions using water or broth.',
      'In a small bowl, whisk together dressing ingredients: olive oil, lemon juice, salt, and pepper.',
      'In a large bowl, combine cooked quinoa, roasted vegetables, cherry tomatoes, and Kalamata olives.',
      'Pour dressing over the salad and toss gently to combine.',
      'Sprinkle with feta cheese before serving. Can be served warm or cold.'
    ],
    dietaryRestrictions: ['Gluten-Free', 'Vegetarian', 'Veg', 'Low Carb'],
    calories: 400,
    description: 'A light and refreshing quinoa salad packed with colorful roasted vegetables and a zesty lemon dressing.',
    preparationTime: '50 minutes',
    servings: 4,
    viewCount: 750,
    saveCount: 210,
  },
  {
    id: '5',
    name: 'Beef Tacos with Homemade Salsa',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="beef tacos"
    cuisine: 'Mexican',
    ingredients: ['1 lb Ground Beef', '1 packet Taco Seasoning', '12 Taco Shells (hard or soft)', 'Toppings: Shredded Lettuce, Diced Tomatoes, Chopped Onion, Shredded Cheese, Sour Cream', 'Salsa: 2 ripe Tomatoes, diced; 1/2 Red Onion, finely chopped; 1 Jalapeño, minced (optional); 1/4 cup Cilantro, chopped; Juice of 1 Lime; Salt to taste'],
    instructions: [
      'For the salsa: In a medium bowl, combine diced tomatoes, red onion, jalapeño (if using), cilantro, lime juice, and salt. Mix well and set aside.',
      'Cook ground beef in a skillet over medium heat until browned. Drain excess fat.',
      'Stir in taco seasoning and water according to package directions. Simmer for 5-7 minutes.',
      'Warm taco shells according to package directions.',
      'Assemble tacos: Fill shells with beef mixture, then add desired toppings and homemade salsa.'
    ],
    dietaryRestrictions: ['Non-Veg'],
    calories: 520,
    description: 'Flavorful beef tacos with fresh homemade salsa, perfect for a fun and easy weeknight meal.',
    preparationTime: '35 minutes',
    servings: 4,
    viewCount: 1800,
    saveCount: 480,
  },
  {
    id: '6',
    name: 'Thai Green Curry with Tofu',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="thai curry"
    cuisine: 'Thai',
    ingredients: ['1 block (14oz) Firm Tofu, pressed and cubed', '2 tbsp Green Curry Paste', '1 can (13.5oz) Coconut Milk', '1 cup Bamboo Shoots, sliced', '1 Red Bell Pepper, sliced', '1/2 cup Thai Basil leaves', '1 tbsp Soy Sauce (or fish sauce if not vegan)', '1 tsp Sugar', 'Jasmine Rice for serving'],
    instructions: [
      'Optional: Pan-fry or bake tofu cubes until lightly golden. Set aside.',
      'In a large pot or wok, heat 1/4 cup of coconut milk over medium heat. Add green curry paste and cook for 1-2 minutes until fragrant.',
      'Stir in the remaining coconut milk, bamboo shoots, and bell pepper. Bring to a simmer.',
      'Add tofu, soy sauce, and sugar. Simmer for 5-10 minutes, allowing flavors to meld.',
      'Stir in Thai basil leaves just before serving.',
      'Serve hot with jasmine rice.'
    ],
    dietaryRestrictions: ['Vegan', 'Gluten-Free', 'Veg'],
    calories: 480,
    description: 'Aromatic and spicy Thai green curry with crispy tofu and a medley of vegetables, served over jasmine rice.',
    preparationTime: '40 minutes',
    servings: 4,
    viewCount: 1150,
    saveCount: 290,
  },
  {
    id: '7',
    name: 'Mushroom Risotto',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="mushroom risotto"
    cuisine: 'Italian',
    ingredients: ['1.5 cups Arborio Rice', '8 oz Mushrooms (Cremini, Porcini), sliced', '4-5 cups Vegetable Broth, warmed', '1/2 cup Dry White Wine', '1/2 cup Parmesan Cheese, grated', '1 small Onion, finely chopped', '2 cloves Garlic, minced', '2 tbsp Olive Oil', '1 tbsp Butter', 'Salt and Pepper to taste', 'Fresh Parsley, chopped for garnish'],
    instructions: [
      'Heat olive oil and butter in a large, heavy-bottomed pot or Dutch oven over medium heat.',
      'Add onion and cook until softened, about 3-5 minutes. Add garlic and mushrooms, cook until mushrooms are browned and their liquid has evaporated.',
      'Add Arborio rice to the pot and stir for 1-2 minutes until grains are translucent at the edges.',
      'Pour in white wine and cook, stirring constantly, until fully absorbed.',
      'Add a ladleful (about 1/2 cup) of warm broth to the rice, stirring continuously until absorbed. Continue adding broth, one ladleful at a time, waiting until each addition is absorbed before adding the next. This process should take about 20-25 minutes.',
      'Once the rice is creamy and al dente, remove from heat. Stir in grated Parmesan cheese.',
      'Season with salt and pepper to taste. Garnish with fresh parsley and serve immediately.'
    ],
    dietaryRestrictions: ['Vegetarian', 'Veg'],
    calories: 550,
    description: 'Creamy and decadent mushroom risotto made with Arborio rice and a mix of fresh mushrooms.',
    preparationTime: '1 hour',
    servings: 3,
    viewCount: 980,
    saveCount: 250,
  },
  {
    id: '8',
    name: 'Indian Butter Chicken',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="butter chicken"
    cuisine: 'Indian',
    ingredients: ['1.5 lbs Chicken Thighs, boneless, skinless, cut into pieces', 'Marinade: 1/2 cup Plain Yogurt, 1 tbsp Ginger-Garlic Paste, 1 tsp Turmeric, 1 tsp Garam Masala, 1/2 tsp Cumin, Salt', 'Sauce: 1 tbsp Oil, 1 tbsp Butter, 1 large Onion, finely chopped, 1 tbsp Ginger-Garlic Paste, 1 (14oz) can Tomato Puree or crushed tomatoes, 1 tsp Garam Masala, 1 tsp Kashmiri Red Chili powder (optional, for color), 1/2 cup Heavy Cream, 1 tbsp Kasuri Methi (dried fenugreek leaves), Salt to taste, Sugar to taste (optional, to balance acidity)'],
    instructions: [
      'In a bowl, combine chicken pieces with all marinade ingredients. Mix well, cover, and refrigerate for at least 30 minutes (or up to 4 hours).',
      'Heat oil and butter in a large pot or Dutch oven over medium heat. Add chopped onion and cook until golden brown.',
      'Add ginger-garlic paste and cook for 1 minute until fragrant.',
      'Stir in tomato puree, garam masala, and Kashmiri red chili powder. Cook for 5-7 minutes, until sauce thickens slightly.',
      'Add marinated chicken to the pot. Cook for 10-15 minutes, stirring occasionally, until chicken is cooked through.',
      'Reduce heat to low. Stir in heavy cream and kasuri methi. Simmer for 5 more minutes. Do not boil.',
      'Taste and adjust seasoning with salt and a pinch of sugar if needed.',
      'Serve hot with naan bread or basmati rice.'
    ],
    dietaryRestrictions: ['Non-Veg'],
    calories: 650,
    description: 'A rich and creamy Indian butter chicken curry, mildly spiced and full of flavor. Best served with naan or rice.',
    preparationTime: '50 minutes',
    servings: 4,
    viewCount: 3200,
    saveCount: 850,
  },
  {
    id: '9',
    name: 'Refreshing Greek Salad',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="greek salad"
    cuisine: 'Greek',
    ingredients: ['1 Cucumber, sliced', '4 ripe Tomatoes, cut into wedges', '1 Red Onion, thinly sliced', '1/2 cup Kalamata Olives', '4 oz Feta Cheese, crumbled or cubed', '2 tbsp Olive Oil', '1 tbsp Red Wine Vinegar', '1 tsp Dried Oregano', 'Salt and Pepper to taste'],
    instructions: [
      'In a large salad bowl, combine cucumber, tomatoes, red onion, and Kalamata olives.',
      'In a small bowl, whisk together olive oil, red wine vinegar, dried oregano, salt, and pepper.',
      'Pour dressing over the vegetables and toss gently to combine.',
      'Sprinkle feta cheese over the top.',
      'Serve immediately or chill for later. Tastes even better after marinating for a bit!'
    ],
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free', 'Veg', 'Keto', 'Low Carb'],
    calories: 300,
    description: 'A crisp and refreshing Greek salad with classic ingredients like tomatoes, cucumbers, olives, and feta cheese.',
    preparationTime: '15 minutes',
    servings: 4,
    viewCount: 650,
    saveCount: 180,
  },
  {
    id: '10',
    name: 'Classic Chocolate Chip Cookies',
    imageUrl: 'https://placehold.co/600x400.png', // data-ai-hint="chocolate cookies"
    cuisine: 'American',
    ingredients: ['2 1/4 cups All-Purpose Flour', '1 tsp Baking Soda', '1 tsp Salt', '1 cup (2 sticks) Unsalted Butter, softened', '3/4 cup Granulated Sugar', '3/4 cup Brown Sugar, packed', '2 large Eggs', '1 tsp Vanilla Extract', '2 cups Semi-Sweet Chocolate Chips'],
    instructions: [
      'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.',
      'In a small bowl, whisk together flour, baking soda, and salt.',
      'In a large bowl, beat softened butter, granulated sugar, and brown sugar with an electric mixer until creamy.',
      'Beat in eggs one at a time, then stir in vanilla extract.',
      'Gradually add the dry ingredients to the wet ingredients, mixing on low speed until just combined. Do not overmix.',
      'Stir in chocolate chips.',
      'Drop rounded tablespoons of dough onto prepared baking sheets, about 2 inches apart.',
      'Bake for 9-11 minutes, or until edges are golden brown and centers are set.',
      'Let cookies cool on baking sheets for a few minutes before transferring to wire racks to cool completely.'
    ],
    dietaryRestrictions: ['Vegetarian', 'Veg'],
    calories: 150, // Per cookie
    description: 'The ultimate classic chocolate chip cookies: soft, chewy, and loaded with chocolate chips.',
    preparationTime: '20 minutes + chill time (optional)',
    servings: 24, // Makes about 2 dozen cookies
    viewCount: 4500,
    saveCount: 1200,
  }
];


    