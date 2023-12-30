import { RequestHandler } from "express";

const ValidateRequest: RequestHandler = (request, response, next) => {
    const id = request.params.mbid || "";

    if (!id.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/))
        return response.status(404).json({ error: "MusicBrainz ID not found" })

    next()
}


export default ValidateRequest;