//load bcrypt
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user_student) {

    var User_student = user_student;
    var LocalStrategy = require('passport-local').Strategy;


    passport.serializeUser_student(function(user_student, done) {
        done(null, user.id);
    });


    // used to deserialize the user
    passport.deserializeUser_student(function(id, done) {
        User.findById(id).then(function(user_student) {
            if (user_student) {
                done(null, user.get());
            } else {
                done(user_student.errors, null);
            }
        });

    });


    passport.use('local-signup', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {


            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({ where: { email: email } }).then(function(user_student) {

                if (user_student) {
                    return done(null, false, { message: 'That email is already taken' });
                } else {
                    var user_studentPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: user_studentPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };


                    User_student.create(data).then(function(newUser_student, created) {
                        if (!newUser_student) {
                            return done(null, false);
                        }

                        if (newUser_student) {
                            return done(null, newUser_student);

                        }


                    });
                }


            });



        }



    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(

        {

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {

            var User_student = user_student;

            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }

            User_student.findOne({ where: { email: email } }).then(function(user) {

                if (!user_student) {
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user_student.password, password)) {

                    return done(null, false, { message: 'Incorrect password.' });

                }

                var user_studentinfo = user_student.get();

                return done(null, user_studentinfo);

            }).catch(function(err) {

                console.log("Error:", err);

                return done(null, false, { message: 'Something went wrong with your Signin' });


            });

        }
    ));

}
