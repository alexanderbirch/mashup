import request from "supertest"
import app from "../App"
import { v4 as uuidv4 } from 'uuid';


jest.setTimeout(15000)

describe("API functional test", () => {
    test("valid MBID", async () => {
        const response = await request(app).get("/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")
        expect(response.ok).toBeTruthy()
        expect(response.body.mbid).toBeTruthy()
        expect(response.body.description).toBeTruthy()
        expect(response.body.albums).toBeTruthy()
    })

    test("invalid MBID, valid uuid", async () => {
        const response = await request(app).get(`/mashup/${uuidv4()}`)
        expect(response.ok).toBeFalsy()
    })


    test("invalid MBID, invalid uuid", async () => {
        const response = await request(app).get(`/mashup/123`)
        expect(response.ok).toBeFalsy()
    })
})