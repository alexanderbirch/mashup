import request from "supertest";
import app from "../../App";
import RateLimiter from "../../util/RateLimiter"


jest.setTimeout(15000)

describe("requests per second", () => {

    const repeats = 3;
    for (let i = 1; i < 4; i++) {
        test(i + "requests per second", async () => {
            const r = new RateLimiter(i);

            const start = jest.now()

            for (let j = 0; j < repeats; j++)
                await r.next().then(() => {
                    const duration = jest.now() - start;

                    expect(duration).toBeGreaterThan(j * r.requestWait)
                    expect(duration).toBeLessThan((j + 1) * r.requestWait)
                })
        })
    }
})

describe("full queue", () => {
    test("rate limiter", async () => {
        const r = new RateLimiter(1, 3000)

        expect.assertions(1);
        const a = []
        for (let i = 0; i < r.maxWaiting + 1; i++)
            a.push(r.next().catch(e => expect(e.message).toMatch(/Queue is full/)))


        await Promise.all(a)
    })

    test("ratelimiter api timeout", async () => {
        const r = new RateLimiter(0.5, 3500)

        app.get("/testroute", async (_req, res) => {
            try {
                await r.next()
            } catch (_error) {
                return res.status(503).send("Too many requests. Please wait.")
            }

            return res.status(200).send("ok")
        })

        expect.assertions(1)

        const a = []
        for (let i = 0; i < r.maxWaiting + 1; i++)
            a.push(request(app)
                .get("/testroute")
                .send()
                .then(res => {
                    if (res.status != 200)
                        expect(res.status).toBe(503)
                }))

        await Promise.all(a)

    })
})