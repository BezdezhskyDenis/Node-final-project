const { checkValidId } = require("../models/users.model");

function userVerify(req, res, next) {
    if(!checkValidId(req.params.id)){
        res.status(400).send(`${req.params.id} is not a valid ID`);
        return
      }

    if (req.body.isAdmin && !req.user.isAdmin){
        res.status(403).send(`Only Admin's can assign Admin status`)
        return
      }
  
      if (!req.user.isAdmin){
        if( req.user._id !== req.params.id){
            switch (req.method) {
                case `GET`:
                    res.status(403).send("You can only view your'e own profile")
                    return
                case `PUT`:
                    res.status(403).send("You can only change your'e own profile")
                    return
                case 'DELETE':
                    res.status(403).send("You can only delete your'e own profile")
                    return
                case 'PATCH':
                    res.status(403).send("You can only change your'e own profile")
                    return
            }
        } 
      }

      next()
  }

module.exports = {
    userVerify,
}