# Campus Bites

Campus Bites is a restaurant review web application for Ontario Tech University students. Students can share affordable meals near campus, including restaurant names, dishes, prices, ratings, and comments.

## Technologies

- Node.js and Express
- Express Generator
- EJS templates
- MongoDB Atlas and Mongoose
- HTML and CSS

## Main Features

- Homepage with the Campus Bites logo
- Form to submit restaurant reviews
- Required-field, price, and rating validation
- MongoDB database storage
- Review table with newest reviews first
- Empty-state message when no reviews exist

## Running Locally

1. Install Node.js.
2. Clone the GitHub repository.
3. Run `npm install`.
4. Create a `.env` file in the project root.
5. Set `MONGODB_URI` to your own MongoDB Atlas connection string.
6. Run `npm start`.
7. Open http://localhost:3000.

Do not commit the `.env` file or share database credentials.

## Deployment

The application is deployed on Render.

Live website:
https://campus-bites-infr3120.onrender.com

Render configuration:
- Runtime: Node.js
- Build command: npm install
- Start command: npm start
- Environment variable: MONGODB_URI

## Team Contributions

Ammar: Homepage, logo, styling, and layout.

Waseedullah: Review form and input validation.

Hamza: MongoDB model, persistence, review retrieval, ordering, empty-state handling, form-storage integration, testing, and cloud deployment.

## Code Sources and Acknowledgments

Course Materials:
- INFR3120U Web and Scripting Programming lecture examples
  and tutorials covering Express, EJS, MongoDB, and CRUD
  operations.

Development Assistance:
- OpenAI ChatGPT was used to assist with debugging,
  reviewing code, and Git integration
