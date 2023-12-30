import RateLimiter from "../util/RateLimiter"

// Header to make musicbrainz API happy
const userAgentHeader = {}

// Rate limiter of 1 per second
const r = new RateLimiter(1)

export class Musicbrainz {
    /**
     * Lookup API and return promise of constructed new object
     */
    static lookup = async (id: string) => {
        // Throttle artist lookups
        await r.next()

        // Return fetch and construct promise
        try {
            const mbdata = await fetch(`http://musicbrainz.org/ws/2/artist/${id}?&fmt=json&inc=url-rels+release-groups`, { method: 'GET', headers: { "User-Agent": "mashup-cygni/1.0.0 ( alexisbirch@gmail.com )", 'Accept': 'application/json' } })

            if (!mbdata.ok)
                throw Error("Bad response from musicbrainz")

            return new this(await mbdata.json())
        } catch (e) {
            throw Error("Fetch from musicbrainz failed")
        }
    }

    /**
     * Construct new object from response
     */
    constructor(public data: { relations: any[], ["release-groups"]: any[] }) {
    }

    /**
     * Process wikidata relations
     */
    wikidataRelation = () => this.data.relations.filter(v => v.type == "wikidata").map(v => v.url.resource)[0] as string | undefined

    /**
     * Process wikipedia relations
     */
    wikipediaRelation = () => this.data.relations.filter(v => v.type == "wikipedia").map(v => v.url.resource)[0] as string | undefined

    /**
     * Process release groups
     */
    releaseGroups = () => this.data["release-groups"].map((v => { return { title: v.title, id: v.id } }))
}


export default Musicbrainz.lookup
