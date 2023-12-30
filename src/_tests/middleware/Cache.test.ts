import request from "supertest"
import app from "../../App"
import Cache from "../../util/Cache"

jest.setTimeout(15000)

describe("Cache tests", () => {
    test("2 hit, 1 miss", async () => {
        // 3 times
        await request(app).get("/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")
        await request(app).get("/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")
        await request(app).get("/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")

        expect(Cache.cache.stats.hits).toBeCloseTo(2)
        expect(Cache.cache.stats.misses).toBeCloseTo(1)
    })

    test("3 miss", async () => {
        // 3 times
        const a = [request(app).get("/mashup/f6f69dba-4c49-4f1b-a6bc-678c1154f32d"), request(app).get("/mashup/b7ffd2af-418f-4be2-bdd1-22f8b48613da"), request(app).get("/mashup/f2dfdff9-3862-4be0-bf85-9c833fa3059e")]

        await Promise.all(a)

        expect(Cache.cache.stats.hits).toBeCloseTo(2)
        expect(Cache.cache.stats.misses).toBeCloseTo(4)
    })
})