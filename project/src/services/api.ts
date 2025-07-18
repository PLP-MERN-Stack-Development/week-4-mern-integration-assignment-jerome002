// API service layer that simulates backend operations
import { User, Post, Category, Comment, ApiResponse, PaginatedResponse, PostWithDetails } from '../types';
import { LocalStorage, generateId, generateSlug } from '../utils/storage';

// Simulated API delay for realistic experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ApiService {
  // Authentication APIs
  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(500);
    
    const users = LocalStorage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = generateId();
    LocalStorage.setAuthToken(token);
    
    const { password: _, ...userWithoutPassword } = user;
    return { 
      success: true, 
      data: { user: userWithoutPassword, token }
    };
  }

  static async register(userData: any): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(500);
    
    const users = LocalStorage.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      id: generateId(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    LocalStorage.setUsers(users);

    const token = generateId();
    LocalStorage.setAuthToken(token);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { 
      success: true, 
      data: { user: userWithoutPassword, token }
    };
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(200);
    
    const token = LocalStorage.getAuthToken();
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const users = LocalStorage.getUsers();
    const user = users[0]; // Simplified for demo
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  }

  // Posts APIs
  static async getPosts(page = 1, limit = 10, search?: string, categoryId?: string): Promise<ApiResponse<PaginatedResponse<PostWithDetails>>> {
    await delay(300);
    
    let posts = LocalStorage.getPosts();
    const users = LocalStorage.getUsers();
    const categories = LocalStorage.getCategories();
    const comments = LocalStorage.getComments();

    // Filter posts
    if (search) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      posts = posts.filter(post => post.categoryId === categoryId);
    }

    // Add related data
    const postsWithDetails = posts.map(post => {
      const author = users.find(u => u.id === post.authorId) || users[0];
      const category = categories.find(c => c.id === post.categoryId) || categories[0];
      const postComments = comments.filter(c => c.postId === post.id);
      
      return {
        ...post,
        author: { ...author, password: undefined },
        category,
        comments: postComments
      };
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = postsWithDetails.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(postsWithDetails.length / limit),
          totalItems: postsWithDetails.length,
          itemsPerPage: limit
        }
      }
    };
  }

  static async getPostById(id: string): Promise<ApiResponse<PostWithDetails>> {
    await delay(200);
    
    const posts = LocalStorage.getPosts();
    const users = LocalStorage.getUsers();
    const categories = LocalStorage.getCategories();
    const comments = LocalStorage.getComments();

    const post = posts.find(p => p.id === id);
    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    const author = users.find(u => u.id === post.authorId) || users[0];
    const category = categories.find(c => c.id === post.categoryId) || categories[0];
    const postComments = comments.filter(c => c.postId === post.id);

    return {
      success: true,
      data: {
        ...post,
        author: { ...author, password: undefined },
        category,
        comments: postComments
      }
    };
  }

  static async createPost(postData: any): Promise<ApiResponse<Post>> {
    await delay(400);
    
    const posts = LocalStorage.getPosts();
    const newPost = {
      id: generateId(),
      title: postData.title,
      slug: generateSlug(postData.title),
      content: postData.content,
      excerpt: postData.content.substring(0, 200) + '...',
      featuredImage: postData.featuredImage,
      authorId: postData.authorId,
      categoryId: postData.categoryId,
      status: postData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    LocalStorage.setPosts(posts);

    return { success: true, data: newPost };
  }

  static async updatePost(id: string, postData: any): Promise<ApiResponse<Post>> {
    await delay(400);
    
    const posts = LocalStorage.getPosts();
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return { success: false, error: 'Post not found' };
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString()
    };

    LocalStorage.setPosts(posts);

    return { success: true, data: posts[postIndex] };
  }

  static async deletePost(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    
    const posts = LocalStorage.getPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    
    LocalStorage.setPosts(filteredPosts);

    return { success: true };
  }

  // Categories APIs
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay(200);
    
    const categories = LocalStorage.getCategories();
    return { success: true, data: categories };
  }

  static async createCategory(categoryData: any): Promise<ApiResponse<Category>> {
    await delay(300);
    
    const categories = LocalStorage.getCategories();
    const newCategory = {
      id: generateId(),
      name: categoryData.name,
      slug: generateSlug(categoryData.name),
      description: categoryData.description,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    LocalStorage.setCategories(categories);

    return { success: true, data: newCategory };
  }

  // Comments APIs
  static async createComment(commentData: any): Promise<ApiResponse<Comment>> {
    await delay(300);
    
    const comments = LocalStorage.getComments();
    const newComment = {
      id: generateId(),
      postId: commentData.postId,
      authorId: commentData.authorId,
      content: commentData.content,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    LocalStorage.setComments(comments);

    return { success: true, data: newComment };
  }
}