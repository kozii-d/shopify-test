import {createClient} from 'redis';
import {Shopify} from "@shopify/shopify-api";
import {Session} from "@shopify/shopify-api/dist/auth/session/index.js";

class RedisStore {
    constructor() {
        // Create a new redis client and connect to the server
        this.client = createClient({
            url: 'redis://localhost:6379',
        });
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        this.client.connect();
    }

    async storeCallback(session) {
        try {
            return await this.client.set(session.id, JSON.stringify(session));
        } catch (err) {
            throw new Error(err);
        }
    }

    async loadCallback(id) {
        try {
            let reply = await this.client.get(id);
            if (reply) {
                const session = JSON.parse(reply);

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
            return await this.client.del(id);
        } catch (err) {
            throw new Error(err);
        }
    }

}

export default RedisStore;