import React, { Component } from 'react';
import Header from '../Header';
import Songs from '../Songs';
import Favourites from '../Favourites';
import Loader from '../Loader';
import TunesService from '../../services/TunesService';
import StorageService from '../../services/StorageService';

class Page extends Component {
  constructor() {
    super();
    this.tunesService = new TunesService();
    this.storageService = new StorageService();

    this.state = {
      songs: [],
      favourites: this.storageService.loadFavourites(),
      query: '',
      loading: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.addSongToFavourites = this.addSongToFavourites.bind(this);
    this.removeFavourite = this.removeFavourite.bind(this);

    console.log(this.state.favourites);
  }

  componentDidMount() {
    this.tunesService.getData(this.state.query).then((data) => {
      // leave this - it's a part of the task #9
      console.log(data);
      this.setState({ songs: data, loading: false });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.favourites !== this.state.favourites) {
      this.storageService.storeFavourites(this.state.favourites);
    }
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleButtonClick() {
    this.setState({ loading: true });
    this.tunesService.getData(this.state.query).then((data) => {
      this.setState({ songs: data, loading: false });
    });
  }

  addSongToFavourites(song) {
    this.setState(previousState => ({
      favourites: (!previousState.favourites.find(f => song.trackId === f.trackId)
        ? previousState.favourites.concat(song)
        : previousState.favourites)
    }));
  }

  removeFavourite(song) {
    this.setState(previousState => ({
      favourites: previousState.favourites.filter(f => f !== song)
    }));
  }

  render() {
    const content = (
      this.state.loading ?
        <Loader /> :
        (
          <Songs
            songs={this.state.songs}
            addSongToFavourites={this.addSongToFavourites}
          />
        )
    );
    return (
      <div className="container">
        <Header
          query={this.state.query}
          onInputChange={this.handleInputChange}
          onButtonClick={this.handleButtonClick}
        />
        { content }
        {/* When songs are being loaded the Loader component should be shown */}
        <Favourites favourites={this.state.favourites} removeFavourite={this.removeFavourite} />
        {/* Favourites should be saved to localstorage */}
        {/* On page refresh they should be added to state */}
      </div>
    );
  }
}

export default Page;
