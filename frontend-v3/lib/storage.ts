// Simple localStorage utilities for Alpha

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export function saveUser(user: any, token: string) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userId', user.id);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

