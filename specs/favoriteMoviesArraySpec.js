import { itActsAsFavoriteMovieModel } from './contract/favoriteMovieContract';

let favoriteMovies = [];

const FavoriteMovieArray = {
  getMovie(id) {
    if (!id) return;

    return favoriteMovies.find((movie) => movie.id === id);
  },
  getAllMovies() {
    return favoriteMovies;
  },
  putMovie(movie) {
    if (!movie.id) return;

    const isMovieExist = this.getMovie(movie.id);
    if (isMovieExist) return;

    favoriteMovies.push(movie);
  },
  deleteMovie(id) {
    if (!id) return;

    favoriteMovies = favoriteMovies.filter((movie) => movie.id !== id);
  },
};

describe('favorite movie array contrat test implementation', () => {
  afterEach(() => (favoriteMovies = []));

  itActsAsFavoriteMovieModel(FavoriteMovieArray);
});
