
module.exports = {
    async afterCreate(event) {
        const id = parseInt(event.params.data.restaurant);
        const userId = parseInt(event.params.data.users_permissions_user)
        console.log(event.params.data)

        const res = await strapi.entityService.findOne('api::restaurant.restaurant', id, {
            fields: ['name', 'description'],
        });

        const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
            fields: ['username', 'email'], // Các trường bạn muốn lấy
        });
        
        console.log(user.email)

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

        
        

        const entries = await strapi.entityService.findMany('api::review.review', {
            filters: { 
                restaurant: { id: id } // Sử dụng cú pháp object cho restaurant
            },
            populate: { restaurant: true },
        });
        // console.log(entries)


          
          // Tính toán trung bình rating
        const calculateAverageRating = (reviews) => {
            const totalRatings = reviews.reduce((acc, review) => {
                const ratingValue = review.rating; // Chuyển chuỗi 'five' thành 5
                return acc + (ratingValue || 0); // Nếu không có giá trị, mặc định là 0
            }, 0);
            
            const averageRating = totalRatings / reviews.length;
            return averageRating;
        };
        
        const averageRating = calculateAverageRating(entries);
        // console.log('Average Rating:', averageRating);

        const entry = await strapi.entityService.update('api::restaurant.restaurant', id, {
            data: {
                rating: averageRating,
            },
        });
    },

    async afterUpdate(event) {
        const id = parseInt(event.params.data.restaurant);
        console.log(event.params.data.restaurant)
        

        const entries = await strapi.entityService.findMany('api::review.review', {
            filters: { 
                restaurant: { id: id } // Sử dụng cú pháp object cho restaurant
            },
            populate: { restaurant: true },
        });
        console.log(entries)


          
          // Tính toán trung bình rating
        const calculateAverageRating = (reviews) => {
            const totalRatings = reviews.reduce((acc, review) => {
                const ratingValue = review.rating; // Chuyển chuỗi 'five' thành 5
                return acc + (ratingValue || 0); // Nếu không có giá trị, mặc định là 0
            }, 0);
            
            const averageRating = totalRatings / reviews.length;
            return averageRating;
        };
        
        const averageRating = calculateAverageRating(entries);
        console.log('Average Rating:', averageRating);

        const entry = await strapi.entityService.update('api::restaurant.restaurant', id, {
            data: {
                rating: averageRating,
            },
        });
    },

};