describe('Blog app', function () {
  // TODO: Register user to server
  beforeEach(function () {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Duc Binh',
      username: 'Binh',
      password: '123123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  // Test if connect successfully
  it('front page can be opened', function () {
    cy.contains('Login to application')
  })

  // 5.17
  it('Login form is shown', function () {
    cy.contains('Login to application')
    cy.get("input[name='username']")
    cy.get("input[name='password']")
  })

  // 5.18
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('Binh')
      cy.get('#password').type('123123')
      cy.get('button[type="submit"]').click()
      cy.contains('Duc Binh succesfully logged in')
      cy.contains('Binh logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Binh')
      cy.get('#password').type('123456')
      cy.get('button[type="submit"]').click()

      cy.contains('wrong username or password')
        .should('have.css', 'border-color', 'rgb(249, 3, 3)')
        .and('have.css', 'background-color', 'rgb(255, 224, 222)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Binh', password: '123123' })
      cy.get('#username').type('Binh')
      cy.get('#password').type('123123')
      cy.get('button[type="submit"]').click()
    })

    // 5.19
    it('A blog can be created', function () {
      cy.contains('New Blog').click()
      cy.get('input[name="title"]').type('cypress is the best!')
      cy.get('input[name="author"]').type('Binh Nguyen')
      cy.get('input[name="url"]').type('www.cypress.com')
      cy.get('button[type="submit"]').click()

      cy.contains('cypress is the best!')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Cypress creating a new blog',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
        })
      })

      it('A user can like a blog', function () {
        cy.contains('View').click()
        cy.get('[data-cy="likes"]').should('contain', 0)
        cy.get('[data-cy="like-btn"]').click()
        cy.get('[data-cy=likes]').should('contain', 1)
      })

      it('A user who created the blog can delete it', function () {
        cy.contains('View').click()
        cy.contains('Cypress creating a new blog')
        cy.contains('Remove').click()
        cy.contains('Cypress creating a new blog').should('not.exist')
      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Cypress creating a new blog',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 15,
        })
        cy.createBlog({
          title: 'Second blog created',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 0,
        })
        cy.createBlog({
          title: 'Third blog created',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 2,
        })
      })

      it('Blogs are ordered based on number of likes, in descending order (from most likes till least likes)', function () {
        cy.get('[data-cy="blog"]').then(($blog) => {
          expect($blog).to.have.length(3)

          for (let i = 0; i < $blog.length; i++) {
            // Check if the number of likes of current blog is higher than or equal to that of next blog
            if (i < $blog.length - 1) {
              expect(
                Number($blog.find('[data-cy="likes"]')[i].innerText),
              ).to.be.least(
                Number($blog.find('[data-cy="likes"]')[i + 1].innerText),
              )
              // Check if number of likes of last blog is lower than or equal to that of first blog
            } else {
              expect(
                Number($blog.find('[data-cy="likes"]')[i].innerText),
              ).to.be.most(Number($blog.find('[data-cy="likes"]')[0].innerText))
            }
          }
        })
      })
    })
  })
})
