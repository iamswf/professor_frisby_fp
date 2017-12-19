/**
 * @file main
 * @author iamswf@163.com
 */

const Task = require('data.task');
const Spotify = require('./spotify');
const {List} = require('immutable-ext');
const {Sum, Pair} = require('./monoid');


const argv = new Task((rej, res) => res(process.argv));
const names = argv.map(args => args.slice(2));

const Intersection = xs => ({
    xs,
    concat: o => Intersection(xs.filter(x => o.xs.some(y => x === y)))
});

const related = (name) =>
    Spotify.findArtist(name)
    .map(artist => artist.id)
    .chain(Spotify.relatedArtists)
    .map(artists => artists.map(artist => artist.name));

// const artistIntersection = rels1 => rels2 =>
//     Intersection(rels1).concat(Intersection(rels2)).xs;

// const main = ([name1, name2]) =>
//     Task.of(artistIntersection)
//     .ap(related(name1))
//     .ap(related(name2));

// const artistIntersection = rels =>
//     rels.foldMap(Intersection).xs;

const artistIntersection = rels =>
    rels
    .foldMap(x => Pair(Intersection(x), Sum(x.length)))
    .bimap(x => x.xs, y => y.x)
    .toList();


const main = names =>
    List(names)
    .traverse(Task.of, related)
    .map(artistIntersection);

names.chain(main).fork(console.error, console.log);
