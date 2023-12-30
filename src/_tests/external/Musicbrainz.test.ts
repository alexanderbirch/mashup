import Musicbrainz from "../../external/Musicbrainz";

// Don't do this at home
describe("Musicbrainz API", () => {

    test("valid mbid", async () => {
        const mb = await Musicbrainz("65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")

        expect(mb.releaseGroups()).toBeTruthy()
        expect(mb.wikidataRelation() || mb.wikipediaRelation()).toBeTruthy()
    })

    test("invalid mbid", async () => {
        expect.assertions(0)

        try {
            const mb = await Musicbrainz("5f4f0c5-ef9e-490c-aee3-909e7ae6b2ad")
            expect(mb).toBeDefined()
        } catch (error) { }
    })

})