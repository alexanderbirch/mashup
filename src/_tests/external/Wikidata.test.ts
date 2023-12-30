import Wikidata from "../../external/Wikidata"

// Don't do this at home
describe("Wikidata API", () => {

    test("valid link", async () => {
        const wd = await Wikidata("https://www.wikidata.org/wiki/Q15920")

        expect(wd.sitelink()).toBeTruthy()
    })

    test("valid link, invalid id", async () => {
        const wd = await Wikidata("https://www.wikidata.org/wiki/QQ15920")

        expect(wd.data).toHaveProperty("error")
    })

    test("invalid link", async () => {
        expect.assertions(0)
        try {
            const wd = await Wikidata("QQ/QQ")
            expect(wd.data).toBeFalsy()
        } catch (_error) { }

    })
})