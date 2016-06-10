var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
// routes ======================================================================

    // api ---------------------------------------------------------------------
    // recupere tous les articles
    router.get('/blog/articles', function(req, res)
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
    router.get('/blog/articles/:article_id', function(req, res)
    {
        //console.log('salut');
        Article.find({'_id': req.params.article_id}, function(err, article)
        {
            if (err)
            {
                res.send(err);
            }
            res.json(article);
        });
    });

    // créé un article et renvois tous les articles
    router.post('/blog/articles', function(req, res)
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
    router.put('/blog/articles/:article_id', function(req, res)
    {
        Article.findById(req.params.article_id, function(err, article)
        {
            if(err)
            {
                res.send(err)
            }
            article.title = req.body.title;
            article.body = req.body.body;
            article.save(function(err)
            {
                if(err)
                {
                    res.send(err)
                }
                res.json(article);
            });
        });
    });

    // supprime una article
    router.delete('/blog/articles/:article_id', function(req, res)
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
    router.post('/blog/articles/:article_id/comments', function(req, res)
    {
        // On utilise mongoose pour recup tous les commentaires dans la DB
        Comment.create(
            {
                content : req.body.content,
                author : req.body.author,
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
                if (err)
                {
                    res.send(err);
                }
                res.json(comments);
            });

        });
    });

    // route pour récup tous les commentaires d'un article
    router.get('/blog/articles/:article_id/comments', function(req, res)
    {
        Comment.find({'post': req.params.article_id}, function(err, comments)
        {
            if (err)
            {
                res.send(err);
            }
            res.json(comments);
        });
    });

    // supprime un article
    router.delete('/blog/articles/:article_id/comments/:comment_id', function(req, res)
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
    router.put('/blog/articles/:article_id/comments/:comment_id', function(req, res)
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

router.get('/', function(req, res)
{
  res.sendfile('./public/index.html'); // on charge une seule vue ! angular s'occupe d'afficher les changements
}); 

module.exports = router;
//lol