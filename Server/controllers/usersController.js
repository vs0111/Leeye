const {User} = require('../models/UserModel')
const bcrypt = require('bcrypt');
const  mongoose  = require('mongoose');

const usersController = {
    getUser : async (req,res)=>{
        try {
            const userId = req.params.id;
            const user = await User.findOne({ _id: Object(userId) })

            if(user) res.status(200).json(user);
            else res.status(404).json({message: 'user not found'});
        } catch (error) {
            res.status(500).json(error)
        }
    },
    updateUserPut : async(req,res)=>{
        console.log('heheheh');
        try {
            console.log(req.body);
            if(req.body.userId === req.params.id){
                //to change password
                if(req.body.password){
                    try{
                        const salt = await bcrypt.genSalt(10);
                        req.body.password = await bcrypt.hash(req.body.password,salt)
                    }catch(error){
                        return res.status(500).json(error);    
                    }
                }
    
                //to update details
                try{
                    await User.findByIdAndUpdate(Object(req.params.id),{
                        $set:req.body
                    }, { new: true }).then((updatedUser)=>{
                        res.status(200).json({updatedUser,msg:'Account has been updated'});
                    }).catch((error) => {
                        throw error;
                    });
                }catch(error){
                    res.status(500).json(error)
                  }
                }
              } catch (error) {
                res.status(500).json(error)
              }
    } ,
    updateProfilePic : async (req,res)=>{
        const currentUserId = req.params.id;
        try {
            // res.status(200).json();
            const updatedUser = await User.findOneAndUpdate({_id: currentUserId}, {$set: {profilePicture: req.body.data}}, {new: true});

            if (updatedUser) {
                res.status(200).json(updatedUser);
              } else {
                res.status(404).json({message: 'User not found'});
              }
        } catch (error) {
            res.status(500).send({error});
        }
    },
}


module.exports = usersController;