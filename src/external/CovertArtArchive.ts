import RateLimiter from "../util/RateLimiter"
import { Musicbrainz } from "./Musicbrainz"

// This seems to happen too fast
const r = new RateLimiter(8);

class CovertArtArchive {
    /**
     * Lookup API and return promise of constructed new object
     */
    static lookup = (releaseGroups: ReturnType<typeof Musicbrainz.prototype.releaseGroups>) => {
        // Return fetch and construct promise
        return releaseGroups.map(async rg => {
            await r.next()
            return fetch(`http://coverartarchive.org/release-group/${rg.id}`, { method: 'GET', headers: { 'Accept': 'application/json' }, redirect: "follow" })
                .then(async res => {
                    return {
                        data: res.ok ? await res.json() : undefined
                    }
                })
                .catch(e => new this(rg.id, rg.title))
                // Json resolved
                .then(d => new this(rg.id, rg.title, d.data))

        })
    }

    /**
     * Construct new object from response
     */
    constructor(public id: string, public title: string, public data?: { images: { front: boolean, image: string }[] }) {
    }

    /**
     * List of albums (id, title, cover image url)
     */
    album = () => {
        return {
            id: this.id,
            title: this.title,
            image: this.data?.images.find(d => d.front)?.image
        }
    }
}


export default CovertArtArchive.lookup