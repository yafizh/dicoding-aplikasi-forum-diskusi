const BASE_URL = 'https://forum-api.dicoding.dev/v1';
const ACCESS_TOKEN_KEY = 'forum-app/accessToken';

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function request(path, config = {}) {
  const {method = 'GET', body, auth = false} = config;
  const options = {method};

  if (body !== undefined) {
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify(body);
  }

  const doFetch = auth ? fetchWithAuth : fetch;
  const response = await doFetch(`${BASE_URL}${path}`, options);
  const json = await response.json();

  if (json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan pada server.');
  }

  return json.data;
}

async function register({name, email, password}) {
  const data = await request('/register', {
    method: 'POST',
    body: {name, email, password},
  });
  return data.user;
}

async function login({email, password}) {
  const data = await request('/login', {
    method: 'POST',
    body: {email, password},
  });
  return data.token;
}

async function getOwnProfile() {
  const data = await request('/users/me', {auth: true});
  return data.user;
}

async function getAllUsers() {
  const data = await request('/users');
  return data.users;
}

async function getAllThreads() {
  const data = await request('/threads');
  return data.threads;
}

async function getThreadDetail(threadId) {
  const data = await request(`/threads/${threadId}`);
  return data.detailThread;
}

async function createThread({title, body, category}) {
  const data = await request('/threads', {
    method: 'POST',
    auth: true,
    body: {title, body, category},
  });
  return data.thread;
}

async function createComment({threadId, content}) {
  const data = await request(`/threads/${threadId}/comments`, {
    method: 'POST',
    auth: true,
    body: {content},
  });
  return data.comment;
}

async function voteThread({threadId, voteType}) {
  const data = await request(`/threads/${threadId}/${voteType}-vote`, {
    method: 'POST',
    auth: true,
  });
  return data.vote;
}

async function voteComment({threadId, commentId, voteType}) {
  const path =
    `/threads/${threadId}/comments/${commentId}/${voteType}-vote`;
  const data = await request(path, {method: 'POST', auth: true});
  return data.vote;
}

async function getLeaderboards() {
  const data = await request('/leaderboards');
  return data.leaderboards;
}

const api = {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  voteThread,
  voteComment,
  getLeaderboards,
};

export default api;
