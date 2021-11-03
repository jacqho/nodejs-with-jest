const { getGeoCoordinates } = require('../map-api');

describe('Google Geocode API', () => {
    it('should be able to return geo coordinated', async () => {
        const ret = await getGeoCoordinates('451 Phillip St, Waterloo, ON N2L 3X2');
        expect(ret.latitude).toBe(43.48246719999999);
        expect(ret.longitude).toBe(-80.54332409999999);
    });

    it('should throw error due to empty input', async () => {
        config = require('../../../config');
        const apiKey = config.third_parties.google.apikey;
        config.third_parties.google.apikey = "dummy";
        failapi = require('../map-api');
        await expect(
            async() => {
                await failapi.getGeoCoordinates('451 Phillip St, Waterloo, ON N2L 3X2')
            }
        ).rejects.toEqual(new Error("Unable to get geo coordinates. The provided API key is invalid."));
        config.third_parties.google.apikey = apiKey;
    });

    it('should throw error due to payload return multiple geo coordinates', async () => {
        await expect(
            async() => {
                await getGeoCoordinates('Waterloo')
            }
        ).rejects.toEqual(new Error("Unable to get geo coordinates as it has multiple returns."))
    });
});