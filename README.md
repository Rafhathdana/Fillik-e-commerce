# Fillik-e-commerce

Fillik is a full-featured e-commerce website designed to provide a seamless online shopping experience. It offers a wide range of products, secure payment options, and intuitive navigation to enhance customer satisfaction and drive sales.

## Features

### User-Facing Features

- **Product Catalog**: Explore a vast catalog of products, organized into categories and subcategories, making it easy to find desired items.
- **Product Search**: Utilize the search functionality to quickly locate specific products by name, keywords, or attributes.
- **Product Filters**: Narrow down product results using filters such as color, category, and gender.
- **Product Zoom**: Utilize the magic zoom function to get a closer look at product images.
- **Shopping Cart**: Add products to the shopping cart for easy management and seamless checkout.
- **Wishlist**: Save desired products to a wishlist for future reference or purchase.
- **User Authentication**: Create user accounts, log in, and manage personal information securely.
- **Mobile OTP Verification**: Verify user mobile numbers using OTP for added security.
- **Forgot Password**: Retrieve passwords through OTP sent via email.
- **Payment Methods**: Choose from various payment methods, including Razor Pay, PayPal, and cash on delivery.
- **Return and Cancel**: Easily initiate returns or cancel orders as per the return policy.
- **Coupon Code**: Apply coupon codes for discounts during checkout.
- **Delivery Charge**: Display delivery charges based on the user's location.
- **GST Calculation**: Show applicable GST charges during the checkout process.
- **Address Management**: Add, edit, and delete user addresses for accurate and convenient delivery.

### Merchant-Facing Features

- **Mobile OTP Verification**: Verify merchant mobile numbers using OTP for added security.
- **Merchant Dashboard**: View the total pending amount, total sales, and graphs showcasing returns, completed, canceled, and pending orders and amounts.
- **Product Management**: Add, edit, and upload product images and descriptions.
- **Profile Management**: Edit merchant profile information and upload profile images.
- **Order Management**: View and manage orders, including different order statuses such as accepted, pending, packed, sent, returned, received back, completed, user-canceled, etc.
- **Sales Reports**: Generate sales reports for weekly, monthly, yearly, and daily periods and download them in CSV or PDF format.

### Admin-Facing Features

- **Admin Authentication**: Authenticate admins with OTP for added security.
- **User Management**: Handle user accounts, including blocking, editing, and managing user data.
- **Merchant Management**: Handle merchant accounts, including blocking, editing, and managing product data.
- **Coupon Management**: Add, edit, delete, and update coupon codes for discounts.
- **Category Management**: Manage categories such as gender, color, pattern, etc., including adding, editing, and deleting categories.
- **Banner Management**: Add, edit, and delete banners for promotional purposes, including adding images to banners.
- **Sales Reports**: Generate sales reports for each merchant, product, or order on a daily, weekly, monthly, and yearly basis and download them in CSV or PDF format.
- **Dashboard**: Display statistics on user and merchant growth, total GST, profit, delivery charges, etc., with graphs for monthly, daily, and yearly insights.

## Installation

Follow these steps to set up Fillik locally:

1. Clone the repository:
2. Install the required dependencies:
cd fillik
npm install
3. Configure the environment variables. Rename the `.env.example` file to `.env` and update the necessary variables with your specific configurations.

4. Set up the database by running the provided SQL scripts or connecting to your preferred database management system.

5. Start the application:
npm start
6. Open your browser and navigate to `http://localhost:3000` to access Fillik.


## Contributing

We welcome contributions to Fillik! If you find any bugs, have feature requests, or want to contribute enhancements, please submit an issue or create a pull request.



