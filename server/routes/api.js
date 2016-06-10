var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var User = require('../models/user.js');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username , admin: false}),
    req.body.password, function(err) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        else {
          res.status(200).json({
              status: 'Login successful!'
          });
      }

    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
    res.status(200).json({
          status: true,
      });


});

router.get('/pseudo', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        username: req.user
    });
});

router.get('/articles', function(req, res)
    {
        // On utilise mongoose pour recup tous les articles dans la DB
        Article.find(function(err, articles)
        {
            if (err)
            {
                res.send(err);
            }

            res.json(articles); // retourne tous les articles au format JSON
        });
    });

    // route pour récup un article en particulier
    router.get('/articles/:article_id', function(req, res)
    {
        //console.log('salut');

        Article.find({'_id': req.params.article_id}, function(err, article)
        {
            if (err)
            {
                res.send(err);
            } else {
                res.json(article);
            }
        });
    });

    // créé un article et renvois tous les articles
    router.post('/articles', function(req, res)
    {
        // créer un article, on récupere les infos en AJAX depuis Angular
        Article.create(
            {
                title : req.body.title,
                author : req.body.author,
                content : req.body.content,
                done : false
            }, function(err, todo)
        {
            if (err)
            {
                res.send(err);
            }

            // récupere et retourne tous les articles après en avoir créer un
            Article.find(function(err, articles)
            {
                if(err)
                {
                    res.send(err)
                }
                res.json(articles);
            });
        });

    });

    // Route pour modifier un article
    router.put('/articles/:article_id', function(req, res)
    {
        Article.findById(req.params.article_id, function(err, article)
        {
            if(err)
            {
                res.send(err)
            }
            if(req.body.title != null) {
                article.title = req.body.title;
            }
            if(req.body.content != null){
                article.content = req.body.content;
            }

            article.save(function(err)
            {
                if(err)
                {
                    res.send(err)
                }
                Article.find({'_id': req.params.article_id}, function(err, article)
                {
                    if (err)
                    {
                        res.send(err);
                    } else {
                        res.json(article);
                    }
                });
            });
        });
    });

    // supprime una article
    router.delete('/articles/:article_id', function(req, res)
    {
        Article.remove(
        {
            _id : req.params.article_id
        }, function(err, article)
            {
                if(err)
                {
                    res.send(err);
                }

                // récupere et retourne tous les articles après en avoir supprimer un
                Article.find(function(err, articles)
                {
                    if(err)
                    {
                        res.send(err)
                    }
                    res.json(articles);
                });
        });
    });

    // route pour créer un commentaire
    router.post('/articles/:article_id/comments', function(req, res)
    {
        //console.log(req.body.content);
        // On utilise mongoose pour recup tous les commentaires dans la DB
        Comment.create(
            {
                author : req.body.author,
                text : req.body.text,
                post : req.params.article_id,
                done : false
            }, function(err, comment)
        {
            if (err)
            {
                res.send(err);
            }
            Comment.find({'post': req.params.article_id}, function(err, comments)
            {
                /*if (err)
                {
                    res.send(err);
                }*/

                    res.json(comments);

            });

        });
    });

    // route pour récup tous les commentaires d'un article
    router.get('/articles/:article_id/comments', function(req, res)
    {
        Comment.find({'post': req.params.article_id}, function(err, comments)
        {
            if (err)
            {
                res.send(err);
            } else {
                res.json(comments);
            }
        });
    });

    // supprime un article
    router.delete('/articles/:article_id/comments/:comment_id', function(req, res)
    {
        Comment.remove(
        {
            _id : req.params.comment_id
        }, function(err, comment)
        {
            if(err)
            {
                res.send(err);
            }

            // récupere et retourne tous les articles après en avoir supprimer un
            Comment.find({'post': req.params.article_id}, function(err, comments)
            {
                if(err)
                {
                    res.send(err)
                }
                res.json(comments);
            });
        });
    });

    // Route pour modifier un commentaire
    router.put('/articles/:article_id/comments/:comment_id', function(req, res)
    {
        Comment.findById(req.params.comment_id, function(err, comment)
        {
            if(err)
            {
                res.send(err)
            }
            comment.body = req.body.body;
            comment.save(function(err)
            {
                if(err)
                {
                    res.send(err)
                }
                res.json(comment);
            });
        });
    });

// route pour l'appli frontend ==> ANGULAR APP :) 


module.exports = router;