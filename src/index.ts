import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import {videoRouter} from "./routes/video-router";

const app = express();
const port = process.env.PORT || 5000;
const parserMiddleWare = bodyParser();

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!!')
})

// Middleware
app.use(parserMiddleWare); // -- bodyParser
app.use('/videos', videoRouter); // -- Routing

// Testing delete all data
app.delete('/testing/all-data', (req:Request, res:Response) => {
    //TODO delete data
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log(`App started at ${port} port!`)
})