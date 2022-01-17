import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */
  render(data, render = true) {
    // checks the data comming from model->controller->view"classes"
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //makes data avilable to the called class
    this._data = data;
    //markup generated
    const markup = this._generateMarkup();

    if (!render) return markup; //the markup is returned and will be joined in the respectiveclass,and put to the innerhtml

    this._clear();
    //old markup is cleared and new markup is added
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //hence displayed
  }

  update(data) {
    this._data = data;
    //generated the current DOM
    const newMarkup = this._generateMarkup();
    //generatig the NEWDOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // getting the elements fro old DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //getting the elements from new DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //elments updated in the newDOM
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    //the given objects markup is cleared
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
