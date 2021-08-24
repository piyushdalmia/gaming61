const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "061f3f839c89672b430cbe886262be30-us6",
  server: "us6"
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);

  const listId = "545527ca7c";
  const subscribingUser = {
      firstName: req.body.fn,
      lastName: req.body.ln,
      email: req.body.email
  };

  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });

          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );

          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
      }
  }

  run();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000")
});

// api key mailchimp
// 061f3f839c89672b430cbe886262be30-us6
//
// list id mail mailchimp
// 545527ca7c
