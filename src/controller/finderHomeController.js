const Joi = require("joi");
const FindHome = require("../model/findHomeModel");
const User = require("../model/userModel");
const fs = require('fs/promises');

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) { return '0 Bytes'; }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

const findHomeSchema = Joi.object().keys(
    {
        generalInfo: {
            catName: Joi.string().required(),
            color: Joi.string().required(),
            breeds: Joi.string().required(),
            age: Joi.string().required(),
            location:
            {
                province: Joi.string().required(),
                district: Joi.string().required(),
            },
            vaccination: Joi.string().required(),
            receiveVaccine: Joi.array,
            receiveDate: Joi.string().required(),
            disease: Joi.string().required(),
            neutered: Joi.string().required(),
            gender: Joi.string().required(),
            characteristic: {
                hair: Joi.string().required(),
                size: Joi.string().required(),
                habit: Joi.array,
                sandbox: Joi.string().required()
            },
            others: Joi.string().required(),
        },
        contact: {
            contactName: Joi.string().required(),
            tel: Joi.string().required(),
            facebook: Joi.string().required(),
            line: Joi.string().required(),
        },

    })

//--------------------- User ---------------------
exports.Create = async (req, res, next) => {
    try {
        const idUser = req.decoded.id;
        const user = await User.findById(idUser);
        if (user) {
            req.body.author = idUser;
            const result = findHomeSchema.validate(req.body);
            const newCreate = new FindHome(result.value);
            await newCreate.save();
            const newPost = await FindHome.create(newCreate)
            return res.status(200).json({
                success: true,
                message: "Create Success",
                postId: newPost._id.toString(),
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "No user found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
};

exports.GetMyPost = async (req, res) => {
    const id = req.query.id;
    const mypost = await FindHome.find({ author: id });
    return res.send({ mypost });
};

//--------------------- User and Admin ---------------------
exports.FindAllPost = async (req, res) => {
    const getAllPost = await FindHome.find().populate({
        path: 'authorInfo', select: ['firstName', 'lastName']
    }).exec();
    try {
        if (getAllPost.length < 1) {
            return res.status(200).json([]);
        }
        return res.json(getAllPost);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.FindAllLatest = async (req, res) => {
    const getAllPost = await FindHome.find().sort({ createdAt: -1 }).populate({
        path: 'authorInfo', select: ['firstName', 'lastName']
    }).exec();
    try {
        if (getAllPost.length < 1) {
            return res.status(200).json([]);
        }
        return res.json(getAllPost);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.FindAlloldPost = async (req, res) => {
    const getAllPost = await FindHome.find().sort({ createdAt: 1 }).populate({
        path: 'authorInfo', select: ['firstName', 'lastName']
    }).exec();
    try {
        if (getAllPost.length < 1) {
            return res.status(200).json([]);
        }
        return res.json(getAllPost);
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.FindOnePost = async (req, res) => {
    const id = req.query.id;
    try {
        const data = await FindHome.findById(id).populate('author').exec();
        if (!data)
            return res.status(404).send({
                message: "Not found Post with id " + id
            });
        return res.send({
            data: data,
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving Post with id=" + id });
    }
};

exports.DeletePost = async (req, res) => {
    try {
        const id = req.query.id;
        const post = await FindHome.findById(id)
        const nameImage = post.image.filePath.substr(8);
        console.log(nameImage);
        await fs.unlink(`./uploads/${nameImage}`)
        console.log("1");
        const data = await FindHome.findByIdAndRemove(id)
        if (!data) {
            return res.status(404).send({
                message: `Cannot delete FindHome with id=${id}. Maybe FindHome was not found!`
            });
        }
        return res.status(200).send({
            message: "FindHome was deleted successfully!"
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete FindHome "
        });
        console.error(err);
    }
};

exports.Update = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }
        const id = req.query.id;
        const data = await FindHome.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        if (!data) {
            return res.status(404).send({
                message: `Cannot update FindHome with id=${id}. Maybe FindHome was not found!`
            });
        } return res.status(200).send({
            message: "FindHome was updated successfully.",
            postId: data._id.toString()
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating FindHome with id=" + id
        });
    }
};

exports.updateImageFindHome = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const post = await FindHome.findById(id)
        console.log(post);
        if (!post.image.fileName) {
            return res.status(404).send({
                message: `FindHome was not found!`
            });
        } else {
            const nameImage = post.image.filePath.substr(8);
            console.log(nameImage);
            fs.unlink(`./uploads/${nameImage}`)
            post.image = undefined
            await post.save()
        };
        const data = await FindHome.findByIdAndUpdate(id,
            {
                image: {
                    fileName: req.file.originalname,
                    filePath: req.file.path,
                    fileType: req.file.mimetype,
                    fileSize: fileSizeFormatter(req.file.size, 2)
                }
            })
        if (!data) {
            return res.status(404).send({
                message: `Cannot update FindHome. Maybe FindHome was not found!`
            });
        }
        res.status(201).send({
            message: 'File Uploaded Successfully',
            image: req.file.originalname
        });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
};

exports.GetMultipleRandom = async (req, res) => {
    const getAllPost = await FindHome.find();
    // if (!getAllPost || getAllPost.length === 0) {
    //     return res.status(201).send({
    //         message: "No Post Now"
    //     });
    // }

    if (getAllPost.length < 1) {
        return res.status(200).json([]);
    }

    function getMultipleRandom(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }
    const randomPost = getMultipleRandom(getAllPost, 3)
    return res.status(200).json(randomPost);
}

exports.Singleupload = async (req, res) => {
    try {
        if (!req.params.postId) {
            throw new Error('require field')
        }
        await FindHome.findByIdAndUpdate(req.params.postId, {

            image: {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2)
            }
        })
        res.status(201).send({
            message: 'File Uploaded Successfully',
            image: req.file.originalname
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.readFileFindHome = async (req, res) => {
    try {
        const id = req.query.id;
        const post = await FindHome.findById(id)
        const nameImage = post.image.filePath.substr(8);
        console.log(nameImage);
        const data = await fs.readFile(`./uploads/${nameImage}`);
        return res.end(data);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.LikePost = async (req, res) => {
    const id = req.decoded.id;
    const Postid = req.query.id;
    const findPostByPostid = await FindHome.findById(Postid);
    if (findPostByPostid) {
        try {
            // ไปหา favor ของผู้ใช้คนนั้นๆมา
            const getFavor = await User.findById(id).select('favor');
            console.log(getFavor);
            // สร้างตัวแปร truefalse มาเก็บไว้เช็คว่า ที่กดไลค์เข้ามา มันเคยมีแล้วหรือยัง
            let checkDuplicate = false;

            // ลูปเช็คว่ามีซำ้ไหม ถ้ามีให้ตั้ง true
            for (let index = 0; index < getFavor.favor.length; index++) {
                if (Postid == getFavor.favor[index].itemId) {
                    checkDuplicate = true;
                }
            }

            if (checkDuplicate === true) {
                await User.updateOne({ _id: id }, { $pull: { favor: { itemId: Postid } } })
                return res.status(200).json({
                    status: 200,
                    message: "Unlike สำเร็จ"
                })
            } else {
                await User.updateOne({ _id: id }, { $push: { favor: { itemId: Postid } } })
                return res.status(200).json({
                    status: 200,
                    message: "Like สำเร็จ"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("something went wrong");
        }
    } else {
        return res.status(404).json({
            status: 404,
            message: "Post by Post id is not found."
        })
    }
};

//*สำเร็จ 
exports.getLikePost = async (req, res) => {
    const id = req.decoded.id;
    try {
        // favor ของผู้ใช้คนนั้น
        const getFavor = await User.findById(id).select('favor');
        if (getFavor != null) {
            let allPosts = [];
            // ลูปเพื่อดึงข้อมูลแต่ละโพส
            for (let index = 0; index < getFavor.favor.length; index++) {
                //ดึงข้อมูลแต่ละอัน
                const a = await FindHome.findById(getFavor.favor[index].itemId);
                allPosts.push(a);
            }
            return res.status(200).json(allPosts);
        } else if (getFavor = []) {
            return res.status(200).json([]);
        }

    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

//*สำเร็จ 
//เมื่อ User กดปุ่มเปลี่ยน status จากยังไม่ถูกรับเลี้ยงจะเป็นเป็นถูกรับเลี้ยง
exports.changeStatus = async (req, res) => {
    const id = req.query.postID//id post ที่จะเปลี่ยน status
    const findPost = await FindHome.findById(id); //เอา id ไปดึงหาข้อมูลมี post ไหม
    if (findPost != null) {
        await FindHome.findByIdAndUpdate(id, { statusbar: "รับเลี้ยงสำเร็จ" });
        return res.status(200).json({ message: 'ยินดีด้วย น้องแมวของคุณได้รับการช่วยเหลือแล้ว' });
    } else {
        return res.status(400).json({ message: 'ไม่มี ID ที่คุณต้องการเปลี่ยน Status' });
    }
};

//*สำเร็จ 
//เมื่อ User กดปุ่ม filter แมวที่ได้รับเลี้ยงแล้ว 
exports.getAdopt = async (req, res) => {
    const getAllPost = await FindHome.find({ statusbar: { $eq: 'รับเลี้ยงสำเร็จ' } }).populate({
        path: 'authorInfo', select: ['firstName', 'lastName']
    }).exec();

    const numCount = getAllPost.length;
    console.log(numCount);
    try {
        if (getAllPost.length < 1) {
            return res.status(200).json([]);
        }

        return res.status(200).send({
            success: getAllPost,
            numCount: numCount
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }

};

//*สำเร็จ 
// เมื่อ User กดปุ่ม filter แมวที่ยังไม่ได้รับเลี้ยงแล้ว 
exports.getNotAdopt = async (req, res) => {
    const getAllPost = await FindHome.find({ statusbar: { $eq: 'ยังไม่ถูกรับเลี้ยง' } }).populate({
        path: 'authorInfo', select: ['firstName', 'lastName']
    }).exec();

    const numCount = getAllPost.length;
    console.log(numCount);
    try {
        if (getAllPost.length < 1) {
            return res.status(200).json([]);
        }

        return res.status(200).send({
            success: getAllPost,
            numCount: numCount
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};












