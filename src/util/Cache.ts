import { Semaphore } from "async-mutex"
import NodeCache from "node-cache"

type cacheType = { status: number, data: { mbid: string, description?: String, albums: { id: string, title: string, image?: string }[] } }

class Cache {
    // Cache 1 day, up to 10e5 keys
    readonly cache = new NodeCache({ stdTTL: 60 * 60 * 24 })

    // Lock processes waiting for the same request before caching (edge case)
    readonly semaphores = new NodeCache({ stdTTL: 30, useClones: false })

    /**
     * Find cached data
     */
    lookup = async (mbid: string) => {
        await this.semaphores.get<Semaphore>(mbid)?.waitForUnlock()

        const data = this.cache.get<cacheType>(mbid);
        if (!data) {
            const sem = new Semaphore(1)
            sem.acquire()
            this.semaphores.set(mbid, sem);
        }

        return data;
    }

    /**
     * Update cached data
     */
    update = (mbid: string, x: cacheType) => {
        try {
            // Failure responses are shortlived
            if (x.status != 200) {
                this.cache.set(mbid, x, 60 * 10)
            } else {
                this.cache.set(mbid, x)
            }
        } finally {
            this.semaphores.get<Semaphore>(mbid)?.release()
        }
    }
}

export default new Cache