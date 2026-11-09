const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('rvf_token') || '';
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem('rvf_token', token);
  if (user) localStorage.setItem('rvf_user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('rvf_token');
  localStorage.removeItem('rvf_user');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('rvf_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Users (Admin only)
  getUsers: () => request('/users'),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),

  // Public
  getPublicPlans: () => request('/public/plans'),
  getPublicTrainers: () => request('/public/trainers'),
  getPublicGymInfo: () => request('/public/gym-info'),

  // Trainer Portal
  getTrainerDashboard: () => request('/trainer/dashboard'),
  getTrainerMembers: () => request('/trainer/members'),
  getTrainerMemberDetails: (id) => request(`/trainer/members/${id}`),
  getTrainerProfile: () => request('/trainer/profile'),
  updateTrainerProfile: (data) => request('/trainer/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Member Portal
  getMemberDashboard: () => request('/member/dashboard'),
  getMemberProfile: () => request('/member/profile'),
  updateMemberProfile: (data) => request('/member/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getMemberMembership: () => request('/member/membership'),
  getMemberPayments: () => request('/member/payments'),
  getMemberWorkout: () => request('/member/workout'),
  getMemberDiet: () => request('/member/diet'),
  getMemberProgress: () => request('/member/progress'),
  createMemberProgress: (data) => request('/member/progress', { method: 'POST', body: JSON.stringify(data) }),
  getMemberAttendance: () => request('/member/attendance'),

  // Admin Portal & Shared APIs
  getHealth: () => request('/health'),
  getMembers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/members${q ? `?${q}` : ''}`);
  },
  getMember: (id) => request(`/members/${id}`),
  createMember: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),

  getTrainers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/trainers${q ? `?${q}` : ''}`);
  },
  createTrainer: (data) => request('/trainers', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id, data) => request(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getPlans: () => request('/membership-plans'),
  createPlan: (data) => request('/membership-plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => request(`/membership-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getMemberMemberships: () => request('/member-memberships'),
  assignMembership: (data) => request('/member-memberships', { method: 'POST', body: JSON.stringify(data) }),

  getPayments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/payments${q ? `?${q}` : ''}`);
  },
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),

  getAttendance: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/attendance${q ? `?${q}` : ''}`);
  },
  markAttendance: (data) => request('/attendance', { method: 'POST', body: JSON.stringify(data) }),

  getWorkoutPlans: () => request('/workout-plans'),
  createWorkoutPlan: (data) => request('/workout-plans', { method: 'POST', body: JSON.stringify(data) }),

  getDietPlans: () => request('/diet-plans'),
  createDietPlan: (data) => request('/diet-plans', { method: 'POST', body: JSON.stringify(data) }),

  getProgressRecords: () => request('/progress-records'),
  createProgressRecord: (data) => request('/progress-records', { method: 'POST', body: JSON.stringify(data) }),

  getDashboardStats: () => request('/dashboard/stats'),
  getDashboardCharts: () => request('/dashboard/charts'),

  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'POST' }),

  getReports: () => request('/reports'),
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
