const User = require("../models/user")

const asyncHandler = require('express-async-handler');

const jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');

const JWT_SECRET ="ADD YOUR OWN KEY"

const registerUser = asyncHandler(async(req,res)=>{
    try{
        const {email,username, phone,password,uploadImage, role } = req.body
        if(!email || !username ||!password){
            res.status(400).send({
                success : false,
                msg : "required all fields"
            })
        }
        else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const isuser = await User.findOne({username:username,email:email,password:hashedPassword, phone: phone, uploadImage: uploadImage, role:role})
            if(isuser){
                send.status(200).send({
                    success: true,
                    msg : "User already exists"
                })
            }
            else{
                const user = await User.create({
                    username:username,
                    email:email,
                    password:hashedPassword, 
                    phone: phone, 
                    role : "Admin",
                    uploadImage: uploadImage
                })
                if(user) {
                    res.status(201).send({
                        success : true,
                        msg : "You have registred succesfully",
                        data : {
                            _id : user._id,
                            username: user.username,
                            email : user.email,
                            phone : user.phone,
                            role : user.role,
                            image : user.uploadImage,
                            token : generateToken(user._id)
                        }
                    })
                }
                else{
                    res.status(400);
                    throw new Error('Invalid user data');
                }
            }
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
        
    }
})

const generateToken =(id)=>{
    try{
        return jwt.sign({id},JWT_SECRET,{
            expiresIn : '30d',
        })
    }
    catch(error){
        console.log(error)
    }
}

const loginUser = asyncHandler(async(req,res)=>{
    try{
     
        const {email,password} = req.body;
        if(!email||!password){
            res.status(400).status({
                success : false,
                msg : "required all fields"
            })
        }
        else{
            const isuser = await User.findOne({email:email})
            if(isuser && (await bcrypt.compare(password,isuser.password))){
                res.status(201).send({
                    success : true,
                    msg :"You have loggedin successfully",
                    _id : isuser._id,
                    username : isuser.username,
                    email : isuser.email,
                    role : isuser.role,
                    phone : isuser.phone,
                    image : isuser.uploadImage,
                    token : generateToken(isuser._id)
                    
                })
            }
            else{
                res.status(200).send({
                    success : false,
                    msg : `You haven't created the account with this ${email} mail ID`
                })
            }
        }

    }catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
});



const resetPassword = asyncHandler(async(req,res)=>{
    try{
        const id = req.user._id
        const password = req.body.password.password
    

        if(!password){
            res.status(400).send({
                success: false,
                msg : "Required Password"
            })
        }

        else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            //console.log("hassh",hashedPassword)
            const user = await User.findOneAndUpdate({_id:id},{password:hashedPassword})
            if(user){
                res.status(200).send({
                    success: true,
                    msg :"Password is Updated successfully"

                })
            }
            else{
                res.status(404).send({
                    success: false,
                    msg : "User Not found or Something went wrong"
                })
            }
        }

    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
});

const getUser = asyncHandler(async(req,res)=>{
    try{
        const id = req.user._id

        const user = await User.findById({_id:id})
        if(user){
            res.status(201).send({
                success: true,
                msg : "gor user data",
                data : user
            })
        }
        else{
            res.status(404).send({
                success: false,
                msg : "something wemt wrong"
            })
        }

    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
})

const updateUser = asyncHandler(async(req,res)=>{
    try{
    
            const username = req.body.username
            const id = req.user._id
            const user = await User.findOneAndUpdate({_id: id}, {$set:{username:username}}, { new: true })
            if(user){
                res.status(200).send({
                    success : true,
                    msg : "Username is changed succesfully"
                })
            }
            else{
                res.status(400).send({
                    success: false,
                    msg : "Something went wrong"
                })
            }
        }
    
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
});

const deleteAccount = asyncHandler(async(req,res)=>{
    try{
        const id = req.user._id
        const email = req.user.email
        const user = await User.findByIdAndDelete({_id:id})
        if(user){
            res.status(200).send({
                success:true,
                msg : `Your account with ${email} this email ID is deleted`
            })
        }
        else{
            res.status(404).send({
                success: false,
                msg : "Use not found"
            })
        }

    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
});

const updateProfile = asyncHandler(async(req,res)=>{
    try{
        
        const image = req.body.uploadImage
        const id = req.user._id
        if(!image){
            res.status(400).send({
                success: false,
                msg : "Please add image file"
            })
        }
        else{
            const user = await User.updateOne({_id:id},{$set:{uploadImage:image}})
            if(user){
                res.status(200).send({
                    success: true,
                    msg : "Profile updated successfully"
                    
                })
            }
            else{
                res.status(404).send({
                    success : false,
                    msg : "Something went wrong"
                })
            }
        }
    }
    catch(error){
        console.log(error)
        
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
})

const getAllusers = asyncHandler(async(req,res)=>{
    try{
        const users = await User.find({role:"User"})
    
        if(users) {
            res.status(201).send({
                success: true,
                data : users,
                msg : "got all users"
            })
        }
        else{
            res.status(404).send({
                success: false,
                msg : "not found data"
            })
        }
    }
    catch(error){
        console.log(error);
   
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    }
})


const getoneUser = asyncHandler(async(req,res)=>{
    try{
        const id = req.params.id
        

        const user = await User.findById(id);
        // console.log(user)
        if(user){
            res.status(201).send({
                success : true,
                msg : "User found",
                data : user
            })
        }
        else{
            res.status(404).send({
                success : false,
                msg:"smething went wrong user not found"
            })
        }
        
    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    
    }
})

const updateOne = asyncHandler(async(req,res)=>{
    try{
        console.log('Received update request:', req.method, req.url);
        const { id } = req.params;
        const { username, email, phone, password } = req.body;

        if(!email || !username ||!password||!phone){
            res.status(400).send({
                success : false,
                msg : "required all fields"
            })
        }
        //console.log(req.body)
        const isuser = await User.findById(id)
        if(isuser && (await password ===isuser.password)){
            const user = await User.updateOne({_id:id},{$set:{
                username : username,
                email : email,
                phone : phone
            }})
            if (user.nModified > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User details updated successfully."
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No changes made. User details remain the same."
                });
            }
        }
        else{
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const user = await User.updateOne({_id:id},{$set:{
                username : username,
                email : email,
                phone : phone,
                password: hashedPassword
            }})
            if (user.nModified > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User details updated successfully."
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No changes made. User details remain the same."
                });
            }
        } 

    }catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    
    }
})

const upadateOneprofile=asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const image = req.body.uploadImage
       
        if(!image){
            res.status(400).send({
                success: false,
                msg : "Please add image file"
            })
        }
        else{
            const user = await User.updateOne({_id:id},{$set:{uploadImage:image}})
            if(user){
                res.status(200).send({
                    success: true,
                    msg : "Profile updated successfully"
                    
                })
            }
            else{
                res.status(404).send({
                    success : false,
                    msg: "User not found or profile image not updated."
                })
            }
        }

    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    
    }
})

const deleteOne = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params

        const user = await User.findByIdAndDelete({_id:id})
        if(user){
            res.status(200).send({
                success : true,
                msg : `User of name ${user.username} and with ${user.phone} number has been deleted successfully.`
            })

        }
        else{
            res.status(404).sned({
                success : false,
                msg : "something went wrong while deleting the user"
            })
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success: false,
            msg: "Internal server error"
        });
    
    }
})




module.exports={
    registerUser,
    loginUser,
    resetPassword,
    updateUser,
    deleteAccount,
    updateProfile,
    getUser,
    getAllusers,
    getoneUser,
    updateOne,
    upadateOneprofile,
    deleteOne
}
