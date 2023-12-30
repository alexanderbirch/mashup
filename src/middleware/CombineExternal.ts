import { RequestHandler } from "express";
import CovertArtArchive from "../external/CovertArtArchive";
import Musicbrainz from "../external/Musicbrainz";
import FetchWikidata from "../external/Wikidata";
import FetchWikipedia from "../external/Wikipedia";

const CombineExternal: RequestHandler = async (req, res, next) => {
    try {
        // Get musicbrainz data
        const mb = await Musicbrainz(req.params.mbid)

        // Process data
        try {
            if (!mb.data) { throw Error("Invalid MBID") }

            // Prefer wikipedia relation
            let wikipediaRelation = mb.wikipediaRelation();
            let wikidataRelation = mb.wikidataRelation();

            // Fetch wikipedia data async
            const wikipedia = async () => {
                if (wikidataRelation && !wikipediaRelation) {

                    const wikidata = await FetchWikidata(wikidataRelation!)

                    if (!wikidata.data) { throw Error("Invalid wikidata resource") }

                    const sitelink = wikidata.sitelink()

                    if (!sitelink) { throw Error("Bad gateway") }

                    wikipediaRelation = sitelink
                } else if (!wikipediaRelation) {
                    throw Error("No wiki resources")
                }

                return FetchWikipedia(wikipediaRelation!)
            }

            // wikipedia Promise
            const wikipediaPromise = wikipedia().catch(e => { })

            // Cover art promise
            const albums: any[] = []
            for await (const ca of CovertArtArchive(mb.releaseGroups())) {
                albums.push(ca.album())
            }
            const description = (await wikipediaPromise)?.description()

            // Await and combine
            res.locals.status = 200
            res.locals.json = {
                mbid: req.params.mbid,
                description,
                albums
            }
        } catch (error: unknown) {
            res.locals.status = 502
            res.locals.json = { error: "Bad gateway." }
        }

    } catch (error: unknown) {
        res.locals.status = 503
        res.locals.json = { error: "Too many requests. Please wait." }
    } finally {
        next()
    }
}

export default CombineExternal;