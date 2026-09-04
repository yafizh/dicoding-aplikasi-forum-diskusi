/**
 * Skenario pengujian end-to-end: alur login aplikasi
 *
 * - Halaman login
 *   - harus menampilkan formulir login secara utuh
 *   - harus tidak mengirim permintaan ke API ketika isian masih kosong
 *   - harus menampilkan notifikasi kesalahan ketika kata sandi salah
 *   - harus menampilkan indikator proses ketika permintaan login berjalan
 *   - harus mengarahkan pengguna ke beranda dan menyimpan token ketika
 *     kredensial benar
 *   - harus tetap masuk setelah halaman dimuat ulang
 *   - harus mengarahkan pengguna yang sudah masuk keluar dari halaman login
 *   - harus mengeluarkan pengguna dan menghapus token ketika menekan Keluar
 */

const credentials = {
  email: 'khairil@cypress.test',
  password: 'rahasia123',
};

describe('Alur login aplikasi', () => {
  beforeEach(() => {
    cy.stubForumApi();
    cy.visit('/login');
  });

  it('harus menampilkan formulir login secara utuh', () => {
    cy.contains('h1', 'Masuk ke akun Anda').should('be.visible');
    cy.get('input#email').should('be.visible').and('have.value', '');
    cy.get('input#password').should('be.visible').and('have.value', '');
    cy.get('button[type="submit"]')
        .should('be.visible')
        .and('contain.text', 'Masuk');
    cy.contains('a', 'Daftar sekarang')
        .should('have.attr', 'href', '/register');
  });

  it('harus tidak mengirim permintaan ke API ketika isian masih kosong', () => {
    cy.stubLoginSuccess();

    cy.get('button[type="submit"]').click();

    cy.get('@postLogin.all').should('have.length', 0);
    cy.location('pathname').should('eq', '/login');
  });

  it('harus menampilkan notifikasi kesalahan ketika kata sandi salah', () => {
    cy.stubLoginFailed();

    cy.fillLoginForm({email: credentials.email, password: 'kata-sandi-salah'});
    cy.get('button[type="submit"]').click();

    cy.wait('@postLogin');
    cy.get('[role="alert"]')
        .should('be.visible')
        .and('contain.text', 'email or password is wrong');
    cy.location('pathname').should('eq', '/login');
    cy.accessToken().should('be.null');
  });

  it('harus menampilkan indikator proses ketika permintaan login berjalan',
      () => {
        cy.intercept('POST', '**/v1/login', (request) => {
          request.reply({delay: 700, fixture: 'login-success.json'});
        }).as('postLogin');

        cy.fillLoginForm(credentials);
        cy.get('button[type="submit"]').click();

        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('button[type="submit"] [role="status"]').should('exist');
        cy.wait('@postLogin');
      });

  it('harus mengarahkan pengguna ke beranda ketika kredensial benar', () => {
    cy.stubLoginSuccess();

    cy.fillLoginForm(credentials);
    cy.get('button[type="submit"]').click();

    cy.wait('@postLogin').its('request.body').should('deep.equal', {
      email: credentials.email,
      password: credentials.password,
    });
    cy.wait('@getOwnProfile');

    cy.location('pathname').should('eq', '/');
    cy.contains('Khairil Cypress').should('be.visible');
    cy.get('button[aria-label="Keluar"]').should('be.visible');
    cy.contains('a', 'Bagaimana cara menguji aplikasi React?')
        .should('be.visible');
    cy.accessToken().should('not.be.null');
  });

  it('harus tetap masuk setelah halaman dimuat ulang', () => {
    cy.stubLoginSuccess();

    cy.fillLoginForm(credentials);
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');

    cy.reload();

    cy.wait('@getOwnProfile');
    cy.contains('Khairil Cypress').should('be.visible');
    cy.location('pathname').should('eq', '/');
  });

  it('harus mengarahkan pengguna yang sudah masuk keluar dari halaman login',
      () => {
        cy.stubLoginSuccess();

        cy.fillLoginForm(credentials);
        cy.get('button[type="submit"]').click();
        cy.location('pathname').should('eq', '/');

        cy.visit('/login');

        cy.location('pathname').should('eq', '/');
        cy.contains('h1', 'Masuk ke akun Anda').should('not.exist');
      });

  it('harus mengeluarkan pengguna dan menghapus token ketika menekan Keluar',
      () => {
        cy.stubLoginSuccess();

        cy.fillLoginForm(credentials);
        cy.get('button[type="submit"]').click();
        cy.location('pathname').should('eq', '/');

        cy.get('button[aria-label="Keluar"]').click();

        cy.location('pathname').should('eq', '/login');
        cy.contains('h1', 'Masuk ke akun Anda').should('be.visible');
        cy.accessToken().should('be.null');
      });
});
