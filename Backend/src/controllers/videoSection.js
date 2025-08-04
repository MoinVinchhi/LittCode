const cloudinary = require('cloudinary').v2;
const Problem = require('../models/problem');
const SolutionVideo = require('../models/solutionVideo');


cloudinary.config({
    cloud_name: process.env.CDN_CLOUD_NAME,
    api_key: process.env.CDN_API_KEY,
    api_secret: process.env.CDN_API_SECRET,
});

const generateUploadSignature = async(req,res) => {

    try {
        const { problemId } = req.params;

        const userId = req.data._id;

        const problem = await Problem.findById(problemId);
        if (!problem) 
            return res.status(404).json({ error: 'Problem Not Found' });

        //generate unique public id for the vid
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `littcode-solutions/${problemId}/${userId}_${timestamp}`;

        //upload params
        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId
        };

        //generate sign
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CDN_API_SECRET
        );

        res.json({
            signature, //all the uploadParams should be sent, to verify signature by cdn
            timestamp,
            public_id: publicId,
            api_key: process.env.CDN_API_KEY, //for finding api_secret by cdn
            cloud_name: process.env.CDN_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CDN_CLOUD_NAME}/video/upload`
        });    
    }
    catch (err) {
        console.error('Error Generating Upload Signature');
        res.status(500).json({ error: 'Failed To Generate Upload Credentials' });
    }
};

const saveVideoMetadata = async(req,res) => {

    try {
        const {
            problemId,
            cdnPublicId,
            secureUrl,
            duration
        } = req.body;
    
        const userId = req.data._id;

        //verify upload with cdn
        const cloudinaryResource = await cloudinary.api.resource( //all the details of vid is here in obj
            cdnPublicId,
            { resource_type: 'video' }
        );

        if (!cloudinaryResource) 
            return res.status(400).json({ error: 'Video Not Found On Cloudinary' });

        //check if video already exists for this problem and user
        const existingVideo = await SolutionVideo.findOne({
            problemId,
            userId,
            cdnPublicId
        });

        if (existingVideo) 
            return res.status(409).json({ error: 'Video Already Exists' });

        // const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
        //     resource_type: 'image',
        //     transformation: [
        //         { width: 400, height: 225, crop: 'fill' },
        //         { quality: 'auto' },
        //         { start_offset: 'auto' }
        //     ],
        //     format: 'jpg'
        // });

        const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, { resource_type: 'video' });

        const videoSolution = await SolutionVideo.create({
            problemId,
            userId,
            cdnPublicId,
            secureUrl,
            duration: cloudinaryResource.duration || duration,
            thumbnailUrl
        });

        res.status(201).json({
            message: 'Video Solution Saved Successfully',
            videoSolution: {
                id: videoSolution._id,
                thumbnailUrl: videoSolution.thumbnailUrl,
                duration: videoSolution.duration,
                uploadedAt: videoSolution.createdAt
            }
        });
    }
    catch (err) {
        console.error('Error Saving Video Metadata: ', err);
        res.status(500).json({ error: 'Failed To Save Video Metadata' });
    }
};

const deleteVideo = async (req,res) => {

    try {
        const { problemId } = req.params;
        const userId = req.data._id;

        const video = await SolutionVideo.findOneAndDelete({problemId: problemId}); //this will dlt vid from db

        if (!video)
            return res.status(404).json({ error: 'Video Not Found' });

        await cloudinary.uploader.destroy(video.cdnPublicId, { //this will destroy vid from cdn
            resource_type: 'video',
            invalidate: true
        });

        res.status(201).json({
            message: 'Video Deleted Successfully'
        })


    }
    catch (err) {
        console.error('Error While Deleting Video: ', err);
        res.status(500).json({ error: 'Failed To Delete Video' });
    }
};

module.exports = { generateUploadSignature, saveVideoMetadata, deleteVideo }
