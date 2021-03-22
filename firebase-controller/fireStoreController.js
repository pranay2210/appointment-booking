const FireStore = require('@google-cloud/firestore')
const path = require('path');

class FireStoreClient {
    constructor() {
        this.fireStore = new FireStore({
            projectId: 'unique-source-192617',
            keyFilename: path.join(__dirname, '../service-firebase.json')
        })
    }

    async save(collection, data) {
        const docRef = this.fireStore.collection(collection).doc(`${data.date}|${data.time}`);
        await docRef.set(data)
    }

    async findByValue(collection, date, array) {
        const snapshot = await this.fireStore.collection('events');
        const snapshotQuery = await snapshot.where('date', '==', date).get();
        var result = snapshotQuery.docs.map(doc => doc.data())
        var finalArray;
        console.log(array)
        for (let i = 0; i < result.length; i++) {
            finalArray = removeItemAll(array, result[i].time)
            console.log(result[i].time)
        }
        console.log(finalArray)
        return finalArray;
    }
    async checkEventExist(date, time) {
        const snapshot = await this.fireStore.collection('events');
        const snapshotQuery = await snapshot.where('date', '==', date).where('time', '==', time).get();
        var result = snapshotQuery.docs.map(doc => doc.data());
        console.log("Check event Exist")
        console.log(result.length)
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    async checkEventsByDate(startDate, endDate) {

        let start = new Date(startDate);
        let end = new Date(endDate);

        const snapshot = await this.fireStore.collection('events', ref => ref
            .where('date', '>', start)
            .where('date', '<', end)
        );
        const snapshotQuery = await snapshot.get()
        var result = snapshotQuery.docs.map(doc => doc.data());
        return result
    }
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
module.exports = new FireStoreClient()