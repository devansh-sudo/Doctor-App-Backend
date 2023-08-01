const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const validateToken = require("../middleware/validateTokenHandler");



const Admin = require("../models/adminModel");
const Appointment = require("../models/appointmentModel");

const {
    registerAdminValidation,
    loginAdminValidation

} = require("../validation/adminValidation")

const registerAdmin = [registerAdminValidation , asyncHandler(async(req,res)=>{
    try {

        const { firstname, lastname, email, password , phone , image } = req.body;

        const adminAvailable = await Admin.findOne({phone});

        if(adminAvailable){
            return res.status(400).json("Admin Already Exist. Please Login")
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptedPassword,
            phone : phone,
            image : image
          });

          const token = jwt.sign(
            { admin_id: admin._id, email },
            "hello",
            {
              expiresIn: "29d",
            }
          );
        
          admin.token = token;
      
          res.status(201).json(admin);
        
    } catch (e) {
        console.log(e);
        return res.status(400).send({error: e.message});
    }
})]

const loginAdmin = [loginAdminValidation , asyncHandler(async(req ,res)=>{
    try {
     
        const { email, password } = req.body;
    
      
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
      
        const admin = await Admin.findOne({ email });
    
        if (admin && (await bcrypt.compare(password, admin.password))) {
            
          const token = jwt.sign(
            { admin_id: admin._id, email },
           "hello",
            {
              expiresIn: "29d",
            }
          );
    
          admin.token = token;
    
          res.status(200).json(admin);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
})]

const appointmentList = [asyncHandler(async(req , res)=>{

    const today = new Date();

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const page = parseInt(req.body.page) || 1; 
    const limit = parseInt(req.body.limit) || 10;

    const skip = (page - 1) * limit;

    const [appointments, totalRecords] = await Promise.all([
        Appointment.aggregate([
            {
                $match: {
                    date: { $gte: startOfToday, $lt: endOfToday },
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]),
        Appointment.countDocuments({
            date: { $gte: startOfToday, $lt: endOfToday },
        }),
    ]);

    res.status(200).send({
        appointments,
        totalRecords,
    });

})]

const appointmentEdit = [asyncHandler(async(req , res)=>{
    try {
        const appointmentEdit = await Appointment.findByIdAndUpdate(req.body._id , {$set : req.body} , {new : true})
        
        return res.status(200).send(appointmentEdit);
        
    } catch (e) {
        return res.status(400).send(e);
        
    }
})]

const appointmentCancel = [asyncHandler(async(req , res)=>{
    const appointmentCancel = await Appointment.findByIdAndUpdate(req.body._id , {$set : {status : "cancel"}} , {new : true})

     res.status(200).send(appointmentCancel);


})]

module.exports = {
    registerAdmin,
    loginAdmin,
    appointmentList,
    appointmentEdit,
    appointmentCancel
};

