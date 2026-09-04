/**
 * Perintah custom Cypress.
 *
 * Seluruh permintaan ke Dicoding Forum API distub agar pengujian
 * end-to-end bersifat deterministik dan tidak bergantung pada jaringan
 * maupun akun yang benar-benar terdaftar.
 */

const API_URL = 'https://forum-api.dicoding.dev/v1';

Cypress.Commands.add('stubForumApi', () => {
  cy.intercept('GET', `${API_URL}/users`, {fixture: 'users.json'})
      .as('getUsers');
  cy.intercept('GET', `${API_URL}/threads`, {fixture: 'threads.json'})
      .as('getThreads');
  cy.intercept('GET', `${API_URL}/leaderboards`, {
    fixture: 'leaderboards.json',
  }).as('getLeaderboards');
  cy.intercept('GET', `${API_URL}/users/me`, {fixture: 'own-profile.json'})
      .as('getOwnProfile');
});

Cypress.Commands.add('stubLoginSuccess', () => {
  cy.intercept('POST', `${API_URL}/login`, {
    statusCode: 200,
    fixture: 'login-success.json',
  }).as('postLogin');
});

Cypress.Commands.add('stubLoginFailed', () => {
  cy.intercept('POST', `${API_URL}/login`, {
    statusCode: 401,
    fixture: 'login-failed.json',
  }).as('postLogin');
});

Cypress.Commands.add('fillLoginForm', ({email, password}) => {
  cy.get('input#email').clear();
  cy.get('input#email').type(email);
  cy.get('input#password').clear();
  cy.get('input#password').type(password);
});

Cypress.Commands.add('accessToken', () =>
  cy.window().its('localStorage').invoke('getItem', 'forum-app/accessToken'),
);
