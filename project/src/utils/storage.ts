// Local storage utilities for simulating database operations
export class LocalStorage {
  private static getItem<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  }

  private static setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getUsers() {
    return this.getItem<any>('blog_users');
  }

  static setUsers(users: any[]) {
    this.setItem('blog_users', users);
  }

  static getPosts() {
    return this.getItem<any>('blog_posts');
  }

  static setPosts(posts: any[]) {
    this.setItem('blog_posts', posts);
  }

  static getCategories() {
    return this.getItem<any>('blog_categories');
  }

  static setCategories(categories: any[]) {
    this.setItem('blog_categories', categories);
  }

  static getComments() {
    return this.getItem<any>('blog_comments');
  }

  static setComments(comments: any[]) {
    this.setItem('blog_comments', comments);
  }

  static getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  static setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static removeAuthToken() {
    localStorage.removeItem('auth_token');
  }
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};