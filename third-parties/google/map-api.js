const axios = require("axios");
const config = require('../../config');
const mapping = config.third_parties.google;

exports.getGeoCoordinates = async (address) => {
    const payload = await axios.get(`${mapping.api}?address=${address}&key=${mapping.apikey}`);
    
    if(payload.data.status != 'OK'){
        throw new Error(`Unable to get geo coordinates. ${payload.data.error_message}`);
    }
    if(Object.keys(payload.data.results).length > 1){
        throw new Error(`Unable to get geo coordinates as it has multiple returns.`);
    }
    const geoLocation = payload.data.results[0].geometry.location;
    return { latitude: geoLocation.lat, longitude: geoLocation.lng };
}