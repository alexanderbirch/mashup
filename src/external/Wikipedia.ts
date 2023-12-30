export class Wikipedia {
    /**
     * Extracts the ID from wikidata URL
     */
    static #filterId = (url: string) => url.match(/(\/wiki\/)?([^\/]+)$/)?.[2]

    /**
     * Lookup API and return promise of constructed new object
     */
    static lookup = async (wikipediaRelation: string) => {
        // Extract 
        const filteredTitle = this.#filterId(wikipediaRelation);

        if (!filteredTitle) {
            throw new Error("Could not extract wiki title")
        }

        // URL encode
        const title = encodeURIComponent(filteredTitle)

        return fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${title}`, { method: 'GET', headers: { 'Accept': 'application/json' } })
            // Extract status and json      
            .then(async res => {
                return {
                    status: res.status,
                    data: res.ok ? await res.json() : undefined
                }
            })
            .catch(e => new this())
            // Json resolved
            .then(d => new this(d.data.error ? undefined : d.data))

    }

    /**
     * Construct new object from response
     */
    constructor(public data?: { query: { pages: { [id: string]: { extract: string } } } }) {
    }

    /**
     * Extracts the description data
     */
    description = () => {
        if (this.data) {
            const keys = Object.keys(this.data.query.pages)
            return this.data.query.pages[keys[0]]?.extract
        }
    }
}


export default Wikipedia.lookup