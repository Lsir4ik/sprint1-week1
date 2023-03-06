import {Request, Response, Router} from "express";

// Data, Typing
type Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean, // default value
    minAgeRestriction: number | null,
    createdAt: string, // $date-time
    publicationDate: string, // $date-time, default value
    availableResolutions: Array<string>
} // переделать на классах?
const resolutions: Array<string> = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const videos: Array<Video> = [];

// Routing.
export const videoRouter = Router();

// Функция, которая проверяет вхождение эдлементов массива "what" в массиве "where"
function contains(where: Array<string>, what: Array<string>): boolean {
    for (let i = 0; i < what.length; i++) {
        if (where.indexOf(what[i]) == -1) return false;
    }
    return true;
}

// GET
videoRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(videos);
});
videoRouter.get('/:id', (req: Request, res: Response) => {
    let video = videos.find(b => b.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    } else {
        res.sendStatus(404);
    }

});
// PUT
videoRouter.put('/:id', (req: Request, res: Response) => {
    let video = videos.find(el => el.id === +req.params.id);
    if (video) {
        const apiErrorResult: { errorsMessages: Array<object> } = {
            errorsMessages: []
        }
        if (!req.body.title || !(req.body.title.length < 41) || !(typeof (req.body.title) === 'string')) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "Please type correct title",
                    field: "title"
                })
        }
        if (!req.body.author || !(req.body.author.length < 21)) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "Please type correct author",
                    field: "author"
                })
        }
        if (!contains(resolutions, req.body.availableResolutions)) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "Resolutions should be in (P144, P240, P360, P480, P720, P1080, P1440, P2160)",
                    field: "availableResolutions"
                })
        }
        if (!(typeof (req.body.canBeDownloaded) === "boolean")) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "A field 'canBeDownloaded' should be boolean value",
                    field: "canBeDownloaded"
                })
        }
        if (!(+req.body.minAgeRestriction < 19 && +req.body.minAgeRestriction > 0)) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "Restriction age should be in [1, 18]",
                    field: "minAgeRestriction"
                })
        }
        if (!req.body.publicationDate) {
            apiErrorResult.errorsMessages.push(
                {
                    message: "Please type correct publication date",
                    field: "publicationDate"
                })
        }
        if (apiErrorResult.errorsMessages.length > 0) {
            res.status(400).send(JSON.stringify(apiErrorResult));
            return;
        } else {
            video.title = req.body.title;
            video.author = req.body.author;
            video.availableResolutions = req.body.availableResolutions;
            video.canBeDownloaded = req.body.canBeDownloaded;
            video.minAgeRestriction = +req.body.minAgeRestriction;
            video.publicationDate = req.body.publicationDate;
            res.sendStatus(204);
        }
    } else {
        res.sendStatus(404);
    }
});
// POST
videoRouter.post('/', (req: Request, res: Response) => {
    const apiErrorResult: { errorsMessages: Array<object> } = {
        errorsMessages: []
    }
    if (!req.body.title || !(req.body.title.length < 41) || !(typeof (req.body.title) === 'string')) {
        apiErrorResult.errorsMessages.push(
            {
                message: "Please type correct title",
                field: "title"
            })
    }
    if (!req.body.author || !(req.body.author.length < 21)) {
        apiErrorResult.errorsMessages.push(
            {
                message: "Please type correct author",
                field: "author"
            })
    }
    if (!contains(resolutions, req.body.availableResolutions)) {
        apiErrorResult.errorsMessages.push(
            {
                message: "Resolutions should be in (P144, P240, P360, P480, P720, P1080, P1440, P2160)",
                field: "availableResolutions"
            })
    }
    if (apiErrorResult.errorsMessages.length > 0) {
        res.status(400).send(JSON.stringify(apiErrorResult));
        return;
    } else {
        let date = new Date()
        let date1 = new Date()
        date1.setDate(date.getDate() + 1)
        const newVideo: Video = {
            id: +date,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: date.toISOString(),
            publicationDate: date1.toISOString(),
            availableResolutions: req.body.availableResolutions
        }
        videos.push(newVideo);
        res.status(201).send(newVideo);
    }
})
// DELETE
videoRouter.delete('/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
            return;
        } else {
            res.sendStatus(404);
        }
    }
})
