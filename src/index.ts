import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./router/video-router";

const app = express();
const port = process.env.PORT || 5000;
const parserMiddleWare = bodyParser();

// Middleware
app.use(parserMiddleWare); // -- bodyParser
app.use('/videos', videoRouter); // -- Routing

// Testing delete all data
app.delete('/testing/all-data', (req:Request, res:Response) => {
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log(`App started at ${port} port!`)
})