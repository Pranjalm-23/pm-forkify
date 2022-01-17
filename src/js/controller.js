import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

/**
 *
 * this is the controller for the forkify application
 *
 * this has imported the modals and views to control the application.
 * init() is always running to get the dom events
 */

const controlRecipes = async function () {
  try {
    // reads the hashcode from the url
    const id = window.location.hash.slice(1);

    if (!id) return;
    // if id is not found returned else the following spiiner is rendered
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result--IN CASE OF SEARCH
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view--BOOKMARKS ARE TAKEN CARE
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe--MODEL IS CALLED TO FETCH THE DATA--and models store the data in model.state.recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe--RECIPEVIEW CLASS REDERS THE RECIPE DETAILS
    recipeView.render(model.state.recipe);
  } catch (err) {
    //if there is any error encountered then this block is run
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //spinner rendered
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return; // checks whether there is a query

    // 2) Load search results--will be saved in state.search.results
    await model.loadSearchResults(query);

    // 3) Render results--getSeachResults returns the sliced array of the results to be rendered
    resultsView.render(model.getSearchResultsPage()); //sliced array

    // 4) Renders/triggers pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage)); //page no. is being sent with the call so the search result will be saved in state.search

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search); //thr results are in state.search
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view--serving will be taken care of by the serving variable in modal.state.recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark || check for old data in the bookmark array, if not there thenadd else delete
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view--update the recipeView to change the addBookmark state
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks--also add to bookmarks list to be ever rendered -makes sure when
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  //reads the bookmark data @model.state.bookmarks arrayand calls the render method of the required class "controlBookmarks" which then sens to render of parent class "view"
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data--model is called to do post request
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change  ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  //waiting for bookmarks button to be clicked
  bookmarksView.addHandlerRender(controlBookmarks);

  //it renders the recipe in detail
  recipeView.addHandlerRender(controlRecipes);

  // servings update trigger
  recipeView.addHandlerUpdateServings(controlServings);

  //wait for add bookmark
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  //waits for search triggers
  searchView.addHandlerSearch(controlSearchResults);

  //waits for the need of pagination
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init(); // always running once loaded
