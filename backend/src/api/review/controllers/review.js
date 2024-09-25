'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({strapi}) => ({
    async customAction (ctx) {
        // @ts-ignore
        const data = ctx.request.body.data;

        console.log(data);
           
        const userId = parseInt(data.users_permissions_user)
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
            fields: ['username', 'email'], 
        });
        
        console.log(user.email)

        const resId = parseInt(data.restaurant);
        const res = await strapi.entityService.findOne('api::restaurant.restaurant', resId, {
            fields: ['name', 'description'],
        });

        // Gửi mail
        strapi.plugins['email'].services.email.send({
            to: user.email,
            from: 'tieuhoangdat@gmail.com', // e.g. single sender verification in SendGrid
            subject: 'The Strapi Email plugin worked successfully',
            text: `Cảm ơn bạn đã review ${res.name}`,
        })
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.log('Error sending email:', error);
        });
     

        try {
            ctx.body = 'ok'
        } catch(err) {
            ctx.body = err
        }
    }
}));
