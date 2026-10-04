\# AnishMart



AnishMart is a multi-role e-commerce marketplace web application developed as an academic capstone project.



The system allows Buyers to browse and purchase products, Sellers to manage product listings, and Admins to monitor users, products, and orders.



\---



\## Live Application



Production URL:



https://anishmart-production.up.railway.app



Health Check:



https://anishmart-production.up.railway.app/api/health



The application is deployed on Railway with a Railway-hosted MySQL database.



\---



\## Problem Statement



Small e-commerce marketplaces need a simple system where sellers can manage products, buyers can search and purchase products, and administrators can manage marketplace activities.



AnishMart provides these features in a single web application with Buyer, Seller, and Admin roles.



\---



\## Main Features



\### Buyer



\- User registration and login

\- Browse products

\- Search and filter products

\- Dynamic product categories

\- Product sorting

\- Add products to cart

\- Update cart quantity

\- Remove products from cart

\- Wishlist

\- Cash on Delivery checkout

\- Saved delivery address

\- Order history

\- Order status

\- Product reviews and star ratings

\- Profile management

\- Password change



\### Seller



\- Seller registration and login

\- Seller dashboard

\- Add products

\- Edit products

\- Delete / deactivate products

\- Manage price

\- Manage stock

\- Manage category

\- Add product image URL



\### Admin



\- Admin login

\- Admin dashboard

\- View users

\- View products

\- Remove products

\- View orders

\- Update order status

\- View order details

\- Invoice / print support



\### PWA



\- Installable web application

\- Web App Manifest

\- Service Worker

\- Offline fallback page

\- Mobile responsive interface



\---



\## Technology Stack



| Component | Technology |

|---|---|

| Frontend | HTML5, CSS3, JavaScript |

| Backend | Node.js, Express.js |

| Database | MySQL |

| Database Driver | mysql2/promise |

| Password Security | bcryptjs |

| API | REST-style JSON API |

| Deployment | Railway |

| Version Control | Git and GitHub |

| PWA | Manifest + Service Worker |



\---



\## System Architecture



```text

Browser / PWA

&#x20;     |

&#x20;     | HTTP / Fetch

&#x20;     v

Express.js Server

&#x20;     |

&#x20;     +----------------------+

&#x20;     | User Routes          |

&#x20;     | Product Routes       |

&#x20;     | Cart Routes          |

&#x20;     | Order Routes         |

&#x20;     | Review Routes        |

&#x20;     | Wishlist Routes      |

&#x20;     | Admin Routes         |

&#x20;     +----------------------+

&#x20;     |

&#x20;     v

Controllers / Business Logic

&#x20;     |

&#x20;     v

mysql2 Connection Pool

&#x20;     |

&#x20;     v

MySQL Database

