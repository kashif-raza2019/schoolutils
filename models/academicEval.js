const mongoose = require('mongoose');

const EvalAcademic = mongoose.Schema({
    userId: String,
    evaluatorName: String,
    // Details for the evaluation page
    school: String,
    teacher: String,
    classHandling: String,
    timing: String,
    yoe: String,
    doj: String,
    gender: String,
    dob:String,
    academicQualification: String,
    maritalStatus: String,
    email: String,
    mobile: String,
    address: String,
    currentAddress: String,
    academicList: Array,
    specialNote: String,
    date: Date,
    // Completely filled or not.
    status: {type: Boolean, default: false}
});

module.exports = mongoose.model('evalacademic', EvalAcademic);
