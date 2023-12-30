import { RequestHandler } from "express";
import Cache from "../util/Cache";

const CacheUpdate: RequestHandler = async (req, res) => {
    Cache.update(req.params.mbid, { status: res.statusCode, data: res.locals.json })

    return res.status(res.locals.status).json(res.locals.json)
}

export default CacheUpdate