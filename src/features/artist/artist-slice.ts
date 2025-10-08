import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SpotifyArtist } from '@/types/spotify';
import { initialArtistState } from './artist-types';

/**
 * Artist Redux Slice
 *
 * Purpose: Manages artist selection and Spotify API data
 *
 * Reducers:
 * - setCurrentArtist: Set the selected artist (from local search results)
 * - clearCurrentArtist: Clear artist selection
 * - setLoading: Update loading state
 * - setError: Set error message
 *
 * Async Thunks (to be added later):
 * - fetchArtist: Fetch full artist data from Spotify API
 *
 * Usage:
 *   dispatch(setCurrentArtist(artist))
 *   dispatch(fetchArtist(artistId))
 */

const artistSlice = createSlice({
  name: 'artist',
  initialState: initialArtistState,
  reducers: {
    /**
     * Set the currently selected artist
     * This is typically called when user selects an artist from search results
     */
    setCurrentArtist: (state, action: PayloadAction<SpotifyArtist>) => {
      state.currentArtist = action.payload;
      state.error = null;
    },

    /**
     * Clear the current artist selection
     * This resets the artist view
     */
    clearCurrentArtist: (state) => {
      state.currentArtist = null;
      state.error = null;
    },

    /**
     * Update loading state
     * Used by async thunks to indicate fetch progress
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     * Used when Spotify API calls fail
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  // extraReducers will be added here when fetchArtist thunk is implemented
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchArtist.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchArtist.fulfilled, (state, action) => {
  //       state.currentArtist = action.payload;
  //       state.loading = false;
  //     })
  //     .addCase(fetchArtist.rejected, (state, action) => {
  //       state.error = action.error.message || 'Failed to fetch artist';
  //       state.loading = false;
  //     });
  // },
});

export const { setCurrentArtist, clearCurrentArtist, setLoading, setError } =
  artistSlice.actions;

export default artistSlice.reducer;
