import { v4 as uuidv4 } from 'uuid';
import app from "../../App";
import request from "supertest";
import ValidateRequest from '../../middleware/ValidateRequest';

describe("validate MBID", () => {
    app.get("/mbid/:mbid", ValidateRequest, (_req, res) => {
        res.status(200).send("ok")
    })

    test("Invalid", async () => {
        await request(app).get("/mbid/123").expect(404)
    })

    test("random generated uuids", () => {
        const ids = [...new Array(10)].map(() => uuidv4());

        ids.forEach(async id => {
            await request(app).get(`/mbid/${id}`).expect(200)
        })
    })
})