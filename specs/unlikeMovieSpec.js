import * as TestFactories from "./helper/testFactories";
import FavoriteMovieIdb from "../src/scripts/data/favorite-movie-idb";

const addLikeButtonContainer = () => {
  document.body.innerHTML = '<div id="likeButtonContainer"></div>';
};

describe("unliking a movie", () => {
  // make sure to add movie data to idb for each test
  beforeEach(async () => {
    addLikeButtonContainer();
    await FavoriteMovieIdb.putMovie({ id: 1 });
  });

  // make sure to remove movie data to idb for each test
  afterEach(async () => {
    await FavoriteMovieIdb.deleteMovie(1);
  });

  it("should display unlike widget when the movie has been liked", async () => {
    // we still need to provide movie id as initiator of likeButton, even we provide it in beforeEach function
    // that is why we need to check our code doesn't dupclitaing the stored movie with same id in likeMovieSpec.js
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(
      document.querySelector('[aria-label="unlike this movie"]')
    ).toBeTruthy();
  });

  it("should not display like widget when the movie has been liked", async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(
      document.querySelector('[aria-label="like this movie"]')
    ).toBeFalsy();
  });

  it("should be able to remove liked movie from the list", async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    // pay attention to querySelector here. Don't refer to #likeButton for unliking movie event
    document
      .querySelector('[aria-label="unlike this movie"]')
      .dispatchEvent(new Event("click"));

    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
  });

  it("should not throw error if the unliked movie is not in the list", async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    // simulate deleting movie with id 1 first
    await FavoriteMovieIdb.deleteMovie(1);

    // simulating delete the same movie id
    document
      .querySelector('[aria-label="unlike this movie"]')
      .dispatchEvent(new Event("click"));

    // check if movie with id 1 still in movie database
    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
  });
});
