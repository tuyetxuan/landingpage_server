/*
 Navicat Premium Dump SQL

 Source Server         : demo
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3366
 Source Schema         : landingpage

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 21/06/2025 23:07:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_categories
-- ----------------------------
DROP TABLE IF EXISTS `article_categories`;
CREATE TABLE `article_categories`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE,
  INDEX `idx_category_slug`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article_categories
-- ----------------------------
INSERT INTO `article_categories` VALUES (1, 'Thiết Kế Giao Diện Website', 'thiet-ke-giao-dien-website', 'Tin tức và hướng dẫn về thiết kế giao diện website hiện đại, tối ưu trải nghiệm người dùng (UX/UI).', '2025-06-17 23:27:28', '2025-06-17 23:27:28');
INSERT INTO `article_categories` VALUES (2, 'Tối Ưu Hóa SEO cho Website', 'toi-uu-hoa-seo-website', 'Các bài viết chia sẻ kinh nghiệm và kỹ thuật tối ưu hóa công cụ tìm kiếm (SEO) cho website.', '2025-06-17 23:27:28', '2025-06-17 23:27:28');
INSERT INTO `article_categories` VALUES (3, 'Công Nghệ Thiết Kế Web Mới', 'cong-nghe-thiet-ke-web-moi', 'Cập nhật các công nghệ mới nhất trong lĩnh vực thiết kế và phát triển website.', '2025-06-17 23:27:28', '2025-06-17 23:27:28');
INSERT INTO `article_categories` VALUES (4, 'Website Thương Mại Điện Tử', 'thiet-ke-website-thuong-mai-dien-tu', 'Hướng dẫn chi tiết về xây dựng và tối ưu website thương mại điện tử để tăng doanh thu.', '2025-06-17 23:27:28', '2025-06-19 03:32:41');
INSERT INTO `article_categories` VALUES (5, 'Bảo Mật Website', 'bao-mat-website', 'Tin tức và mẹo về bảo mật website, bảo vệ dữ liệu người dùng và phòng chống tấn công mạng.', '2025-06-17 23:27:28', '2025-06-17 23:27:28');

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint UNSIGNED NULL DEFAULT NULL,
  `category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `is_published` tinyint(1) NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `clock` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE,
  INDEX `author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_article_slug`(`slug` ASC) USING BTREE,
  INDEX `idx_article_publish_date`(`published_at` ASC) USING BTREE,
  INDEX `idx_article_category`(`category_id` ASC) USING BTREE,
  FULLTEXT INDEX `idx_article_search`(`title`, `content`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_article_publication` CHECK (`is_published` = 0 and `published_at` is null or `is_published` = 1 and `published_at` is not null)
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------
INSERT INTO `articles` VALUES (1, '5 Xu Hướng Thiết Kế Giao Diện Website Năm 2025', '<h1>Tối Ưu Hóa SEO Web: Hành Trang Đưa Website Lên Top</h1>\r\n\r\n<p>SEO (Search Engine Optimization) là quá trình tối ưu hóa website để cải thiện thứ hạng trên các công cụ tìm kiếm như Google. Một website được tối ưu SEO tốt không chỉ thu hút lượng lớn người truy cập mà còn tăng cơ hội chuyển đổi khách hàng. Bài viết này sẽ hướng dẫn bạn các chiến lược SEO cơ bản và hiệu quả.</p>\r\n\r\n<h2>Tại Sao SEO Quan Trọng Với Website?</h2>\r\n<p>SEO giúp website của bạn nổi bật giữa hàng triệu trang web khác. Khi người dùng tìm kiếm từ khóa liên quan, website được tối ưu sẽ xuất hiện ở vị trí cao hơn, tăng khả năng được nhấp vào. Ngoài ra, SEO còn giúp xây dựng uy tín thương hiệu và tiết kiệm chi phí so với quảng cáo trả phí.</p>\r\n\r\n<h3>Các Yếu Tố SEO On-Page</h3>\r\n<p>SEO On-Page tập trung vào tối ưu hóa nội dung và cấu trúc bên trong website. Dưới đây là các yếu tố quan trọng:</p>\r\n\r\n<h4>1. Nghiên Cứu Từ Khóa</h4>\r\n<p>Từ khóa là nền tảng của SEO. Sử dụng các công cụ như Google Keyword Planner để tìm từ khóa có lượng tìm kiếm cao nhưng cạnh tranh thấp. Ví dụ, từ khóa \"SEO web\" có thể kết hợp với \"hướng dẫn SEO web\" để nhắm mục tiêu cụ thể.</p>\r\n\r\n<h5>2. Tiêu Đề và Meta Description</h5>\r\n<p>Tiêu đề (title tag) và mô tả meta cần chứa từ khóa chính, ngắn gọn và thu hút. Một tiêu đề lý tưởng dưới 60 ký tự, còn meta description nên dưới 160 ký tự.</p>\r\n\r\n<h6>3. Nội Dung Chất Lượng</h6>\r\n<p>Nội dung phải hữu ích, độc đáo và giải quyết nhu cầu người đọc. Bài viết dài trên 400 từ, sử dụng từ khóa tự nhiên và bổ sung hình ảnh minh họa.</p>\r\n\r\n<img src=\"https://example.com/seo-strategy.jpg\" alt=\"Chiến lược SEO web hiệu quả\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Các Yếu Tố SEO Off-Page</h3>\r\n<p>SEO Off-Page liên quan đến các hoạt động bên ngoài website, như xây dựng liên kết (backlink) và quảng bá trên mạng xã hội. Backlink từ các trang uy tín giúp tăng độ tin cậy của website.</p>\r\n\r\n<h4>Chiến Lược Xây Dựng Backlink</h4>\r\n<p>Viết bài guest post, tham gia diễn đàn hoặc hợp tác với các trang web liên quan để tạo backlink chất lượng. Tránh sử dụng backlink từ các nguồn không uy tín vì có thể bị Google phạt.</p>\r\n\r\n<h2>Kiểm Tra Hiệu Suất SEO</h2>\r\n<p>Sử dụng các công cụ như Google Analytics và Google Search Console để theo dõi hiệu suất SEO. Các chỉ số quan trọng bao gồm lưu lượng truy cập, tỷ lệ thoát, và thứ hạng từ khóa.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Analytics</td>\r\n    <td>Theo dõi lưu lượng truy cập</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Search Console</td>\r\n    <td>Kiểm tra thứ hạng từ khóa</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Ahrefs</td>\r\n    <td>Phân tích backlink</td>\r\n    <td>Trả phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Với các chiến lược trên, bạn có thể xây dựng một website tối ưu SEO, thu hút khách hàng và đạt thứ hạng cao trên Google. Hãy bắt đầu từ việc nghiên cứu từ khóa và tạo nội dung chất lượng ngay hôm nay!</p>', 'https://placehold.co/600x400', 'xu-huong-thiet-ke-giao-dien-2025', 2, 1, 1, '2025-06-15 10:00:00', 0, '2025-06-10 09:00:00', '2025-06-19 06:01:20');
INSERT INTO `articles` VALUES (2, 'Hướng Dẫn Tối Ưu SEO On-Page Cho Website', '<h1>Thiết Kế Web Responsive: Tối Ưu Trải Nghiệm Người Dùng</h1>\r\n\r\n<p>Thiết kế web responsive đảm bảo website hiển thị đẹp và hoạt động tốt trên mọi thiết bị, từ điện thoại đến máy tính. Với hơn 50% lưu lượng truy cập web từ di động, responsive design là yếu tố không thể thiếu. Bài viết này sẽ giải thích tầm quan trọng và cách triển khai.</p>\r\n\r\n<h2>Tại Sao Cần Thiết Kế Web Responsive?</h2>\r\n<p>Website responsive cải thiện trải nghiệm người dùng, giảm tỷ lệ thoát, và hỗ trợ SEO. Google ưu tiên các trang web thân thiện với di động trong xếp hạng tìm kiếm.</p>\r\n\r\n<h3>Các Nguyên Tắc Thiết Kế Responsive</h3>\r\n<p>Để tạo website responsive, cần chú ý đến bố cục linh hoạt, hình ảnh tối ưu, và tốc độ tải trang.</p>\r\n\r\n<h4>1. Sử Dụng Grid Linh Hoạt</h4>\r\n<p>Bố cục lưới (grid) với đơn vị phần trăm hoặc rem/em giúp website tự điều chỉnh theo kích thước màn hình.</p>\r\n\r\n<h5>2. Tối Ưu Hình Ảnh</h5>\r\n<p>Sử dụng định dạng WebP và thuộc tính `srcset` để tải hình ảnh phù hợp với thiết bị, giảm thời gian tải.</p>\r\n\r\n<h6>3. Media Queries trong CSS</h6>\r\n<p>Media queries điều chỉnh kiểu dáng dựa trên kích thước màn hình, ví dụ: ẩn menu trên di động và hiển thị hamburger icon.</p>\r\n\r\n<img src=\"https://example.com/responsive-design.jpg\" alt=\"Thiết kế web responsive đa thiết bị\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Công Cụ Hỗ Trợ Thiết Kế Responsive</h3>\r\n<p>Các công cụ như Bootstrap, Figma giúp đơn giản hóa quá trình thiết kế và kiểm tra responsive.</p>\r\n\r\n<h4>Kiểm Tra Responsive</h4>\r\n<p>Sử dụng DevTools của Chrome hoặc BrowserStack để kiểm tra website trên nhiều thiết bị.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Bootstrap</td>\r\n    <td>Framework responsive</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Figma</td>\r\n    <td>Thiết kế giao diện</td>\r\n    <td>Miễn phí/Trả phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>BrowserStack</td>\r\n    <td>Kiểm tra đa thiết bị</td>\r\n    <td>Trả phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Thiết kế web responsive là đầu tư lâu dài để nâng cao trải nghiệm người dùng và hiệu quả kinh doanh. Hãy kiểm tra website của bạn ngay hôm nay!</p>', 'https://placehold.co/600x400', 'huong-dan-toi-uu-seo-onpage', 4, 2, 1, '2025-06-16 08:00:00', 0, '2025-06-12 11:00:00', '2025-06-19 06:04:42');
INSERT INTO `articles` VALUES (3, 'Giới Thiệu Công Nghệ PWA Trong Thiết Kế Web', '<h1>Tối Ưu Hóa SEO Web: Hành Trang Đưa Website Lên Top</h1>\r\n\r\n<p>SEO (Search Engine Optimization) là quá trình tối ưu hóa website để cải thiện thứ hạng trên các công cụ tìm kiếm như Google. Một website được tối ưu SEO tốt không chỉ thu hút lượng lớn người truy cập mà còn tăng cơ hội chuyển đổi khách hàng. Bài viết này sẽ hướng dẫn bạn các chiến lược SEO cơ bản và hiệu quả.</p>\r\n\r\n<h2>Tại Sao SEO Quan Trọng Với Website?</h2>\r\n<p>SEO giúp website của bạn nổi bật giữa hàng triệu trang web khác. Khi người dùng tìm kiếm từ khóa liên quan, website được tối ưu sẽ xuất hiện ở vị trí cao hơn, tăng khả năng được nhấp vào. Ngoài ra, SEO còn giúp xây dựng uy tín thương hiệu và tiết kiệm chi phí so với quảng cáo trả phí.</p>\r\n\r\n<h3>Các Yếu Tố SEO On-Page</h3>\r\n<p>SEO On-Page tập trung vào tối ưu hóa nội dung và cấu trúc bên trong website. Dưới đây là các yếu tố quan trọng:</p>\r\n\r\n<h4>1. Nghiên Cứu Từ Khóa</h4>\r\n<p>Từ khóa là nền tảng của SEO. Sử dụng các công cụ như Google Keyword Planner để tìm từ khóa có lượng tìm kiếm cao nhưng cạnh tranh thấp. Ví dụ, từ khóa \"SEO web\" có thể kết hợp với \"hướng dẫn SEO web\" để nhắm mục tiêu cụ thể.</p>\r\n\r\n<h5>2. Tiêu Đề và Meta Description</h5>\r\n<p>Tiêu đề (title tag) và mô tả meta cần chứa từ khóa chính, ngắn gọn và thu hút. Một tiêu đề lý tưởng dưới 60 ký tự, còn meta description nên dưới 160 ký tự.</p>\r\n\r\n<h6>3. Nội Dung Chất Lượng</h6>\r\n<p>Nội dung phải hữu ích, độc đáo và giải quyết nhu cầu người đọc. Bài viết dài trên 400 từ, sử dụng từ khóa tự nhiên và bổ sung hình ảnh minh họa.</p>\r\n\r\n<img src=\"https://example.com/seo-strategy.jpg\" alt=\"Chiến lược SEO web hiệu quả\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Các Yếu Tố SEO Off-Page</h3>\r\n<p>SEO Off-Page liên quan đến các hoạt động bên ngoài website, như xây dựng liên kết (backlink) và quảng bá trên mạng xã hội. Backlink từ các trang uy tín giúp tăng độ tin cậy của website.</p>\r\n\r\n<h4>Chiến Lược Xây Dựng Backlink</h4>\r\n<p>Viết bài guest post, tham gia diễn đàn hoặc hợp tác với các trang web liên quan để tạo backlink chất lượng. Tránh sử dụng backlink từ các nguồn không uy tín vì có thể bị Google phạt.</p>\r\n\r\n<h2>Kiểm Tra Hiệu Suất SEO</h2>\r\n<p>Sử dụng các công cụ như Google Analytics và Google Search Console để theo dõi hiệu suất SEO. Các chỉ số quan trọng bao gồm lưu lượng truy cập, tỷ lệ thoát, và thứ hạng từ khóa.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Analytics</td>\r\n    <td>Theo dõi lưu lượng truy cập</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Search Console</td>\r\n    <td>Kiểm tra thứ hạng từ khóa</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Ahrefs</td>\r\n    <td>Phân tích backlink</td>\r\n    <td>Trả phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Với các chiến lược trên, bạn có thể xây dựng một website tối ưu SEO, thu hút khách hàng và đạt thứ hạng cao trên Google. Hãy bắt đầu từ việc nghiên cứu từ khóa và tạo nội dung chất lượng ngay hôm nay!</p>', 'https://placehold.co/600x400', 'cong-nghe-pwa-thiet-ke-web', 2, 3, 0, NULL, 0, '2025-06-13 10:00:00', '2025-06-19 06:01:24');
INSERT INTO `articles` VALUES (4, 'Cách Xây Dựng Website Thương Mại Điện Tử Thành Công', '<h1>Content Marketing: Chìa Khóa Thu Hút Khách Hàng Hiệu Quả</h1>\r\n\r\n<p>Content Marketing là chiến lược tạo và phân phối nội dung giá trị để thu hút, giữ chân và chuyển đổi khách hàng. Trong thời đại số, nội dung chất lượng không chỉ giúp xây dựng thương hiệu mà còn cải thiện thứ hạng SEO. Bài viết này sẽ hướng dẫn bạn cách triển khai Content Marketing thành công.</p>\r\n\r\n<h2>Tầm Quan Trọng của Content Marketing</h2>\r\n<p>Nội dung hấp dẫn giúp khách hàng hiểu rõ sản phẩm hoặc dịch vụ của bạn. Thay vì quảng cáo trực tiếp, Content Marketing tạo niềm tin thông qua thông tin hữu ích, từ đó tăng tỷ lệ chuyển đổi.</p>\r\n\r\n<h3>Các Hình Thức Content Marketing Phổ Biến</h3>\r\n<p>Có nhiều cách để triển khai Content Marketing, từ blog, video, đến infographic. Dưới đây là một số hình thức hiệu quả:</p>\r\n\r\n<h4>1. Blog và Bài Viết</h4>\r\n<p>Blog là cách phổ biến để chia sẻ kiến thức. Một bài viết dài trên 400 từ với từ khóa như “Content Marketing” sẽ thu hút người đọc và cải thiện SEO.</p>\r\n\r\n<h5>2. Video Marketing</h5>\r\n<p>Video ngắn, hấp dẫn trên YouTube hoặc TikTok giúp tiếp cận đối tượng trẻ. Nội dung cần có kịch bản rõ ràng và hình ảnh chất lượng cao.</p>\r\n\r\n<h6>3. Email Marketing</h6>\r\n<p>Gửi email cá nhân hóa với nội dung giá trị giúp duy trì mối quan hệ với khách hàng. Ví dụ, bản tin hàng tuần chia sẻ mẹo Content Marketing.</p>\r\n\r\n<img src=\"https://example.com/content-marketing.jpg\" alt=\"Chiến lược Content Marketing hiệu quả\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Lập Kế Hoạch Content Marketing</h3>\r\n<p>Để thành công, cần xác định đối tượng mục tiêu, từ khóa chính, và lịch đăng bài. Sử dụng công cụ như Trello để quản lý nội dung.</p>\r\n\r\n<h4>Công Cụ Hỗ Trợ Content Marketing</h4>\r\n<p>Các công cụ như Ahrefs, SEMrush giúp phân tích từ khóa, trong khi Canva hỗ trợ thiết kế hình ảnh đẹp.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Ahrefs</td>\r\n    <td>Phân tích từ khóa</td>\r\n    <td>Trả phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Canva</td>\r\n    <td>Thiết kế hình ảnh</td>\r\n    <td>Miễn phí/Trả phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Mailchimp</td>\r\n    <td>Email Marketing</td>\r\n    <td>Miễn phí/Trả phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Content Marketing không chỉ là xu hướng mà là chiến lược dài hạn. Hãy bắt đầu tạo nội dung giá trị để kết nối với khách hàng ngay hôm nay!</p>', 'https://placehold.co/600x400', 'xay-dung-website-thuong-mai-dien-tu', 4, 4, 1, '2025-06-14 09:00:00', 1, '2025-06-11 12:00:00', '2025-06-19 06:02:32');
INSERT INTO `articles` VALUES (5, 'Các Biện Pháp Bảo Mật Website Hiệu Quả Nhất', '<h1>Tối Ưu Hóa SEO Web: Hành Trang Đưa Website Lên Top</h1>\r\n\r\n<p>SEO (Search Engine Optimization) là quá trình tối ưu hóa website để cải thiện thứ hạng trên các công cụ tìm kiếm như Google. Một website được tối ưu SEO tốt không chỉ thu hút lượng lớn người truy cập mà còn tăng cơ hội chuyển đổi khách hàng. Bài viết này sẽ hướng dẫn bạn các chiến lược SEO cơ bản và hiệu quả.</p>\r\n\r\n<h2>Tại Sao SEO Quan Trọng Với Website?</h2>\r\n<p>SEO giúp website của bạn nổi bật giữa hàng triệu trang web khác. Khi người dùng tìm kiếm từ khóa liên quan, website được tối ưu sẽ xuất hiện ở vị trí cao hơn, tăng khả năng được nhấp vào. Ngoài ra, SEO còn giúp xây dựng uy tín thương hiệu và tiết kiệm chi phí so với quảng cáo trả phí.</p>\r\n\r\n<h3>Các Yếu Tố SEO On-Page</h3>\r\n<p>SEO On-Page tập trung vào tối ưu hóa nội dung và cấu trúc bên trong website. Dưới đây là các yếu tố quan trọng:</p>\r\n\r\n<h4>1. Nghiên Cứu Từ Khóa</h4>\r\n<p>Từ khóa là nền tảng của SEO. Sử dụng các công cụ như Google Keyword Planner để tìm từ khóa có lượng tìm kiếm cao nhưng cạnh tranh thấp. Ví dụ, từ khóa \"SEO web\" có thể kết hợp với \"hướng dẫn SEO web\" để nhắm mục tiêu cụ thể.</p>\r\n\r\n<h5>2. Tiêu Đề và Meta Description</h5>\r\n<p>Tiêu đề (title tag) và mô tả meta cần chứa từ khóa chính, ngắn gọn và thu hút. Một tiêu đề lý tưởng dưới 60 ký tự, còn meta description nên dưới 160 ký tự.</p>\r\n\r\n<h6>3. Nội Dung Chất Lượng</h6>\r\n<p>Nội dung phải hữu ích, độc đáo và giải quyết nhu cầu người đọc. Bài viết dài trên 400 từ, sử dụng từ khóa tự nhiên và bổ sung hình ảnh minh họa.</p>\r\n\r\n<img src=\"https://example.com/seo-strategy.jpg\" alt=\"Chiến lược SEO web hiệu quả\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Các Yếu Tố SEO Off-Page</h3>\r\n<p>SEO Off-Page liên quan đến các hoạt động bên ngoài website, như xây dựng liên kết (backlink) và quảng bá trên mạng xã hội. Backlink từ các trang uy tín giúp tăng độ tin cậy của website.</p>\r\n\r\n<h4>Chiến Lược Xây Dựng Backlink</h4>\r\n<p>Viết bài guest post, tham gia diễn đàn hoặc hợp tác với các trang web liên quan để tạo backlink chất lượng. Tránh sử dụng backlink từ các nguồn không uy tín vì có thể bị Google phạt.</p>\r\n\r\n<h2>Kiểm Tra Hiệu Suất SEO</h2>\r\n<p>Sử dụng các công cụ như Google Analytics và Google Search Console để theo dõi hiệu suất SEO. Các chỉ số quan trọng bao gồm lưu lượng truy cập, tỷ lệ thoát, và thứ hạng từ khóa.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Analytics</td>\r\n    <td>Theo dõi lưu lượng truy cập</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Search Console</td>\r\n    <td>Kiểm tra thứ hạng từ khóa</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Ahrefs</td>\r\n    <td>Phân tích backlink</td>\r\n    <td>Trả phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Với các chiến lược trên, bạn có thể xây dựng một website tối ưu SEO, thu hút khách hàng và đạt thứ hạng cao trên Google. Hãy bắt đầu từ việc nghiên cứu từ khóa và tạo nội dung chất lượng ngay hôm nay!</p>', 'https://placehold.co/600x400', 'bien-phap-bao-mat-website', 2, 5, 0, NULL, 0, '2025-06-15 14:00:00', '2025-06-19 06:01:27');
INSERT INTO `articles` VALUES (6, 'Tầm Quan Trọng Của Tốc Độ Tải Trang Trong SEO', '<h1>Quảng Cáo Google Ads: Tăng Doanh Thu Với Chiến Lược Hiệu Quả</h1>\r\n\r\n<p>Google Ads là nền tảng quảng cáo mạnh mẽ giúp doanh nghiệp tiếp cận khách hàng tiềm năng thông qua tìm kiếm, hiển thị, và video. Với khả năng nhắm mục tiêu chính xác, Google Ads là công cụ không thể thiếu trong marketing số. Bài viết này sẽ hướng dẫn bạn cách sử dụng Google Ads hiệu quả.</p>\r\n\r\n<h2>Lợi Ích của Google Ads</h2>\r\n<p>Google Ads mang lại kết quả nhanh chóng, giúp tăng lưu lượng truy cập và doanh thu. Bạn chỉ trả tiền khi có nhấp chuột (PPC), tối ưu hóa chi phí.</p>\r\n\r\n<h3>Các Loại Hình Quảng Cáo Google Ads</h3>\r\n<p>Google Ads cung cấp nhiều định dạng quảng cáo, từ tìm kiếm đến quảng cáo video trên YouTube.</p>\r\n\r\n<h4>1. Quảng Cáo Tìm Kiếm</h4>\r\n<p>Quảng cáo hiển thị trên kết quả tìm kiếm Google, nhắm mục tiêu từ khóa như “quảng cáo Google Ads” để thu hút khách hàng đang tìm dịch vụ.</p>\r\n\r\n<h5>2. Quảng Cáo Hiển Thị</h5>\r\n<p>Banner quảng cáo trên các website đối tác của Google, tăng nhận diện thương hiệu với hình ảnh bắt mắt.</p>\r\n\r\n<h6>3. Quảng Cáo Video</h6>\r\n<p>Quảng cáo trên YouTube, phù hợp để kể chuyện thương hiệu hoặc giới thiệu sản phẩm.</p>\r\n\r\n<img src=\"https://example.com/google-ads.jpg\" alt=\"Quảng cáo Google Ads hiệu quả\" style=\"max-width: 100%; height: auto;\" />\r\n\r\n<h3>Tối Ưu Hóa Chiến Dịch Google Ads</h3>\r\n<p>Để đạt hiệu quả, cần nhắm mục tiêu đúng đối tượng, tối ưu từ khóa, và theo dõi hiệu suất chiến dịch.</p>\r\n\r\n<h4>Công Cụ Hỗ Trợ Google Ads</h4>\r\n<p>Google Keyword Planner và Google Analytics giúp lập kế hoạch và phân tích hiệu quả quảng cáo.</p>\r\n\r\n<table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\r\n  <tr>\r\n    <th>Công Cụ</th>\r\n    <th>Chức Năng</th>\r\n    <th>Miễn Phí/Trả Phí</th>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Keyword Planner</td>\r\n    <td>Nghiên cứu từ khóa</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Analytics</td>\r\n    <td>Phân tích hiệu suất</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n  <tr>\r\n    <td>Google Ads Editor</td>\r\n    <td>Quản lý chiến dịch</td>\r\n    <td>Miễn phí</td>\r\n  </tr>\r\n</table>\r\n\r\n<p>Google Ads là công cụ mạnh mẽ để tăng trưởng doanh nghiệp. Hãy thử nghiệm và tối ưu chiến dịch để đạt kết quả tốt nhất!</p>', 'https://placehold.co/600x400', 'toc-do-tai-trang-seo', 4, 2, 1, '2025-06-17 07:00:00', 0, '2025-06-14 10:00:00', '2025-06-19 06:04:53');

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_id` bigint UNSIGNED NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `author_id`(`author_id` ASC) USING BTREE,
  FULLTEXT INDEX `idx_banner_search`(`title`, `description`),
  CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_banner_dates` CHECK (`start_date` is null and `end_date` is null or `start_date` is not null and `end_date` is not null and `start_date` <= `end_date`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banners
-- ----------------------------

-- ----------------------------
-- Table structure for contact_submissions
-- ----------------------------
DROP TABLE IF EXISTS `contact_submissions`;
CREATE TABLE `contact_submissions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `status_id` bigint UNSIGNED NULL DEFAULT NULL,
  `author_id` bigint UNSIGNED NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `service_category_id`(`service_category_id` ASC) USING BTREE,
  INDEX `status_id`(`status_id` ASC) USING BTREE,
  INDEX `author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_submission_name`(`name` ASC) USING BTREE,
  INDEX `idx_submission_phone`(`phone` ASC) USING BTREE,
  INDEX `idx_submission_email`(`email` ASC) USING BTREE,
  CONSTRAINT `contact_submissions_ibfk_1` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `contact_submissions_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `submission_status` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `contact_submissions_ibfk_3` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_contact_phone` CHECK (`phone` is null or `phone` regexp '^[0-9+][0-9 -]{6,20}$')
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of contact_submissions
-- ----------------------------
INSERT INTO `contact_submissions` VALUES (39, 4, 1, NULL, 'Test.Example.0001', 'vinhlocf1.54.9@gmail.com', '0377985111', 'Đường Lê Trọng Tấn', 'Không có nội dung gửi!', NULL, '2025-06-20 01:59:08', '2025-06-20 01:59:08');
INSERT INTO `contact_submissions` VALUES (40, 1, 1, NULL, 'Nguyễn Văn Phú', 'test.exam1@gmail.com', '0377985112', 'Đường Lê Trọng Tấn', 'Không có nội dung gửi!', NULL, '2025-06-20 01:59:40', '2025-06-20 01:59:40');
INSERT INTO `contact_submissions` VALUES (41, 4, 1, NULL, 'Nguyễn Văn Phú', 'test.example.0001@gmail.com', '0377985409', 'gg', 'Không có nội dung gửi!', NULL, '2025-06-20 02:02:28', '2025-06-20 02:02:28');
INSERT INTO `contact_submissions` VALUES (42, 4, 1, NULL, 'Test.Example.0001', 'vinhlocf1.54.9@gmail.com', '0377985111', 'kkkk', 'Không có nội dung gửi!', NULL, '2025-06-20 02:03:02', '2025-06-20 02:03:02');
INSERT INTO `contact_submissions` VALUES (43, 1, 1, NULL, 'Nguyễn Văn Phú', 'vuonggiaphu.pct@gmail.com', '0377985112', 'Đường Lê Trọng Tấn', 'Không có nội dung gửi!', NULL, '2025-06-20 02:16:18', '2025-06-20 02:16:18');

-- ----------------------------
-- Table structure for service_categories
-- ----------------------------
DROP TABLE IF EXISTS `service_categories`;
CREATE TABLE `service_categories`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of service_categories
-- ----------------------------
INSERT INTO `service_categories` VALUES (1, 'Mẫu web bán hàng', '', 'Dịch vụ thiết kế website chuyên nghiệp, tối ưu SEO và thân thiện với người dùng.', '2025-06-17 02:39:52', '2025-06-17 03:16:01');
INSERT INTO `service_categories` VALUES (2, 'Mẫu Thiết Kế Website Giới Thiệu Công Ty', '', 'Dịch vụ thiết kế website chuyên nghiệp, tối ưu SEO và thân thiện với người dùng.', '2025-06-17 02:39:52', '2025-06-17 03:16:24');
INSERT INTO `service_categories` VALUES (3, 'Mẫu website du lịch', '', 'Dịch vụ thiết kế website chuyên nghiệp, tối ưu SEO và thân thiện với người dùng.', '2025-06-17 02:39:52', '2025-06-17 03:18:30');
INSERT INTO `service_categories` VALUES (4, 'Mẫu website Bất Động Sản', '', 'Dịch vụ thiết kế website chuyên nghiệp, tối ưu SEO và thân thiện với người dùng.', '2025-06-17 02:39:52', '2025-06-17 03:19:22');

-- ----------------------------
-- Table structure for services
-- ----------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `author_id` bigint UNSIGNED NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `link_page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  INDEX `category_id`(`category_id` ASC) USING BTREE,
  INDEX `author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_service_code`(`code` ASC) USING BTREE,
  FULLTEXT INDEX `idx_service_search`(`name`, `description`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `services_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_service_code_format` CHECK (`code` regexp '^[A-Z]{2,5}-[0-9]{3}$')
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of services
-- ----------------------------
INSERT INTO `services` VALUES (1, 1, 1, 'WEB-001', 'Mẫu Website Bán Cà Phê Hiện Đại Và Sang Trọng', 'Mẫu Website Bán Cà Phê Hiện Đại Và Sang Trọng', 'https://mona.media/wp-content/uploads/2023/03/screencapture-cafengon-monamedia-net-2025-01-16-15_49_29-400x1518.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-cafengon-monamedia-net-2025-01-16-15_49_29-400x1518.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:15:07');
INSERT INTO `services` VALUES (2, 1, 1, 'WEB-002', 'Mẫu Website Bán Văn Phòng Phẩm Tiện Ích', 'Mẫu Website Bán Văn Phòng Phẩm Tiện Ích', 'https://mona.media/wp-content/uploads/2023/03/screencapture-office-sup-monamedia-net-2024-05-27-16_50_28-400x1144.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-office-sup-monamedia-net-2024-05-27-16_50_28-400x1144.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:15:41');
INSERT INTO `services` VALUES (3, 2, 2, 'WEB-003', 'Mẫu Website Giới Thiệu Công Ty Xây Dựng', 'Mẫu Website Giới Thiệu Công Ty Xây Dựng', 'https://mona.media/wp-content/uploads/2023/03/screencapture-xaynhadep2-monamedia-net-2025-01-08-14_07_44-400x2584.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-xaynhadep2-monamedia-net-2025-01-08-14_07_44-400x2584.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:17:37');
INSERT INTO `services` VALUES (4, 2, 2, 'WEB-004', 'Mẫu Website Bán Mỹ Phẩm Độc Đáo Và Hấp Dẫn', 'Mẫu Website Bán Mỹ Phẩm Độc Đáo Và Hấp Dẫn', 'https://mona.media/wp-content/uploads/2023/03/screencapture-sacdep24-monamedia-net-2025-01-08-13_40_50-400x2417.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-sacdep24-monamedia-net-2025-01-08-13_40_50-400x2417.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:17:40');
INSERT INTO `services` VALUES (5, 3, 3, 'WEB-005', 'Mẫu Website Dịch Vụ Du Lịch Đơn Giản - Hiện Đại', 'Mẫu Website Dịch Vụ Du Lịch Đơn Giản - Hiện Đại', 'https://mona.media/wp-content/uploads/2023/03/screencapture-roam-world-monamedia-net-2024-07-01-15_13_54-400x1710.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-roam-world-monamedia-net-2024-07-01-15_13_54-400x1710.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:18:50');
INSERT INTO `services` VALUES (6, 4, 4, 'WEB-006', 'Mẫu Website Giới Thiệu Bất Động Sản Hiện Đại', 'Mẫu Website Giới Thiệu Bất Động Sản Hiện Đại', 'https://mona.media/wp-content/uploads/2023/03/screencapture-primeluxe-monamedia-net-2024-09-05-11_25_06-400x1702.png', 'https://mona.media/wp-content/uploads/2023/03/screencapture-primeluxe-monamedia-net-2024-09-05-11_25_06-400x1702.png', 1, '2025-06-17 02:39:55', '2025-06-17 03:19:45');

-- ----------------------------
-- Table structure for submission_status
-- ----------------------------
DROP TABLE IF EXISTS `submission_status`;
CREATE TABLE `submission_status`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` enum('pending','in_progress','completed','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status_value`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of submission_status
-- ----------------------------
INSERT INTO `submission_status` VALUES (1, 'pending', NULL, '2025-06-20 00:38:17', '2025-06-20 00:38:17');
INSERT INTO `submission_status` VALUES (2, 'in_progress', 'Assigned to team for review', '2025-06-20 00:38:17', '2025-06-20 00:38:17');
INSERT INTO `submission_status` VALUES (3, 'completed', 'Submission successfully processed', '2025-06-20 00:38:17', '2025-06-20 00:38:17');
INSERT INTO `submission_status` VALUES (4, 'rejected', 'Submission rejected due to incomplete documentation', '2025-06-20 00:38:17', '2025-06-20 00:38:17');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gender` enum('nam','nu','khac') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'khac',
  `public_key` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_key` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','editor') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `idx_user_active`(`is_active` ASC) USING BTREE,
  INDEX `idx_user_email`(`email` ASC) USING BTREE,
  INDEX `idx_username`(`username` ASC) USING BTREE,
  CONSTRAINT `chk_name_length` CHECK (octet_length(`first_name`) >= 2 and octet_length(`first_name`) <= 50 and octet_length(`last_name`) >= 2 and octet_length(`last_name`) <= 50)
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin1', 'an@cco.media', 'Nguyễn', 'Văn An', NULL, 'nam', 'pub_key_admin1_1234567890', 'access_key_admin1_1234567890', 'admin', '$2b$10$X8k3b4y5z6q7w8e9r0t1y2u3i4o5p6a7s8d9f0g1h2j3k4l5m6n7', 1, '2025-06-17 02:39:46', '2025-06-17 03:21:13');
INSERT INTO `users` VALUES (2, 'editor1', 'bich@cco.media', 'Trần', 'Thị Bích', NULL, 'nu', 'pub_key_editor1_0987654321', 'access_key_editor1_0987654321', 'editor', '$2b$10$Y9m2n3b4v5c6x7z8q9w0e1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6', 1, '2025-06-17 02:39:46', '2025-06-17 03:21:19');
INSERT INTO `users` VALUES (3, 'admin2', 'nam@cco.media', 'Lê', 'Hoàng Nam', NULL, 'nam', 'pub_key_admin2_1122334455', 'access_key_admin2_1122334455', 'admin', '$2b$10$Z1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z1x2c3v4b5n6', 1, '2025-06-17 02:39:46', '2025-06-17 03:21:25');
INSERT INTO `users` VALUES (4, 'editor2', 'lan@cco.media', 'Phạm', 'Thị Lan', NULL, 'nu', 'pub_key_editor2_6677889900', 'access_key_editor2_6677889900', 'editor', '$2b$10$A2s3d4f5g6h7j8k9l0z1x2c3v4b5n6m7q8w9e0r1t2y3u4i5o6p7', 1, '2025-06-17 02:39:46', '2025-06-17 03:21:31');

-- ----------------------------
-- Table structure for website_settings
-- ----------------------------
DROP TABLE IF EXISTS `website_settings`;
CREATE TABLE `website_settings`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_id` bigint UNSIGNED NULL DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `author_id`(`author_id` ASC) USING BTREE,
  CONSTRAINT `website_settings_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `CONSTRAINT_1` CHECK (json_valid(`settings`))
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of website_settings
-- ----------------------------
INSERT INTO `website_settings` VALUES (1, NULL, '{\r\n  \"version\": \"1.0\",\r\n  \"last_updated\": \"2023-10-01\",\r\n  \"description\": \"Dịch vụ thiết kế landing page chuyên nghiệp tại CCO Media\",\r\n  \"website_name\": \"CCO MEDIA\",\r\n  \"website_url\": \"https://cco.media\",\r\n  \"logo\": \"https://cco.media/logo.png\",\r\n  \"title\": \"DỊCH VỤ THIẾT KẾ WEB LANDING PAGE CHUYÊN NGHIỆP\",\r\n  \"contact_info\": {\r\n    \"email\": \"info@cco.media\",\r\n    \"address\": \"154 Phạm Văn Chiêu, Phường 9, Gò Vấp\",\r\n    \"hotline\": [\r\n      \"+84 123 456 789\",\r\n      \"+84 987 654 321\",\r\n      \"+84 321 654 987\"\r\n    ],\r\n    \"social_links\": {\r\n      \"facebook\": \"https://facebook.com/ccomedia\",\r\n      \"twitter\": \"https://twitter.com/ccomedia\",\r\n      \"linkedin\": \"https://linkedin.com/company/ccomedia\",\r\n      \"instagram\": \"https://instagram.com/ccomedia\",\r\n      \"youtube\": \"https://youtube.com/c/ccomedia\"\r\n    }\r\n  },\r\n  \"theme\": {\r\n    \"primary_color\": \"#007BFF\",\r\n    \"secondary_color\": \"#6C757D\"\r\n  }\r\n}\r\n', '2025-06-17 01:13:14', '2025-06-17 01:13:14');

SET FOREIGN_KEY_CHECKS = 1;
