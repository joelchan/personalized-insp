# CrowdIdeation
=============
Explores group/crowd Ideation


# Dependencies
=============
Node.js
Meteor 0.8
Metoerite
iron-router
crypto-base
moment
nvd3js
fontawesome4
pince
mocha-web



# Install directions
=====================
1. Install Node.js
2. Install npm (node package manager)
3. Install Metoerite (http://oortcloud.github.io/meteorite/)
4. Install iron-router with meteorite (https://github.com/EventedMind/iron-router)
4. Install crypto-base with meteorite (http://atmospherejs.com/package/crypto-base)

# Run Directions
===================
To run locally, just enter the brainstorm directory and run meteor

```
> cd brainstorm
> meteor
```

To run with live tests, you will have to build the environment first time you run the tests:

```
> cd brainstorm
> METEOR_MOCHA_TEST_DIRS="../tests" meteor rebuild-all
```

After rebuilding (or if you have already built, then you can run the meteor server with tests wiht this command:

```
> METEOR_MOCHA_TEST_DIRS="../tests" mrt
```

Anytime you add a test file you will have to rebuilt, but if you just modiy existing test files, you do not need to rebuild.  To view the test results, you can go to http://localhost:3000/test.  These tests will rerun everytime the server restarts.
