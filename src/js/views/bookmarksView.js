import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerRender(handler) {
    //controlBookmarks@controller is triggered
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //uses the data set by the render method and returns the template
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');

    //calls the parent class to generate the markup,false makes that to not to display,only return so that we can join to make this views markup
  }
}

export default new BookmarksView();
