import { Request, Response, Router } from "express";
import auth from '#rootTS/lib/middleware/auth';
import multer, { memoryStorage } from "multer";
import { IResponseErrorMessage } from "#root/@types/interface";

const router: Router = Router();

const storage = memoryStorage()
const upload = multer({ storage })

router.post('/forReturn/v1/uploadReturnImages', auth, upload.single("image"), (req: Request, res: Response) => {
    const { file } = req;
    let errorMsg: IResponseErrorMessage = { msg: "Bad request" }
    if (!file) return res.status(400).json(errorMsg)

    console.log(file)
    return res.send("success");
});