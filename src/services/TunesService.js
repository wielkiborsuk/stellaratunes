/* global fetch */
import { API_URL } from '../utils/constants';

class TuneService {
  getData(query) {
    return fetch(`${API_URL}?term=${query}`)
      .then(response => response.json())
      .then(data => data.results)
      .catch((error) => {
        console.log(error);
      });
  }
}

export default TuneService;
