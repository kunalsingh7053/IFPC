const mongoose = require('mongoose');

function normalizeAdminPosition(value) {
    const normalized = String(value || "").toLowerCase().trim().replace(/\s+/g, " ");

    if (normalized === "president") return "presedent";
    if (normalized === "vice president" || normalized === "vice presedent" || normalized === "vice-presedent") {
        return "vice-president";
    }

    return normalized.replace(" ", "-");
}

const adminSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },
    fullName:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,

        }
    },
    email:{
        type:String,
        required:true,

    },
    position: {
        type: String,
        enum: ["president", "vice-president", "secretary", "treasurer", "head", "admin", "member", "presedent"],
        default: "admin",
        set: (value) => normalizeAdminPosition(value),
    },
    password:{
        type:String,
        required:true,
    },
     phone: {
      type: String,
      required: true,
    },
    lastLogin: {
        type: Date
    },
    profileImage: {
  type: String,
  default: "https://i.pinimg.com/736x/52/9f/1f/529f1fc04346f38d7ae1e41867aa4e92.jpg"
},
        profileImageFileId: {
                type: String,
                default: null,
        },
 status:{
        type:String,
        enum:['allow','block'],
        default:'block',
    }
 






}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;