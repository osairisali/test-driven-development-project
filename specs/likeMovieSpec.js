import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helper/testFactories';

describe('liking a movie', () => {
  const addLikeButtonContainer = () => {
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  };

  beforeEach(() => {
    addLikeButtonContainer();
  });

  it('should show the like button when the movie has bot been liked before', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(
      document.querySelector('[aria-label="like this movie"]'),
    ).toBeTruthy();
  });

  it('should not show the unlike button when the movie has not been liked before', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(
      document.querySelector('[aria-label="unlike this movie"]'),
    ).toBeFalsy();
  });

  it('should be able to like the movie', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    // simulating click event in #likeButton
    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    // test if movie stored in idb
    const movie = await FavoriteMovieIdb.getMovie(1);

    expect(movie).toEqual({ id: 1 });

    // delete stored movie data for other test usages
    await FavoriteMovieIdb.deleteMovie(1);
  });

  it('should not add a movie again when it is already liked', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    // store movie to idb first
    await FavoriteMovieIdb.putMovie({ id: 1 });

    // simulating unlike click on #likeButton
    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    // check if movie stored is not duplicated
    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([{ id: 1 }]);

    await FavoriteMovieIdb.deleteMovie(1);
  });

  // use xit rather than it if error to be expected when tested code doesn't provide error handler
  //   xit("should not add a movie with no id", async () => {
  //     // id intentionally filled blank
  //     await LikeButtonInitiator.init({
  //       likeButtonContainer: document.querySelector("#likeButtonContainer"),
  //       movie: {},
  //     });

  //     document.querySelector("likeButton").dispatchEvent(new Event("click"));

  //     expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
  //   });

  it('should not add a movie with no id', async () => {
    // id intentionally filled blank
    await TestFactories.createLikeButtonPresenterWithMovie({});

    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
  });
});
