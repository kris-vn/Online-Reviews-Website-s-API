const Sauce = require('../models/sauce');
const fs = require('fs');
const { findOne } = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
      likes: req.body.sauce.likes,
      dislikes: req.body.sauce.dislikes,
      usersLiked: req.body.sauce.usersLiked,
      usersDisliked: req.body.sauce.usersDisliked
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
        res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
        res.status(404).json({
            error: error
        });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            // userId: req.body.sauce.userId,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            // likes: req.body.sauce.likes,
            // dislikes: req.body.sauce.dislikes,
            // usersLiked: req.body.sauce.usersLiked,
            // usersDisliked: req.body.sauce.usersDisliked
        };
    } else {
        sauce = {
            _id: req.params.id,
            userId: req.body.userId,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            // likes: req.body.likes,
            // dislikes: req.body.dislikes,
            // usersLiked: req.body.usersLiked,
            // usersDisliked: req.body.usersDisliked
        };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
        res.status(201).json({
            message: 'Sauce updated successfully!'
        });
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                    res.status(200).json({
                        message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                    res.status(400).json({
                        error: error
                    });
                    }
                );
            });
        }
    );
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
        res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

exports.getRating = (req, res, next) => {
    // find the sauce using Sauce.findOne()
    // use a conditional that lets me know which thumb has been clicked using req.body.like that will give a number (1, -1, 0)
    // the conditional has 4 steps
    // let updatedLikes = new Sauce({ _id: req.params._id });
    console.log('body', req.body)
    console.log('body', req.body.usersLiked)
        Sauce.findOne({_id: req.params.id}).then(
            (updatedLikes) => {
                if (req.body.like === 1) {
                    console.log('I guess it is a like')
                    console.log(req.body.likes)
                    updatedLikes = {
                        _id: req.params.id,
                        userId: req.body.userId,
                        name: req.body.name,
                        manufacturer: req.body.manufacturer,
                        description: req.body.description,
                        mainPepper: req.body.mainPepper,
                        imageUrl: req.body.imageUrl,
                        heat: req.body.heat,
                        likes: req.body.likes + 1,
                        dislikes: req.body.dislikes,
                        usersLiked: req.body.usersLiked,
                        usersDisliked: req.body.usersDisliked,
                    } // object I am using to update the record
                } else if (req.body.like === -1) {
                    console.log('They probably did not like it')
                    updatedLikes = {
                        _id: req.params.id,
                        userId: req.body.userId,
                        name: req.body.name,
                        manufacturer: req.body.manufacturer,
                        description: req.body.description,
                        mainPepper: req.body.mainPepper,
                        imageUrl: req.body.imageUrl,
                        heat: req.body.heat,
                        likes: req.body.likes,
                        dislikes: req.body.dislikes + 1,
                        usersLiked: req.body.usersLiked,
                        usersDisliked: req.body.usersDisliked,
                    }
                } 

            Sauce.updateOne({_id: req.params.id}, updatedLikes)
            .then(() => {
                res.status(201).json({
                    message: 'Great Sauce!'
            });
            })
            .catch(
                (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
)}
