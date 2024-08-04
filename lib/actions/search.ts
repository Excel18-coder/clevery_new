import axios from 'axios';
import { handleApiError } from './error';
import { Post, Server, User } from '@/types';
import { endpoint } from '../env';

/**
 * Represents a post in the search results.
 */
type PostResult = Pick<Post, 'id' | 'content' | 'tags' | 'createdAt'> & {
  author: Pick<User, 'id' | 'name' | 'username' | 'image'>;
};

/**
 * Represents a user in the search results.
 */
type UserResult = Pick<User, 'id' | 'name' | 'username' | 'image' | 'bio'>;

/**
 * Represents a server in the search results.
 */
type ServerResult = Pick<Server, 'id' | 'name' | 'image' | 'description' | 'slug'>;

/**
 * Maps search types to their corresponding result interfaces.
 */
type SearchResultMap = {
  posts: PostResult[];
  users: UserResult[];
  servers: ServerResult[];
};

/**
 * Generic type for search results based on the search type.
 */
type SearchResult<T extends keyof SearchResultMap> = SearchResultMap[T];

/**
 * Performs a search based on the given parameters.
 * @param query - The search query string.
 * @param type - The type of search to perform: 'posts', 'users', or 'servers'.
 * @returns A promise that resolves to the API response containing the search results.
 * @throws Error with a descriptive message if the request fails.
 */
async function search<T extends 'posts' | 'users' | 'servers'>(
  query: string,
  type: T
): Promise<SearchResult<T>> {
  try {
    const response = await axios.get<SearchResult<T>>(`${endpoint}/search`, {
      params: { query, type }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, `Search failed for ${type}`);
  }
}

/**
 * searchApi provides methods to perform searches for posts, users, and servers.
 */
const searchApi = {
  /**
   * Performs a search for all the search types.
   * @param query - The search query string.
   * @returns A promise that resolves to an API response containing all the search results.
   * @throws Error with a descriptive message if the request fails.
   */
  search: async (query: string): Promise<SearchResultMap> => {
    try {
      const response = await axios.get<SearchResultMap>(`${endpoint}/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Search failed for all types");
    }
  },
  
  /**
   * Performs a search for posts.
   * @param query - The search query string.
   * @returns A promise that resolves to an API response containing an array of PostResult.
   * @throws Error with a descriptive message if the request fails.
   */
  searchPosts: (query: string) => search<'posts'>(query, 'posts'),

  /**
   * Performs a search for users.
   * @param query - The search query string.
   * @returns A promise that resolves to an API response containing an array of UserResult.
   * @throws Error with a descriptive message if the request fails.
   */
  searchUsers: (query: string) => search<'users'>(query, 'users'),

  /**
   * Performs a search for servers.
   * @param query - The search query string.
   * @returns A promise that resolves to an API response containing an array of ServerResult.
   * @throws Error with a descriptive message if the request fails.
   */
  searchServers: (query: string) => search<'servers'>(query, 'servers'),
};

/**
 * Handles API errors and returns a more informative error message
 * @param error - The error object from the API call
 * @param defaultMessage - A default message to use if a more specific one can't be determined
 * @returns An Error object with a descriptive message
 */


export default searchApi;
