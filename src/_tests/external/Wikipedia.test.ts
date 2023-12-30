import Wikipedia from "../../external/Wikipedia"

// Don't do this at home
describe("Wikipedia API", () => {

    test("valid link", async () => {
        const wd = await Wikipedia("https://en.wikipedia.org/wiki/Metallica")

        expect(wd.description()).toBeTruthy()
    })

    test("valid link, invalid id", async () => {
        const wd = await Wikipedia("https://en.wikipedia.org/wiki/aaaazzMetallica")

        expect(wd.description()).toBeFalsy()
    })

    test("invalid link", async () => {
        expect.assertions(0)
        try {
            const wd = await Wikipedia("/")
            expect(wd.data).toBeTruthy()
        } catch (_error) { }

    })
})