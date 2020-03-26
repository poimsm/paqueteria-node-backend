const webpush = require('web-push');

const pushNotification = require('../../models/web-notification');

webpush.setVapidDetails(
    'mailto:you@domain.com',
    process.env.PUBLIC_VAPID,
    process.env.PRIVATE_VAPID
);


module.exports = {

    subscription: async (req, res, next) => {
        const id = req.query.id;
        const subscription = req.body;

        const notificacion = await pushNotification.findOne({ usuario: id });

        if (!notificacion) {

            const data = {
                usuario: id,
                subscription,
                created: new Date().getTime()
            };

            await pushNotification.create(data);
            return res.status(200).json({ ok: true });
        } else {

            await pushNotification.findByIdAndUpdate(notificacion._id, subscription);
            return res.status(200).json({ ok: true });
        }
    },

    sendNotification: async (req, res, next) => {
        const id = req.query.id;
        const payload = req.body;

        const data = await pushNotification.findOne({ usuario: id });

        const subscription = data.subscription;

        await webpush.sendNotification(
            subscription,
            JSON.stringify({ notification: payload })
        );

        res.status(200).json({ ok: true });
    },

}