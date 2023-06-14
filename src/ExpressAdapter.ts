import HttpServer from "./HttpServer";
import express, { Request, Response } from "express";

export default class ExpressAdapter implements HttpServer {

    app: any;

    constructor () {
        this.app = express();
        this.app.use(express.json()); //body parser
    }

    on(method: string, url: string, callback: Function): void {
        //app.post("/checkout", async (req: Request, res: Response) => {
        this.app[method](url, async (req: Request, res: Response) => {
            try{ 
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch(e: any) {
                res.status(422).json({
                    message: e.message
                });
            }
        });
    }
    listen(port: number): void {
        this.app.listen(port);
    }

    
}