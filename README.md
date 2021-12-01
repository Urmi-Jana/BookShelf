# The Blog

A blog website format made with NodeJS, EJS and MongoDB.

Comes with
- Links to the Home, About and Contact Us page
- A hidden route to compose a post
- Summaries of posts displayed on the home page
- Links to the respective posts accessible by the Read More button attached to each summary

# Steps to get it up and running on your local machine

1. Install npm using the command 'npm install'.
2. Install other dependencies listed in the package.json file using npm.
3. Connect the app with the MongoDB server using the command 'mongod' in the Git Bash terminal.
4. Run the app with 'node app.js' or 'nodemon app.js'(if nodemon is installed).
5. The app will be accessible at 'localhost:3000'.

# To Check if the database is connected/working
1. Run the command 'mongo' to access the MongoDB shell in command prompt or the Git Bash terminal.
2. Type 'show db' to see the list of existing databases.
3. Select a database by typing 'use <database name>'.
4. Check the available collections by 'show collections'.
