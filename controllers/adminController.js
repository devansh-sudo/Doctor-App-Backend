const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const multer = require('multer')
const { bucket, getDownloadURL } = require("../firebase/firebase");
const path = require('path');

const validateToken = require("../middleware/validateTokenHandler");

const Admin = require("../models/adminModel");
const Appointment = require("../models/appointmentModel");

const {
    registerAdminValidation,
    loginAdminValidation,
    appoinmentCancelValidation,
    appointmentEditValidation,
    appoinmentShow

} = require("../validation/adminValidation");


const registerAdmin = [registerAdminValidation, asyncHandler(async (req, res) => {
    try {

        const { firstname, lastname, email, password, phone, image } = req.body;

        const adminAvailable = await Admin.findOne({ phone });

        if (adminAvailable) {
            return res.status(400).json("Admin Already Exist. Please Login")
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptedPassword,
            phone: phone,
            image: image
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
        return res.status(400).send({ error: e.message });
    }
})]

const loginAdmin = [loginAdminValidation, asyncHandler(async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {

            let token = jwt.sign(
                { admin_id: admin._id, email },
                process.env.ACCESS_TOKEN_SECERT,
                {
                    expiresIn: process.env.EXPIRESIN,
                }
            );

            token = token;

            return res.status(200).json({ admin, token });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
})]

const appointmentList = [
    validateToken,
    asyncHandler(async (req, res) => {
        try {
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const skip = (page - 1) * limit;

            const searchName = req.body.name || '';
            const startDate = req.body.startDate ? new Date(req.body.startDate) : startOfToday;
            let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date(startDate);

            endDate.setDate(endDate.getDate() + 1);

            const nameQuery = { name: { $regex: searchName, $options: 'i' } };
            const dateMatch = { date: { $gte: startDate, $lt: endDate } };
            const matchQuery = { $and: [nameQuery, dateMatch] };

            const appointments = await Appointment.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    firstname: 1,
                                    lastname: 1,
                                    image: 1,
                                },
                            },
                        ],
                        as: "user",
                    },
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        name: "$user.firstname",
                        image: "$user.image",
                        user: "$user._id",
                        status: 1,
                        date: 1,
                        time: 1,
                    },
                },
                {
                    $match: matchQuery,
                },
                {
                    $sort: {
                        date: 1
                    }
                },
                {
                    $facet: {
                        paginatedResults: [
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            { $count: "count" }
                        ],
                    }
                },
            ]);

            const totalRecordsCount = appointments[0]?.totalCount[0]?.count;
            const paginatedResults = appointments[0]?.paginatedResults;

            res.status(200).send({
                paginatedResults,
                totalRecords: totalRecordsCount,
            });
        } catch (error) {
            res.status(400).json(error);
        }
    })];



const appointmentEdit = [
    validateToken,
    appointmentEditValidation, asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }

            const { registrationFees, content } = req.body
            const appointmentEdit = await Appointment.findByIdAndUpdate(req.body._id,
                { $set: { registrationFees, content } },
                { new: true })

            return res.status(200).send(appointmentEdit);

        } catch (e) {
            return res.status(400).send(e);

        }
    })]

const appointmentCancel = [
    validateToken,
    appoinmentCancelValidation, asyncHandler(async (req, res) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }

            const appointment = await Appointment.findById(req.body._id);
            if (!appointment) {
                return res.status(404).send({ message: "Appointment not found." });
            }

            if (appointment.status == "cancel") {
                return res.status(400).send({ message: "Appointment already cancel." });

            }

            const appointmentCancel = await Appointment.findByIdAndUpdate(req.body._id, { $set: { status: "cancel" } }, { new: true })
            res.status(200).send(appointmentCancel);

        } catch (e) {
            console.log(e);
            return res.status(400).send(e);

        }



    })]

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed.'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
}).single('photo');

const reportUpload = [
    validateToken, function (req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message || 'something went wrong on file upload' });
            } else if (err) {
                return res.status(400).json({ error: 'Please upload a file.', err });
            }
            next();
        })
    },
    asyncHandler(async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload a file.' });
            }

            const userDoc = await Appointment.findOne({ _id: req.params.id });
            if (!userDoc) {
                return res.status(400).send({ error: "Appointment id is wrong, please provide currect id" });
            }
            const file = req.file;

            const destination = 'report';
            const fileName = `${Date.now()}-${file.originalname}`;

            const blob = bucket.file(`${destination}/${fileName}`);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                return res.status(400).json({ error: 'Failed to upload the file.' });
            });

            blobStream.on('finish', async () => {

                const downloadURL = await getDownloadURL(blob);
                userDoc.report = downloadURL;
                await userDoc.save();
                return res.status(200).json({ user: userDoc });
            });
            blobStream.end(file.buffer);
        } catch (error) {
            console.log(error);
            return res.status(400).send({ error: error.message || 'Error While updating Profile Image' });
        }
    }),
];

const appointmentShow = [
    validateToken,
    appoinmentShow, asyncHandler(async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }

            const { _id } = req.body;
            const appointmentshow = await Appointment.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $project: {
                                    firstname: 1,
                                    image: 1,
                                    gender: 1,
                                    dob: 1
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'tests',
                        localField: 'test',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $project: {
                                    price : 1,
                                    testName: 1
                                }
                            }
                        ],
                        as: 'test'
                    }
                },
                {
                    $unwind: {
                        path: '$test',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        image: '$user.image',
                        name: '$user.firstname',
                        age: '$user.dob',
                        gender: '$user.gender',
                        diagnosis: '$test.testName',
                        price : "$test.price",
                        report: 1
                    }
                }
            ]);

            res.status(200).json(appointmentshow);
        } catch (error) {
            console.log("Result:", error);
            res.status(200).json(error);
        }
    })]

    const allAppointment = [
        validateToken,
        asyncHandler(async (req, res) => {
          try {
            const allAppointments = await Appointment.aggregate([
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: {
                  path: "$user",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  status: "pending",
                },
              },
              {
                $project: {
                  date : 1,
                  image : "$user.image",
                  name : "$user.firstname"
                 
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
              {
                $limit: 6,
              },
            ]);
      
            const completedCount = await Appointment.countDocuments({ status: "completed" });
            const cancelCount = await Appointment.countDocuments({ status: "cancel" });
            const totalCount = await Appointment.countDocuments();
      
            res.status(200).json({
              total: totalCount,
              completed: completedCount,
              cancel: cancelCount,
              allAppointments: allAppointments,
            });
          } catch (e) {
            console.log(e);
            res.status(500).json({ error: "An error occurred." });
          }
        }),
      ];
      

const removeReport = [asyncHandler(async(req, res)=>{
    try {
        const removeReport = await Appointment.findById(req.params.id)

        if(!removeReport){
            return res.status(400).send("Appointment id is wrong, please provide currect id")
        }
        if(removeReport.report){
            removeReport.report = "";
            await removeReport.save()
        }
        res.status(400).send("Report removed successfully")

    } catch (e) {
        res.status(400).send(e)
    }
})]

module.exports = {
    registerAdmin,
    loginAdmin,
    appointmentList,
    appointmentEdit,
    appointmentCancel,
    appointmentShow,
    reportUpload,
    allAppointment,
    removeReport
};

