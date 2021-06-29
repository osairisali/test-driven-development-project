const itActsAsFavoriteMovieModel = (favoriteMovie) => {
  it('should return the movie that has been added', async () => {
    favoriteMovie.putMovie({ id: 1 });
    favoriteMovie.putMovie({ id: 2 });

    expect(await favoriteMovie.getMovie(1)).toEqual({ id: 1 });

    expect(await favoriteMovie.getMovie(2)).toEqual({ id: 2 });

    expect(await favoriteMovie.getMovie(3)).toEqual(undefined);
  });

  it('should refuse adding movie with incorrect property', async () => {
    await favoriteMovie.putMovie({ aProperty: 1 });

    expect(await favoriteMovie.getAllMovies()).toEqual([]);
  });

  it('can return all movies that have been added', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });

    expect(await favoriteMovie.getAllMovies()).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should remove favorite movie', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });
    await favoriteMovie.putMovie({ id: 3 });

    await favoriteMovie.deleteMovie(1);

    expect(await favoriteMovie.getAllMovies()).toEqual([{ id: 2 }, { id: 3 }]);
  });

  it('should handle request to remove a movie even though the movie has not been added', async () => {
    await favoriteMovie.putMovie({ id: 1 });
    await favoriteMovie.putMovie({ id: 2 });
    await favoriteMovie.putMovie({ id: 3 });

    await favoriteMovie.deleteMovie(4);
    await favoriteMovie.deleteMovie(3);

    expect(await favoriteMovie.getAllMovies()).toEqual([{ id: 1 }, { id: 2 }]);
  });
};

export { itActsAsFavoriteMovieModel };
