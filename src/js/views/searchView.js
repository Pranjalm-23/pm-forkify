class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput(); //after getting the query clear the input field
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
    //clear the input field
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
      //controlSearchResults@controller is called
    });
  }
}

export default new SearchView();
