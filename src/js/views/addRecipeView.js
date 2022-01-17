import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    //✔️✔️✔️✔️✔️✔️✔️✔️this is the fuction which is triggered when add recipe button is clicked, only then the form is launched✔️✔️✔️✔️✔️✔️✔️✔️

    //using toggleWindow the the hidden class is added or removed
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    //using toggleWindow the the hidden class is added or removed

    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //gets all the form data in the array
      const dataArr = [...new FormData(this)];
      //array entries->object
      const data = Object.fromEntries(dataArr);

      handler(data);
      //controlAddRecipe() is to be called
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
