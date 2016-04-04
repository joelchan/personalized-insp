# CrowdIdeation
=============
Explores group/crowd Ideation


# Dependencies
=============
* Node.js
* Meteor
* moment
* fontawesome4
* pince



# Install directions
=====================
1. Install Node.js
2. Install npm (node package manager)
3. Install Meteor curl https://install.meteor.com | /bin/sh
4. Clone git repo
5. Run app as below

# Run Directions
===================
To run locally, enter the root git directory and execute using the simple meteor command.

```
> cd personalized-insp
> meteor
```

If you are successful, you should see the following sequence of messages in your terminal:
```
[[[[[ ~/Projects/personalized-insp ]]]]]      

=> Started proxy.                             
=> Meteor 1.2.1 is available. Update this project with 'meteor update'.
=> Started MongoDB.                           
=> Started your app.                          

=> App running at: http://localhost:3000/
```
Navigate to the local host port that is serving the meteor app (e.g., localhost:3000).

# Heroku directions
===================
To setup this project within your own heroku account, you'll need
an external db such as those supplied by compose.io and have setup
a db along with a user for that db.

1. Install the heroku toolbelt (https://toolbelt.heroku.com)
2. Setup the heroku app with environment variables
```
> heroku login 
> heroku create <app-name> --stack cedar --buildpack https://github.com/djhi/heroku-buildpack-meteorite 
> heroku create <app-name> --stack cedar --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git#mongohq
> heroku config:set --app <app-name> MONGO_URL=mongodb://<mongo-user:<pswd@<url_to_mongodb>:<mongodb_port>/<remainder_of_url>
> heroku config:set --app <app_name> ROOT_URL=http://<app_name>.herokuapp.com
```
3. From within the personalized-insp project, add the git repo provided by heroku for your app
```
> git remote add heroku git@heroku.com:<app_name>.git
> git push heroku master
```
4. Start the app
```
> heroku logs --app <app_name>
```


