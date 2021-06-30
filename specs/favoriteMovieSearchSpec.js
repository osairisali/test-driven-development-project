/* eslint-disable class-methods-use-this */
import FavoriteMovieSearchPresenter from '../src/scripts/views/pages/favorite-movie-search-presenter';
import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import FavoriteMovieSearchView from '../src/scripts/views/pages/liked-movies/favorite-movie-search-view';

describe('searching movies', () => {
  let presenter;
  let favoriteMovies;
  let view;

  const searchMovies = (query) => {
    const queryElement = document.querySelector('#query');
    queryElement.value = query;
    queryElement.dispatchEvent(new Event('change'));
  };

  const setMovieSearchContainer = () => {
    view = new FavoriteMovieSearchView();
    console.log('view instance: ', view);
    document.body.innerHTML = view.getTemplate();
  };

  const constructPresenter = () => {
    // mocking searchMovies function
    // spyOn(FavoriteMovieIdb, 'searchMovies');
    favoriteMovies = spyOnAllFunctions(FavoriteMovieIdb);
    // presenter = new FavoriteMovieSearchPresenter({ favoriteMovies: FavoriteMovieIdb });
    presenter = new FavoriteMovieSearchPresenter({ favoriteMovies, view });
  };

  beforeEach(() => {
    setMovieSearchContainer();
    constructPresenter();
  });

  describe('when query is not empty', () => {
    it('should be able to capture the query by the user', () => {
      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
      ]);

      searchMovies('film a');

      expect(presenter.latestQuery).toEqual('film a');
    });

    // use fit to focus on one test. usually used with mock
    // uninitialized object or method along with the use of spyOn
    it('should ask the model to search for liked movies', (done) => {
      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
      ]);

      searchMovies('film a');

      expect(favoriteMovies.searchMovies).toHaveBeenCalledWith('film a');
      done();
    });

    it('should show - when the movie returned does not contain a title', (done) => {
      document.querySelector('#movies').addEventListener('movies:updated', () => {
        const movieTitles = document.querySelectorAll('.movie__title');
        expect(movieTitles.item(0).textContent).toEqual('-');
        done();
      });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([{ id: 444 }]);

      searchMovies('film a');
    });

    it('should show the movies found by Favorite Movies', (done) => {
    // custom event firing to catch asynchronous .movie elements
    // this happens as the test is finished first while Presenster is not done yet
      document.getElementById('movies')
        .addEventListener('movies:updated', () => {
          expect(document.querySelectorAll('.movie-item').length).toEqual(3);
          done();
        });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
        { id: 222, title: 'ada juga film abcde' },
        { id: 333, title: 'ini juga boleh film a' },
      ]);

      searchMovies('film a');
    });

    it('should show the name of the movies found by Favorite Movies', (done) => {
      document.getElementById('movies').addEventListener('movies:updated', () => {
        const movieTitles = document.querySelectorAll('.movie__title');
        expect(movieTitles.item(0).textContent).toEqual('film abc');
        expect(movieTitles.item(1).textContent).toEqual('ada juga film abcde');
        expect(movieTitles.item(2).textContent).toEqual('ini juga boleh film a');

        done();
      });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([
        { id: 111, title: 'film abc' },
        { id: 222, title: 'ada juga film abcde' },
        { id: 333, title: 'ini juga boleh film a' },
      ]);

      searchMovies('film a');
    });
  });

  describe('when query is empty', () => {
    it('should capture the query as empty', () => {
      searchMovies(' ');

      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('    ');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('\t');
      expect(presenter.latestQuery.length).toEqual(0);
    });

    // test with empty query should show all favorite movies
    it('should show all favorite movies', () => {
      searchMovies('    ');

      expect(favoriteMovies.getAllMovies).toHaveBeenCalled();

      // to test the method have been called for several times
      expect(favoriteMovies.getAllMovies).toHaveBeenCalledTimes(1);
    });
  });

  describe('when no favorite movies could be found', () => {
    it('should show the empty message', (done) => {
      document.querySelector('#movies').addEventListener('movies:updated', () => {
        expect(document.querySelectorAll('.movie-item__not__found').length).toEqual(1);
        done();
      });

      favoriteMovies.searchMovies.withArgs('film a').and.returnValues([]);

      searchMovies('film a');
    });
  });
});
