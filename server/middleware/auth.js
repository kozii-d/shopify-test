import {Shopify} from "@shopify/shopify-api";
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";
import {ActiveShopModel} from "../models/ActiveShopModel.js";

export default function applyAuthMiddleware(app) {
    app.get("/auth", async (req, res) => {

        const redirectUrl = await Shopify.Auth.beginAuth(
            req,
            res,
            req.query.shop,
            "/auth/callback",
            app.get("use-online-tokens")
        );

        res.set("Content-Type", "text/html");

        res.send(
            topLevelAuthRedirect({
                apiKey: Shopify.Context.API_KEY,
                host: req.query.host,
                redirectUrl: redirectUrl,
            })
        );

    });

    app.get("/auth/callback", async (req, res) => {
        try {
            const session = await Shopify.Auth.validateAuthCallback(
                req,
                res,
                req.query
            );

            await ActiveShopModel.updateOne({shop: session.shop}, {
                    shop: session.shop,
                    scope: session.scope
                },
                {
                    upsert: true,
                    setDefaultsOnInsert: true
                });

            const response = await Shopify.Webhooks.Registry.register({
                shop: session.shop,
                accessToken: session.accessToken,
                topic: "APP_UNINSTALLED",
                path: "/webhooks",
            });

            if (!response["APP_UNINSTALLED"].success) {
                console.log(
                    `Failed to register APP_UNINSTALLED webhook: ${response.result}`
                );
            }

            // Redirect to app with shop parameter upon auth
            res.redirect(`https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`);
        } catch (e) {
            switch (true) {
                case e instanceof Shopify.Errors.InvalidOAuthError:
                    res.status(400);
                    res.send(e.message);
                    break;
                case e instanceof Shopify.Errors.CookieNotFound:
                case e instanceof Shopify.Errors.SessionNotFound:
                    // This is likely because the OAuth session cookie expired before the merchant approved the request
                    res.redirect(`/auth?shop=${req.query.shop}`);
                    break;
                default:
                    res.status(500);
                    res.send(e.message);
                    break;
            }
        }
    });
}
