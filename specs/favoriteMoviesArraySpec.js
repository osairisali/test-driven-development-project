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
  searchMovies(query) {
    return this.getAllMovies()
      .filter((movie) => {
        const loweredCaseMovieTitle = (movie.title || '-').toLowerCase();
        const jammedMovieTitle = loweredCaseMovieTitle.replace(/\s/g, '');

        const loweredCaseQuery = query.toLowerCase();
        const jammedQuery = loweredCaseQuery.replace(/\s/g, '');

        return jammedMovieTitle.indexOf(jammedQuery) !== -1;
      });
  },
};

// xdescribe is used to prevent test execution in xdescribe and in xit
describe('favorite movie array contract test implementation', () => {
  afterEach(() => (favoriteMovies = []));

  itActsAsFavoriteMovieModel(FavoriteMovieArray);
});
