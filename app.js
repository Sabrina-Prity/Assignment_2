
const fetchMeals = (count = 20) => {
    for (let i = 0; i < count; i++) {
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
            .then(response => response.json())
            .then(data => {
                
                displayMeals(data.meals);
            })
            .catch(error => console.error("Error fetching meals:", error));
    }
};



const displayMeals = (meals) => {
    

    const mealContainer = document.querySelector('.meal-display');
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('meal-card');
            mealCard.innerHTML = `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <button class="recipe-btn btn">Get Recipe</button>
                        <button class="add-to-cart-btn btn">Add to Cart</button>
                    </div>
                </div>
            `;
            mealCard.querySelector('.recipe-btn').addEventListener('click', () => mealRecipeModal(meal));
            mealCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(meal));
            mealContainer.appendChild(mealCard);
        });
    
};

fetchMeals(); 


// Cart Section
let cartItemCount = 0;

const addToCart = (meal) => {
    if (cartItemCount >= 11) {
        alert("You cannot add more than 11 items to the cart.");
        return; 
    }

    const cartContainer = document.querySelector('.cart-display');
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
        <div class="single-cart-display">
            <p>${meal.strMeal}</p>
            <button class="remove-from-cart-btn">Remove</button>
        </div>
    `;
    
    cartItem.querySelector('.remove-from-cart-btn').addEventListener('click', () => {
        cartContainer.removeChild(cartItem);
        cartItemCount--;
        updateCartCount(); 
    });

    cartContainer.appendChild(cartItem);
    cartItemCount++; 
    updateCartCount();
};

const updateCartCount = () => {
    const cartItemCountDisplay = document.querySelector('.cart-item-count');
    cartItemCountDisplay.textContent = `Total: ${cartItemCount}`;
};




const searchBtn = document.querySelector('.search-btn');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

searchBtn.addEventListener('click', getMealList);

recipeCloseBtn.addEventListener('click', () => {
    document.querySelector('.meal-details').classList.remove('showRecipe');
});

function getMealList() {
    const searchInput = document.querySelector('.search-box').value.trim();
    document.querySelector('.search-box').value = ''; 

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const mealContainer = document.querySelector('.meal-display');
            mealContainer.innerHTML = ''; 

            if (data.meals)
            { 
                displayMeals(data.meals);
            } 
            else 
            {
                mealContainer.innerHTML = ''; 
                mealContainer.innerHTML = `<p class="no-meal-message">Sorry!!! <br> No meal found!</p>`;
            }
        })
        .catch(error => console.error("Error fetching search results:", error));
};

  

function mealRecipeModal(meal) {
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p class="fullRecipe">${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    document.querySelector('.meal-details').classList.add('showRecipe');
}
