class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "f1f1dbab-8e17-48d3-a098-d77dfd6ea3c5",
      },
    }).then((res) => res.json());
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }
  // other methods for working with the API
}

export default Api;
