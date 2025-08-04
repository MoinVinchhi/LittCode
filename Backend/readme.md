Pagination

const page = 2;
const limit = 10;
const skip = (page-1) * limit;

Problem.find().skip().limit();

---

const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

const getProblem = await Problem.findById(id).select('-hiddenTestCases -problemCreator -__v');

---

const user = await User.findById(userId).populate('problemSolved'); ---> for all the fields

yeh problemSolved vala jisko ref kar rha hai uski sari info leke aao
in model:-

problemSolved: {
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    unique: true
},

---

userSchema.post('`findOneAndDelete`', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
})

- post means, after the mentioned operation
- this `findOneAndDelete` is mongodb method
- when we run `findByIdAndDelete`, mongoose calls `findOneAndDelete` internally
- when this `findByIdAndDelete` runs on userSchema, this function will call
- when we run `findOneAndDelete`, it returns the user's info -> userInfo

other method(simple):

const userId = req.data._id;

//user schema
await User.findByIdAndDelete(userId);

//submission schema
await Submission.deleteMany({userId});

res.status(200).send('Deleted Successfully');

---

indexing creates automatically for `_id` and also for `unique: true`

Compound Index:

submissionSchema.index({userId: 1, problemId: 1});

- here 1 means ascending order, and we can use -1 for descending

---

```js
app.use(cors ({
    origin: 'http://localhost:5173', //tokens are only valid for this origin only all other hosts will be blocked, for all use '*'
    credentials: true
}))
```

---

Microservices:

- database is in various parts or components

- 1 db cannot connect directly with other, it can connect with only API req

- 1 service can talk with another only through API

- every part of backend or db works independently

For example:

- 1 backend is for user and other one is for problem

- Now if any user make a call to create problem, then createProblem should call userAuth via API (because there is no direct connection) first to check that this user is valid user or not

---

text ko travel karna ho to JSON me karega and binary me convert krke store krega

JSON is basically a string

but image/video ko kaise krega??

-> image === in bytes form => we store the binary

now if we convert the bytes into JSON and then convert it to binary form to store

then, this travelling data (in JSON) will take 33% more storage

for eg., if the video has size of 100 MB, then if we convert into JSON and then travelling the data, this JSON will be of size 133 MB

now when we want to access that video, it converts first binary to JSON and then in bytes

=> we use **multi-part/form-data**

**Form-data - A library to create readable "multipart/form-data" streams. Can be used to submit forms and file uploads to other web applications.**

we can directly travel the data in multi-part/form-data format

when it backend receives JSON data, express.json() converts JSON to origional form

but when it receives multi-part/form-data, kya wo multi-part/form-data form ko convert kr payega?? 

-> no it can't, so we use **multer** which can handle multi-part/form-data

multer ka kam itna hai ki backend pr jo data aata hai usko ek given location pr store krana hai

it stores in server's disk storage/secondary storage

after that, we can decide where we want to store it, in server's secondary storage or file storage system (eg., Cloudinary, Amazone s3)

**Video Streaming**: some parts will send, for example 100 MB video will send like 10 MB parts, suppose this video is streaming, and 60% has completed, and a network error occured, and after a while it is fixed, now in streaming this will again stream from 0%

Instead we use chunks, for examle 1GB file is there, we send chunks of 100MB, suppose 4 chunks has sent successfully, and in 5th chunk error occured, so this chunk will cancle and then again this 5th chunk will be streamed

---

How this works with Cloudinary???

1. When we create an account on cdn, it provides 3 things: API Secret(private key), API Key(public key), Cloud Name(username)

2. Then frontend sends request backend to backend, that I want to stream video on cdn, in reply it gives: params (timestamp(for this time period only, you can stream) -required(because this will only make diff with more other reqs), folder(folder name), resource_type(eg, video)) and Digital Signature (of params)

3. Then fronted will send video and this all info to cdn, and cdn will verify this digital sign and after that it will start storing

how it will verify?? => cdn has already private key correspond to public key, so this will get the params from received req, and then hash it with that private key and compare with the received req's digital sign

---
