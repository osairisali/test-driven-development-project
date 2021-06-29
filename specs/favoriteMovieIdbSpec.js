import { itActsAsFavoriteMovieModel } from './contract/favoriteMovieContract';
import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';

describe('Favorite movie IDB contract test implementation', () => {
  afterEach(async () => {
    const movies = await FavoriteMovieIdb.getAllMovies();

    // it is running in sequence. don't use forEach as it works unexpectedly
    // for (let { id } of movies) {
    //   await FavoriteMovieIdb.deleteMovie(id);
    // }

    await Promise.all(
      movies.map(async ({ id }) => {
        await FavoriteMovieIdb.deleteMovie(id);
      }),
    );
  });

  it(itActsAsFavoriteMovieModel(FavoriteMovieIdb));
});
