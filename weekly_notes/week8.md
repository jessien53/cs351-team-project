# Campus Marketplace - Backend Data Structure

## Core Tables

### 1. Items/Listings Table

**Table Name:** `items`

| Field Name           | Data Type     | Description                          | Constraints                                                             |
| -------------------- | ------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `item_id`            | UUID          | Primary key                          | PRIMARY KEY, NOT NULL                                                   |
| `seller_id`          | UUID          | Reference to user                    | FOREIGN KEY (users.user_id), NOT NULL                                   |
| `title`              | VARCHAR(200)  | Item title                           | NOT NULL                                                                |
| `description`        | TEXT          | Full description (supports markdown) | NOT NULL                                                                |
| `category_id`        | UUID          | Reference to category                | FOREIGN KEY (categories.category_id), NOT NULL                          |
| `subcategory_id`     | UUID          | Reference to subcategory             | FOREIGN KEY (categories.category_id), NULLABLE                          |
| `price`              | DECIMAL(10,2) | Item price                           | NOT NULL                                                                |
| `quantity_available` | INTEGER       | Stock quantity (999 for unlimited)   | NOT NULL, DEFAULT 1                                                     |
| `is_digital`         | BOOLEAN       | Digital service vs physical item     | NOT NULL, DEFAULT FALSE                                                 |
| `condition`          | ENUM          | Condition of item                    | ('new', 'like_new', 'good', 'fair', 'poor')                             |
| `tags`               | JSON/ARRAY    | Search tags                          | NULLABLE                                                                |
| `processing_time`    | VARCHAR(50)   | Time to fulfill                      | NULLABLE                                                                |
| `customizable`       | BOOLEAN       | Can be customized                    | DEFAULT FALSE                                                           |
| `thumbnail_url`      | VARCHAR(500)  | Main image URL                       | NOT NULL                                                                |
| `video_url`          | VARCHAR(500)  | Product video                        | NULLABLE                                                                |
| `delivery_available` | BOOLEAN       | Offers delivery                      | DEFAULT FALSE                                                           |
| `delivery_radius`    | INTEGER       | Delivery radius in miles             | NULLABLE                                                                |
| `delivery_fee`       | DECIMAL(10,2) | Delivery cost                        | NULLABLE                                                                |
| `shipping_available` | BOOLEAN       | Ships beyond campus                  | DEFAULT FALSE                                                           |
| `total_sales`        | INTEGER       | Times sold                           | DEFAULT 0                                                               |
| `views_count`        | INTEGER       | Total views                          | DEFAULT 0                                                               |
| `favorites_count`    | INTEGER       | Times favorited                      | DEFAULT 0                                                               |
| `rating_average`     | DECIMAL(3,2)  | Average rating (1-5)                 | DEFAULT 0.0                                                             |
| `rating_count`       | INTEGER       | Total reviews                        | DEFAULT 0                                                               |
| `featured`           | BOOLEAN       | Promoted listing                     | DEFAULT FALSE                                                           |
| `status`             | ENUM          | Current status                       | ('active', 'sold_out', 'draft', 'archived', 'paused'), DEFAULT 'active' |
| `is_active`          | BOOLEAN       | Active/Inactive                      | DEFAULT TRUE                                                            |
| `auto_renew`         | BOOLEAN       | Auto-renew listing                   | DEFAULT FALSE                                                           |
| `expiry_date`        | TIMESTAMP     | When listing expires                 | NULLABLE                                                                |
| `created_at`         | TIMESTAMP     | Creation time                        | DEFAULT CURRENT_TIMESTAMP                                               |
| `updated_at`         | TIMESTAMP     | Last update                          | DEFAULT CURRENT_TIMESTAMP ON UPDATE                                     |
| `published_at`       | TIMESTAMP     | When made public                     | NULLABLE                                                                |
| `last_renewed_at`    | TIMESTAMP     | Last renewal                         | NULLABLE                                                                |

---

### 2. Categories Table

**Table Name:** `categories`

| Field Name           | Data Type    | Description                         | Constraints                                    |
| -------------------- | ------------ | ----------------------------------- | ---------------------------------------------- |
| `category_id`        | UUID         | Primary key                         | PRIMARY KEY, NOT NULL                          |
| `name`               | VARCHAR(100) | Category name                       | NOT NULL, UNIQUE                               |
| `slug`               | VARCHAR(100) | URL-friendly name                   | NOT NULL, UNIQUE                               |
| `icon`               | VARCHAR(50)  | Icon identifier/emoji               | NULLABLE                                       |
| `parent_category_id` | UUID         | Parent category (for subcategories) | FOREIGN KEY (categories.category_id), NULLABLE |
| `display_order`      | INTEGER      | Sort order                          | DEFAULT 0                                      |
| `is_active`          | BOOLEAN      | Active/Hidden                       | DEFAULT TRUE                                   |
| `created_at`         | TIMESTAMP    | Creation time                       | DEFAULT CURRENT_TIMESTAMP                      |

Setup Supabase cloud database with basic tables

# Requirement: Project Frontend

With basic wireframe done we can work on frontend focusing on the search page to impliment trie search
