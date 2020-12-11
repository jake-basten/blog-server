const fs = require('fs');

const env = {
  "loadBlogFunction" : {
    "BLOG_MONGO_CONNECTION" : process.env.BLOG_MONGO_CONNECTION
  }
};

const envString = JSON.stringify(env);

fs.writeFile(__dirname + '/env.json', envString, (err) => {
  if (err) {
      throw err;
  }
  console.log("local env.json created");
});