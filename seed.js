const csv = require('csvtojson')

const dataFilePath = 'starbucks_us_locations.csv'
const graphqlEndpoint = ''

const mutation = /* GraphQL */ `
mutation ($data: StarbucksCreateInput!, $latitude: Float!, $longitude: Float!) {
    createGeoScopedStarbucks(data: $data, latitude: $latitude, longitude: $longitude)
  }`

// If a request fails due to stress just set this to the last executed index from the log
let startIndex = 0

const run = async () => {

    const data = await csv().fromFile(dataFilePath)
    const count = data.length
    for (let i = startIndex; i < count; i++) {
        const request = require('graphql-request').request
        if(!data[i]) continue
        const args = {
            latitude: data[i].lat ? parseFloat(data[i].lat) : 0,
            longitude: data[i].lon ? parseFloat(data[i].lon) : 0,
            data: {
                address: data[i].address ? data[i].address : 'N/A',
                storeId: data[i].storeId ? data[i].storeId : 'N/A'
            }
        }
        const req = request(graphqlEndpoint, mutation, args)
        const res = await req
        console.log('response:', res)
        console.log(`${i} down ${count - i - 1} to go`)
    }

    console.log('Complete')
}

run()