const _ = require('lodash');
const axios = require('axios');

const URL = `https://howrare.is/legionpunks/`;

const get = async id => (await axios.get(`${URL}${id}`)).data;

module.exports = {
    get,
}