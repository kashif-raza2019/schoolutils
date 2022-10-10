const express = require('express');
const router = express.Router();
const evaldeeniyat = require('../models/deeniyatEval');
const evalacademic = require('../models/academicEval');

// Deeniyat Parameters
const deeniyatParameters = [
    "Command over Deeniyat subjects", 
    "Teaching moral values / syllabus practically",
    "Maintain daily teaching planner", 
    "Focus on discipline of Students",
    "Methodology of teaching",
    "Managing classrooms effectively and maintaining discipline",
    "Using effective teaching strategies/ activities to actively engage students in learning",
    "Completing syllabus and tasks given",
    "Checking notebooks of the students",
    "Timely preparing exam papers and results",
    "Sensible and careful towards children's overall development",
    "Involvement in school activities/ events AND Cooperation extended (in all areas)",
    "Ability to motivate/ inspire",
    "Accepts constructive criticism in a professional manner and makes adjustments",
    "Commitment towards the school / management",
    "Interaction with Parents",
    "Relationship with colleagues",
    "Approach to extra work given",
    "Punctuality / regularity",
    "Overall Behaviour"
];

// Academic Parameters
const academicParameters = [
    "Command over Deeniyat subjects", 
    "Teaching moral values / syllabus practically",
    "Maintain daily teaching planner", 
    "Focus on discipline of Students",
    "Methodology of teaching",
    "Managing classrooms effectively and maintaining discipline",
    "Using effective teaching strategies/ activities to actively engage students in learning",
    "Completing syllabus and tasks given",
    "Checking notebooks of the students",
    "Timely preparing exam papers and results",
    "Sensible and careful towards children's overall development",
    "Involvement in school activities/ events AND Cooperation extended (in all areas)",
    "Ability to motivate/ inspire",
    "Accepts constructive criticism in a professional manner and makes adjustments",
    "Commitment towards the school / management",
    "Interaction with Parents",
    "Relationship with colleagues",
    "Approach to extra work given",
    "Punctuality / regularity",
    "Overall Behaviour"
];

/**
 *  Evaluation of Deeniyat Routes
 */


// Evaluation Page
router.get('/evaluations/deeniyat/', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const deeniyatList = await getDeeniyatList(user._id);
        const analytics = await getDeeniyatAnalytics(user._id);
        // convert deeniyat list into json object
        // console.log(deeniyatList);  
        res.render('evalDeeniyat', {deen: deeniyatList, parameter: deeniyatParameters, user : user, analytics: analytics});
    }else{
        res.redirect('/');
    }
});

// Add the form in database
router.post('/evaluations/deeniyat/add', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const {userId, evaluatorName, school, teacher, classHandling, timing, yoe, doj, gender, dob, academicQualification, deeniyatQualification, maritalStatus, email, mobile, address, currentAddress, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, specialNote} = req.body;
        const deeniyatList = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20];
        const evalDeeniyat = new evaldeeniyat({
            userId: userId,
            evaluatorName: evaluatorName,
            school: school,
            teacher: teacher,
            classHandling: classHandling,
            timing: timing,
            yoe: yoe,
            doj: doj,
            gender: gender,
            dob: dob,
            academicQualification: academicQualification,
            deeniyatQualification: deeniyatQualification,
            maritalStatus: maritalStatus,
            email: email,
            mobile: mobile,
            address: address,
            currentAddress: currentAddress,
            deeniyatList: deeniyatList,
            specialNote: specialNote,
            date: Date.now(),
            status: true
        });
        const savedevaldeeniyat = await evalDeeniyat.save();
        if(savedevaldeeniyat){
            res.redirect('/evaluations/deeniyat/');
        }else{
            res.send('Error in saving the evaluation');
        }

    }else{
        res.redirect('/');
    }
});

// View the form in printable format
router.get('/evaluations/deeniyat/:id/view', async (req, res) => {
    if(req.session.user || req.params.id.length != 24){
        const user = req.session.user;
        const id = req.params.id;
        const deeniyat = await getDeeniyat(id);
        res.render('evalDeeniyatForm', {user: user, id: id, deeniyat: deeniyat, parameters: deeniyatParameters});
    }else{
        res.redirect('/');
    }
});

// Share publicly and able to view 
router.get('/evaluations/deeniyat/public/:id/', async (req, res) => {
    const id = req.params.id;
    if(id.length == 24){
        const deeniyat = await getDeeniyat(id);
        res.render('publicDeeniyat', {id: id, deeniyat: deeniyat, parameters: deeniyatParameters});
    }else{
        res.render('error', {message: 'Invalid ID'});
    }
});

// Delete a form
router.get('/evaluations/deeniyat/:id/delete', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const id = req.params.id;
        const deeniyat = await evaldeeniyat.findById(id);
        if(deeniyat){
            if(deeniyat.userId == user._id){
                await evaldeeniyat.findByIdAndDelete(id);
                res.redirect('/evaluations/deeniyat/');
            }else{
                res.send('You are not authorized to delete this evaluation');
            }
        }else{
            res.send('This evaluation does not exist');
        }
    }else{
        res.redirect('/');
    }
});

// View the editable form
router.get('/evaluations/deeniyat/:id/edit', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const id = req.params.id;
        const deeniyat = await getDeeniyat(id);
        res.render('evalDeeniyatFormEditable', {user: user, id: id, deeniyat: deeniyat, parameter: deeniyatParameters});
    }else{
        res.redirect('/');
    }
});

// Edit the form and update the data
router.post('/evaluations/deeniyat/:id/update', async (req, res) => {
    const id = req.params.id;
    if(req.session.user || id.length != 24){
        const user = req.session.user;
        const deeniyat = await evaldeeniyat.findById(id);
        if(deeniyat){
            if(deeniyat.userId == user._id){
                const {userId, evaluatorName, school, teacher, classHandling, timing, yoe, doj, gender, dob, academicQualification, deeniyatQualification, maritalStatus, email, mobile, address, currentAddress, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, specialNote} = req.body;
                
                const updatedDeeniyatList = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20];

                deeniyat.userId = userId;
                deeniyat.evaluatorName =  evaluatorName;
                deeniyat.school =  school;
                deeniyat.teacher =  teacher;
                deeniyat.classHandling = classHandling;
                deeniyat.timing =  timing;
                deeniyat.yoe =  yoe;
                deeniyat.doj =  doj;
                deeniyat.gender =  gender;
                deeniyat.dob =  dob;
                deeniyat.academicQualification =  academicQualification;
                deeniyat.deeniyatQualification =  deeniyatQualification;
                deeniyat.maritalStatus =  maritalStatus;
                deeniyat.email =  email;
                deeniyat.mobile =  mobile;
                deeniyat.address =  address;
                deeniyat.currentAddress =  currentAddress;
                deeniyat.deeniyatList =  updatedDeeniyatList;
                deeniyat.specialNote = specialNote;
                const update = await deeniyat.save();
                if(update){
                res.redirect('/evaluations/deeniyat/');
                }else{
                    res.render('error', {message: 'Error in updating the evaluation'});
                }
            }else{
                res.status(501).send('You are not authorized to edit this evaluation');
            }
        }else{
            res.status(500).send('This evaluation does not exist');
        }
    }else{
        res.redirect('/');
    }
});


/**
 *  Evaluation of Academics Routes
 */

// Evaluation Page
router.get('/evaluations/academic/', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const academicList = await getAcademicList(user._id);
        const analytics = await getAcademicAnalytics(user._id);
        // convert deeniyat list into json object
        console.log(academicList);  
        res.render('evalAcademic', {academic: academicList, parameter: academicParameters, user : user, analytics: analytics});
    }else{
        res.redirect('/');
    }
});

// Add the form in database
router.post('/evaluations/academic/add', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const {userId, evaluatorName, school, teacher, classHandling, timing, yoe, doj, gender, dob, academicQualification, maritalStatus, email, mobile, address, currentAddress, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, specialNote} = req.body;
        const academicList = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20];
        const evalAcademic = new evalacademic({
            userId: userId,
            evaluatorName: evaluatorName,
            school: school,
            teacher: teacher,
            classHandling: classHandling,
            timing: timing,
            yoe: yoe,
            doj: doj,
            gender: gender,
            dob: dob,
            academicQualification: academicQualification,
            maritalStatus: maritalStatus,
            email: email,
            mobile: mobile,
            address: address,
            currentAddress: currentAddress,
            academicList: academicList,
            specialNote: specialNote,
            date: Date.now(),
            status: true
        });
        const savedevalacademic = await evalAcademic.save();
        if(savedevalacademic){
            res.redirect('/evaluations/academic/');
        }else{
            res.send('Error in saving the evaluation');
        }

    }else{
        res.redirect('/');
    }
});

// View the form in printable format
router.get('/evaluations/academic/:id/view', async (req, res) => {
    if(req.session.user || req.params.id.length != 24){
        const user = req.session.user;
        const id = req.params.id;
        const academic = await getAcademic(id);
        res.render('evalAcademicForm', {user: user, id: id, academic: academic, parameters: academicParameters});
    }else{
        res.redirect('/');
    }
});

// Share publicly and able to view 
router.get('/evaluations/academic/public/:id/', async (req, res) => {
    const id = req.params.id;
    if(id.length == 24){
        const academic = await getAcademic(id);
        res.render('publicAcademic', {id: id, academic: academic, parameters: academicParameters});
    }else{
        res.render('error', {message: 'Invalid ID'});
    }
});

// Delete a form
router.get('/evaluations/academic/:id/delete', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const id = req.params.id;
        const academic = await evalacademic.findById(id);
        if(academic){
            if(academic.userId == user._id){
                await evalacademic.findByIdAndDelete(id);
                res.redirect('/evaluations/academic/');
            }else{
                res.send('You are not authorized to delete this evaluation');
            }
        }else{
            res.send('This evaluation does not exist');
        }
    }else{
        res.redirect('/');
    }
});

// View the editable form
router.get('/evaluations/academic/:id/edit', async (req, res) => {
    if(req.session.user){
        const user = req.session.user;
        const id = req.params.id;
        const academic = await getAcademic(id);
        res.render('evalAcademicFormEditable', {user: user, id: id, academic: academic, parameter: academicParameters});
    }else{
        res.redirect('/');
    }
});

// Edit the form and update the data
router.post('/evaluations/academic/:id/update', async (req, res) => {
    const id = req.params.id;
    if(req.session.user || id.length != 24){
        const user = req.session.user;
        const academic = await evalacademic.findById(id);
        if(academic){
            if(academic.userId == user._id){
                const {userId, evaluatorName, school, teacher, classHandling, timing, yoe, doj, gender, dob, academicQualification, maritalStatus, email, mobile, address, currentAddress, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, specialNote} = req.body;
                
                const updatedAcademicList = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20];

                academic.userId = userId;
                academic.evaluatorName =  evaluatorName;
                academic.school =  school;
                academic.teacher =  teacher;
                academic.classHandling = classHandling;
                academic.timing =  timing;
                academic.yoe =  yoe;
                academic.doj =  doj;
                academic.gender =  gender;
                academic.dob =  dob;
                academic.academicQualification =  academicQualification;
                academic.maritalStatus =  maritalStatus;
                academic.email =  email;
                academic.mobile =  mobile;
                academic.address =  address;
                academic.currentAddress =  currentAddress;
                academic.deeniyatList =  updatedAcademicList;
                academic.specialNote = specialNote;
                const update = await academic.save();
                if(update){
                res.redirect('/evaluations/academic/');
                }else{
                    res.render('error', {message: 'Error in updating the evaluation'});
                }
            }else{
                res.status(501).send('You are not authorized to edit this evaluation');
            }
        }else{
            res.status(500).send('This evaluation does not exist');
        }
    }else{
        res.redirect('/');
    }
});


/**
 *  Functions to get the data from the database
 */

// Function to get the list of deeniyat
async function getDeeniyatList(_id){
    const deeniyatList = await evaldeeniyat.find({userId: _id});
    if(deeniyatList){
        const tempArr = [];
        for(let i = 0; i < deeniyatList.length; i++){
            console.log(deeniyatList[i]);
            tempArr.push(deeniyatList[i]);
        }
        return tempArr;
    }else{
        console.log('Empty dataset')
        return [];
    }
}

// Function to get the deeniyat list
async function getDeeniyat(_id){
    const deeniyat = await evaldeeniyat.findById(_id);
    if(deeniyat){
        return deeniyat;
    }else{
        return {};
    }
}

// Function to get the list of academic
async function getAcademicList(_id){
    const academicList = await evalacademic.find({userId: _id});
    if(academicList){
        const tempArr = [];
        for(let i = 0; i < academicList.length; i++){
            console.log(academicList[i]);
            tempArr.push(academicList[i]);
        }
        return tempArr;
    }else{
        console.log('Empty dataset');
        return [];
    }
}

// Function to get the academic list
async function getAcademic(_id){
    const academic = await evalacademic.findById(_id);
    if(academic){
        return academic;
    }else{
        return {};
    }
}

async function getDeeniyatAnalytics(_id){
    const deeniyatAnalytics = await evaldeeniyat.find({userId: _id});
    if(deeniyatAnalytics){
        return deeniyatAnalytics;
    }else{
        return {};
    }
}

async function getAcademicAnalytics(_id){
    const academicAnalytics = await evalacademic.find({userId: _id});
    if(academicAnalytics){
        return academicAnalytics;
    }else{
        return {};
    }
}

module.exports = router;