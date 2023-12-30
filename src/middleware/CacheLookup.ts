import { RequestHandler } from "express";
import Cache from "../util/Cache";

const CacheLookup: RequestHandler = async (req, res, next) => {
    const cachedResponse = await Cache.lookup(req.params.mbid)

    // Cache miss
    if (!cachedResponse)
        next()
    else
        return res.status(cachedResponse.status).json(cachedResponse.data)
}

export default CacheLookup