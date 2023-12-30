## Installation
    npm install

## Running
    npm start (start server)
    npm test  (run test suite)

## Fetching data
- Musicbrainz $\to$ (Wikidata $\to$) Wikipedia + CovertArtArchive*
- $\to$ wait
- $+$ asyncronous

## Tech stack

- Node.js
- Express API
- Jest for testing
- Stress tests in Postman etc.

## Program flow

| Event | Failure | Notes |
|-|-|-|
| Validate request | Reject with 404  | UUID |
| Cache lookup | On cached failure | Returns on cache hit, waits for "pending hit" | 
| **Cache miss** |
| Musicbrainz API | Bad ID 502, too many request 503  | Rate limit 1/sec
| Wikidata | If no wikidata or wikipedia  | Unless Wikipedia link 
| Wikipedia | If no wikidata or wikipedia  |
| CoverArtArchive | | One request per album, self-imposed limit (to avoid error 503) |
| Cache update | | Updates cache and returns (failures are short-lived)

## Demo

as intended
http://localhost:5050/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab

invalid uuid
http://localhost:5050/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6

valid uuid, invalid
http://localhost:5050/mashup/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ad

Stress test (basic)
https://web.postman.co/workspace/My-Workspace~046afd47-3c8d-483e-80fd-ffa26b67ec02/collection/25509648-dd784937-730c-4105-ab19-fe117668ed7e


## Special remarks

- Cache is in-memory, proof of concept. Consider using network based cache, esp. if running more API servers.
- If the self-imposed limit on CovertArtArchive is bottlenecking performance, it might be integrate this with "too many requests" behavior from Musicbrainz limit (untested).
- The exact rate limit for CovertArtArchive has not been investigated. Claims there is no limit, but in practice the request overload caused problems. There may be other solutions than a hard rate limit.
- "Bad gateway errors" should maybe include more information (non-sensitive) 

