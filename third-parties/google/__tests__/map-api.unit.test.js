const axios = require('axios');
const googleAPI = require('../map-api');
const config = require('../../../config');

jest.mock('axios');
jest.mock('../../../config.js', () => ({ third_parties: { google: { apikey: '' } } }));

describe("Geo Coordinates", () => {
    it("Success and return valid coordinates", async () => {
        const resp = {
            data: { "results" : [ { "address_components" : [ { "long_name" : "Calle de Emilio Muñoz", "short_name" : "C. de Emilio Muñoz", "types" : [ "route" ] }, { "long_name" : "Madrid", "short_name" : "Madrid", "types" : [ "locality", "political" ] }, { "long_name" : "Madrid", "short_name" : "M", "types" : [ "administrative_area_level_2", "political" ] }, { "long_name" : "Comunidad de Madrid", "short_name" : "MD", "types" : [ "administrative_area_level_1", "political" ] }, { "long_name" : "Spain", "short_name" : "ES", "types" : [ "country", "political" ] }, { "long_name" : "28037", "short_name" : "28037", "types" : [ "postal_code" ] } ], "formatted_address" : "C. de Emilio Muñoz, 28037 Madrid, Spain", "geometry" : { "bounds" : { "northeast" : { "lat" : 40.4351484, "lng" : -3.6224135 }, "southwest" : { "lat" : 40.4297434, "lng" : -3.6325465 } }, "location" : { "lat" : 40.4321591, "lng" : -3.6274327 }, "location_type" : "GEOMETRIC_CENTER", "viewport" : { "northeast" : { "lat" : 40.4351484, "lng" : -3.6224135 }, "southwest" : { "lat" : 40.4297434, "lng" : -3.6325465 } } }, "place_id" : "ChIJoa7Ej3MvQg0RMvpwXwW91fs", "types" : [ "route" ] } ], "status" : "OK" }
        }
        config.third_parties.google.apikey = 'DUMMY';
        axios.get.mockResolvedValueOnce(resp);
        const ret = await googleAPI.getGeoCoordinates("451 Phillip St, Waterloo, ON N2L 3X2");
        expect(ret.latitude).toBe(40.4321591);
        expect(ret.longitude).toBe(-3.6274327);
    });

    it("Response Status Failure", async () => {
        const resp = {
            data: { "error_message" : "The provided API key is invalid.", "results" : [], "status" : "REQUEST_DENIED" }
        }
        config.third_parties.google.apikey = undefined;
        axios.get.mockResolvedValueOnce(resp);
        await expect(
            async() => {
                await googleAPI.getGeoCoordinates("451 Phillip St, Waterloo, ON N2L 3X2")
            }
        ).rejects.toEqual(new Error("Unable to get geo coordinates. The provided API key is invalid."));
    });

    it("Failure: Multiple Location Found in Address", async () => {
        const resp = {
            data: { "results" : [ { "address_components" : [ { "long_name" : "Waterloo", "short_name" : "Waterloo", "types" : [ "locality", "political" ] }, { "long_name" : "Walloon Brabant", "short_name" : "BW", "types" : [ "administrative_area_level_2", "political" ] }, { "long_name" : "Wallonia", "short_name" : "Wallonia", "types" : [ "administrative_area_level_1", "political" ] }, { "long_name" : "Belgium", "short_name" : "BE", "types" : [ "country", "political" ] }, { "long_name" : "1410", "short_name" : "1410", "types" : [ "postal_code" ] } ], "formatted_address" : "1410 Waterloo, Belgium", "geometry" : { "bounds" : { "northeast" : { "lat" : 50.7359101, "lng" : 4.44118 }, "southwest" : { "lat" : 50.6709, "lng" : 4.3548601 } }, "location" : { "lat" : 50.71469, "lng" : 4.3991 }, "location_type" : "APPROXIMATE", "viewport" : { "northeast" : { "lat" : 50.7359101, "lng" : 4.44118 }, "southwest" : { "lat" : 50.6709, "lng" : 4.3548601 } } }, "place_id" : "ChIJ2SF_LcPRw0cRgHJNL6uZAAQ", "types" : [ "locality", "political" ] }, { "address_components" : [ { "long_name" : "Waterloo", "short_name" : "Waterloo", "types" : [ "locality", "political" ] }, { "long_name" : "Jefferson County", "short_name" : "Jefferson County", "types" : [ "administrative_area_level_2", "political" ] }, { "long_name" : "Wisconsin", "short_name" : "WI", "types" : [ "administrative_area_level_1", "political" ] }, { "long_name" : "United States", "short_name" : "US", "types" : [ "country", "political" ] }, { "long_name" : "53594", "short_name" : "53594", "types" : [ "postal_code" ] } ], "formatted_address" : "Waterloo, WI 53594, USA", "geometry" : { "bounds" : { "northeast" : { "lat" : 43.198116, "lng" : -88.970208 }, "southwest" : { "lat" : 43.16871709999999, "lng" : -89.00985380000002 } }, "location" : { "lat" : 43.1838843, "lng" : -88.9884421 }, "location_type" : "APPROXIMATE", "viewport" : { "northeast" : { "lat" : 43.198116, "lng" : -88.970208 }, "southwest" : { "lat" : 43.16871709999999, "lng" : -89.00985380000002 } } }, "place_id" : "ChIJIXn6WSyIBogRsxoo3dSfG8w", "types" : [ "locality", "political" ] } ], "status" : "OK" }
        }
        config.third_parties.google.apikey = "DUMMY";
        axios.get.mockResolvedValueOnce(resp);
        await expect(
            async() => {
                await googleAPI.getGeoCoordinates("451 Phillip St, Waterloo, ON N2L 3X2")
            }
        ).rejects.toEqual(new Error("Unable to get geo coordinates as it has multiple returns."));
    });
});