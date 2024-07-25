/**
 * SearchClient provides methods to perform searches for posts, users, and servers.
 */
class SearchClient {
  private baseUrl: string;

  /**
   * Creates a new SearchClient instance.
   * @param baseUrl - The base URL of the API endpoint.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Performs a search based on the given parameters.
   * @param query - The search query string.
   * @param type - The type of search to perform: 'posts', 'users', or 'servers'.
   * @param userId - The ID of the user performing the search.
   * @returns A promise that resolves to the search results.
   * @throws An error if the search fails.
   */
  async search<T extends 'posts' | 'users' | 'servers'>(
    query: string,
    type: T,
    userId: string
  ): Promise<SearchResult<T>> {
    const url = new URL(`${this.baseUrl}/api/search`);
    url.searchParams.append('query', query);
    url.searchParams.append('type', type);
    url.searchParams.append('userId', userId);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results as SearchResult<T>;
  }
}

/**
 * Represents a post in the search results.
 */
interface PostResult {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
}

/**
 * Represents a user in the search results.
 */
interface UserResult {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string | null;
}

/**
 * Represents a server in the search results.
 */
interface ServerResult {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  slug: string;
}

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

// Usage example:
const searchClient = new SearchClient('https://api.example.com');

async function performSearch() {
  try {
    const postResults = await searchClient.search('nextjs', 'posts', 'user123');
    console.log('Post results:', postResults);

    const userResults = await searchClient.search('john', 'users', 'user123');
    console.log('User results:', userResults);

    const serverResults = await searchClient.search('gaming', 'servers', 'user123');
    console.log('Server results:', serverResults);
  } catch (error) {
    console.error('Search failed:', error);
  }
}