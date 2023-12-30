import CovertArtArchive from "../../external/CovertArtArchive"
import Musicbrainz from "../../external/Musicbrainz"

jest.setTimeout(15000)

// Don't do this at home
describe("Coverart API", () => {

    test("valid mbid", async () => {
        const mb = await Musicbrainz("65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab")

        for await (const ca of CovertArtArchive(mb.releaseGroups())) {
            expect(ca.album()).toBeTruthy()
        }
    })
})