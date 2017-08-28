var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ejs = require('ejs');
var engine = require('ejs-mate');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');

var User = require('./models/user');
var Gantt = require('./models/gantt');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gannt');

app.use(express.static('static'));
app.use(express.static('assets'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());

app.locals.moment = moment;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, false, req.flash('error', 'User With Email Already Exist.'));
        }

        var newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            return done(null, newUser);
        })
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }

        var messages = [];
        if (!user || !user.validPassword(password)) {
            messages.push('Email does not exist or password is invalid!');
            return done(null, false, req.flash('error', messages));
        }

        return done(null, user);
    })
}));


// app.get('/', (req, res) => {
//     res.render('../index', {gantt: false});
// });

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: false
}));

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));

app.get('/', (req, res) => {
    res.render('gantt/create_gantt');
});

app.post('/', (req, res) => {
    console.log(req.body);
    async.waterfall([
        function (callback) {
            var gantt = new Gantt();
            gantt.ganttName = req.body.ganttName;
            gantt.save((err, data) => {
                callback(err, data);
            })
        },
        function (data, callback) {
            Gantt.update(
                {
                    _id: data._id
                }
                ,
                {
                    $push: {
                        project: {
                            name: req.body.projectName,
                            values: [
                                {
                                    from: req.body.projectStart,
                                    to: req.body.projectEnd,
                                    label: req.body.projectName
                                }
                            ]
                        }
                    }
                },
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(1);
                    res.redirect('/gantt/' + data._id);
                }
            )
        }
    ]);
});

app.get('/gantt/:ganttId', (req, res) => {
    Gantt.findOne({_id: req.params.ganttId}, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.render('gantt/gantt_view', { data: data});
    })
});

app.post('/gantt/:ganttId', (req, res) => {
    async.waterfall([
        function(callback) {
            Gantt.findOne({_id: req.params.ganttId}, (err, data) => {
                callback(err, data);
            })
        },
        function(data, callback) {
            if (req.body.dataType === 'newProject') {
                data.project.push({
                    name: req.body.projectName,
                });
                data.project[data.project.length-1].values.push({
                    from: req.body.from,
                    to: req.body.to,
                    label: req.body.projectName
                });
                data.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send({projectId: data.project[data.project.length-1]._id});
                });
            } else if (req.body.dataUpdate !== 'true') {
                var project = data.project.find(function (project) {
                    return project._id.equals(req.body.projectId);
                });
                project.task.push({
                    desc: req.body.taskName,
                    values: [{
                        from: '',
                        to: '',
                        label: req.body.taskName
                    }]
                });
                data.save((err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send({success: true, taskId: project.task[project.task.length - 1]._id});
                });
            } else {
                var project = data.project.find(function (project) {
                    return project._id.equals(req.body.projectId);
                });
                if (req.body.isProject === 'true') {
                    project.values[0].to = req.body.to;
                } else {
                    if (req.body.dataType === 'from') {
                        project.task.find(function (task) {
                            if (task._id.equals(req.body.taskId)) {
                                task.values[0].from = req.body.from;
                            }
                        });
                    } else {
                        project.task.find(function (task) {
                            if (task._id.equals(req.body.taskId)) {
                                task.values[0].to = req.body.to;
                            }
                        });
                    }
                }
                data.save((err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.send({success: true});
                });
            }
        }
    ]);
});

app.get('/gantt/update/:ganttId', (req, res) => {
  Gantt.findOne({_id: req.params.ganttId}, (err, data) => {
      res.render('gantt/update_gantt', { data: data});
  })
});

app.post('/gantt/update/:ganttId', (req, res) => {
    async.waterfall([
        function(callback) {
            Gantt.findOne({_id: req.params.ganttId}, (err, data) => {
                callback(err, data);
            })
        },
        function(data, callback) {
            Gantt.update(
                {
                    _id: data._id
                }
                ,
                {
                    $push: {
                        task: {
                            $each: req.body.data
                        }
                    }
                },
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/gantt/' + data._id);
                })
        }
    ])
});

app.delete('/gantt/:ganttId', (req, res) => {
    console.log(req.body);
    Gantt.findOne({_id: req.params.ganttId}, (err, data) => {
        if (req.body.isProject === 'true') {
            data.project.forEach(function(project) {
                if (project._id.equals(req.body.projectId)) {
                    project.remove();
                }
            });
            data.save((err) => {
                if (err) {
                    console.log(err);
                }
                res.send({success: true})
            })
        } else {
            data.project.forEach(function(project) {
                if (project._id.equals(req.body.projectId)) {
                    project.task.forEach(function(task){
                        console.log(1);
                        console.log(req.body.taskId);
                        if(task._id.equals(req.body.taskId)) {
                            console.log(2);
                            task.remove();
                        }
                    });
                }
            });
            data.save((err) => {
                if (err) {
                    console.log(err);
                }
                res.send({success: true})
            })
        }
    })

});

app.get('/gantt/', (req, res) => {
    Gantt.find({}, (err, data) => {
        res.render('gantt/gantt_list', {data: data})
    })
});


app.listen(3000, function () {
    console.log('App running on port 3000');
});