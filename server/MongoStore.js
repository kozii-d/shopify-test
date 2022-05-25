import {MongoStoreModel} from "./models/MongoStoreModel.js";
import {Session} from "@shopify/shopify-api/dist/auth/session/index.js";

class MongoStore {

    async storeCallback(session) {
        try {
            await MongoStoreModel.updateOne({id: session.id}, {
                id: session.id,
                data: session
            },
    {
                upsert: true,
                setDefaultsOnInsert: true
            });

            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    async loadCallback(id) {
        try {
            let reply = await MongoStoreModel.findOne({id});
            if (reply) {
                let session = reply.data;

                return Session.cloneSession(session, session.id);
            } else {
                return undefined;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteCallback(id) {
        try {
            return await MongoStoreModel.deleteOne({id});
        } catch (err) {
            throw new Error(err);
        }
    }

}

export default MongoStore;