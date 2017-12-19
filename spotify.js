/**
 * @file request api
 * @author iamswf@163.com
 */

const request = require('request');
const Task = require('data.task');
const Either = require('data.either');

const httpGet = url =>
    new Task((rej, res) =>
        request(url, (error, response, body) =>
            error ? rej(error) : res(body)));

const first = xs =>
    Either.fromNullable(xs[0]);

const eitherToTask = e =>
    e.fold(Task.rejected, Task.of);

const parse = Either.try(JSON.parse);

const findArtist = name =>
    httpGet(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
    .map(parse)
    .chain(eitherToTask)
    .map(result => result.artists.items)
    .map(first)
    .chain(eitherToTask); // we hope findArtist return a task

const relatedArtists = id =>
    httpGet(`https://api.spotify.com/v1/artists/${id}/related-artists`)
    .map(parse)
    .chain(eitherToTask)
    .map(result => result.artists);

module.exports = {findArtist, relatedArtists};
