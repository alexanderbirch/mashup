import { Semaphore } from "async-mutex"

export default class RateLimiter {
    /**
     * Last time of fetch
     */
    #last = 0;

    /**
     * Number of processes currently waiting
     */
    #waiting = 0;

    /**
     * Limit with a semaphore
     */
    #semaphore = new Semaphore(1);

    /**
     * Derived value for maximum number of waiting processes 
     */
    readonly maxWaiting;

    /**
     * Derived value for wait time between each request
     */
    readonly requestWait;

    /**
     * 
     * @param requestsPerSecond Allowed number of requests per second
     * @param timeout The (expected) request timeout so that we can refuse requests we won't be able to handle before they enter the queue
     */
    constructor(requestsPerSecond: number, timeout = 100000) {
        this.requestWait = Math.round(1000 / requestsPerSecond);
        this.maxWaiting = Math.floor(timeout / this.requestWait);
    }

    /**
     * Resolves once the next in queue is allowed through
     */
    next = async () => {
        // No more requests allowed
        if (this.#waiting >= this.maxWaiting)
            throw Error("Queue is full")

        // One more waiting
        this.#waiting++;

        // In queue
        await this.#semaphore.acquire()
        try {
            // Through queue, now throttling
            await this.#limiter()

            // Set time of last request
            this.#last = process.hrtime()[1] / 10e6
        } finally {
            // Remove from queue and always release semaphore (just in case)
            this.#waiting--;
            this.#semaphore.release()
        }
    }

    /**
     * Resolves once next request is ready to be handled such that throttled speed is kept
     * @returns 
     */
    #limiter = async () => new Promise(resolve => setTimeout(resolve, this.#nextFetch()))

    /**
     * Milliseconds until next request can be allowed
     * @returns
     */
    #nextFetch = () => this.#last == 0 ? 0 : Math.max(0, this.requestWait - (process.hrtime()[1] / 10e6 - this.#last));
}