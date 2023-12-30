export class Wikidata {
    /**
     * Extracts the ID from wikidata URL
     */
    static #filterId = (url: string) => url.match(/wikidata.org\/wiki\/([^\/]+)$/)?.[1];

    /**
     * Lookup API and return promise of constructed new object
     */
    static lookup = async (wikidataRelation: string) => {
        // Extract 
        const filteredId = this.#filterId(wikidataRelation);

        if (!filteredId) {
            throw new Error("Could not extract wiki ID")
        }

        // URL encode
        const id = encodeURIComponent(filteredId)

        // Return fetch and construct promise
        return fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&format=json&props=sitelinks`, { method: 'GET', headers: { 'Accept': 'application/json' } })
            // Extract status and json
            .then(async res => {
                return {
                    status: res.status,
                    data: res.ok ? await res.json() : undefined
                }
            })
            .catch(e => new this(id))
            // Json resolved
            .then(d => new this(id, d.data))

    }

    /**
     * Construct new object from response
     */
    constructor(public id: string, public data?: { entities?: { [id: string]: { sitelinks: { enwiki: { title: string } } } } }) {
    }

    /**
     * Get wikipedia sitelinks
     */
    sitelink = () => {
        if (this.data?.entities) return this.data.entities[this.id].sitelinks.enwiki.title
    }
}

export default Wikidata.lookup