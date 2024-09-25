module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/custom',
            handler: 'review.customAction',
            config: {
                auth: false,
            }
        }
    ]
}