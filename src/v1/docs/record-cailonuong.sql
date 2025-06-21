INSERT INTO `stores` (`name`, `phone`, `address`, `map_url`, `avatar_url`, `opening_hours`, `status`)
VALUES ('Cái Lò Nướng - Nguyễn Thị Minh Khai', '02888883388', '15K Nguyễn Thị Minh Khai, P. Bến Nghé, Quận 1, TP.HCM', 'https://maps.example.com/store1', 'https://example.com/avatar/store1.jpg', '8:00 - 22:00', 'active'),
       ('Cái Lò Nướng - Nguyễn Thái Học', '02888883388', '173 Nguyễn Thái Học, P. Phạm Ngũ Lão, Quận 1, TP.HCM', 'https://maps.example.com/store2', 'https://example.com/avatar/store2.jpg', '8:00 - 22:00', 'active'),
       ('Cái Lò Nướng - Lê Văn Việt', '02888883388', '29 Lê Văn Việt, P. Hiệp Phú, TP Thủ Đức, TP.HCM', 'https://maps.example.com/store3', 'https://example.com/avatar/store3.jpg', '8:00 - 22:00', 'active'),
       ('Cái Lò Nướng - Quang Trung', '02888883388', '186 Quang Trung, Phường 10, Quận Gò Vấp, TP.HCM', 'https://maps.example.com/store4', 'https://example.com/avatar/store4.jpg', '8:00 - 22:00', 'active'),
       ('Cái Lò Nướng - Nguyễn Thị Thập', '02888883388', '477 Nguyễn Thị Thập, P. Tân Phong, Quận 7, TP.HCM', 'https://maps.example.com/store5', 'https://example.com/avatar/store5.jpg', '8:00 - 22:00', 'active'),
       ('Cái Lò Nướng - Ba Gia', '02888883388', '2A Ba Gia, P.7, Quận Tân Bình, TP.HCM', 'https://maps.example.com/store6', 'https://example.com/avatar/store6.jpg', '8:00 - 22:00', 'active');


INSERT INTO `product_category_groups` (`name`, `slug`, `description`, `status`)
VALUES ('Bánh Trung Thu', 'banh-trung-thu', 'Các loại bánh trung thu truyền thống và hiện đại', 'active'),
       ('Bánh Sinh Nhật', 'banh-sinh-nhat', 'Bánh sinh nhật đa dạng kiểu dáng và hương vị', 'active'),
       ('Bánh Tráng Miệng', 'banh-trang-mieng', 'Các loại bánh ngọt dùng làm tráng miệng', 'active');


INSERT INTO `product_categories` (`name`, `slug`, `description`, `status`, `category_group_id`)
VALUES ('Sweetbox', 'sweetbox', 'Hộp bánh ngọt cao cấp dành cho các dịp đặc biệt', 'active', 2),
       ('Sweetin – Bánh hộp thiết kế cao cấp', 'sweetin-banh-hop-thiet-ke-cao-cap', 'Bánh hộp được thiết kế tinh tế, phù hợp làm quà tặng', 'active', 3),
       ('Bánh Mousse', 'banh-mousse', 'Bánh mousse mềm mịn với nhiều hương vị', 'active', 2),
       ('Bánh Entremet', 'banh-entremet', 'Bánh entremet đa tầng, sang trọng và hiện đại', 'active', 2),
       ('Bánh Kem Bắp', 'banh-kem-bap', 'Bánh kem bắp truyền thống, thơm ngon', 'active', 2),
       ('Bánh Flan Gato', 'banh-flan-gato', 'Sự kết hợp giữa flan và gato, ngọt ngào và béo ngậy', 'active', 2),
       ('Bánh Healthy', 'banh-healthy', 'Bánh lành mạnh, ít đường, tốt cho sức khỏe', 'active', 3),
       ('Bánh nướng – Bánh mì', 'banh-nuong-banh-mi', 'Các loại bánh nướng và bánh mì tươi ngon', 'active', 3);


INSERT INTO `product_properties` (`property_key`, `property_name`, `property_type`, `description`)
VALUES ('flavor', 'Hương vị', 'text', 'Mô tả hương vị của sản phẩm'),
       ('structure', 'Cấu trúc bánh', 'text', 'Cấu trúc các lớp và thành phần của bánh'),
       ('decoration', 'Trang trí', 'text', 'Phần trang trí trên bề mặt bánh'),
       ('storage', 'Bảo quản', 'text', 'Hướng dẫn bảo quản sản phẩm'),
       ('accessories', 'Phụ kiện tặng kèm', 'text', 'Các phụ kiện đi kèm sản phẩm'),
       ('category', 'Phân loại', 'text', 'Phân loại hoặc bộ sưu tập của sản phẩm');


INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('noire-mangosteen-001', 'Noire Mangosteen – Entremet Măng Cụt (màu Nâu)', 'https://example.com/thumbnail/noire-mangosteen.jpg', 'Entremet Măng Cụt với lớp tráng gương màu nâu, thiên nga tạo hình, thể hiện hương vị nông sản Việt.', 'SKU-NM001', 'BAR-NM001', 'noire-mangosteen-entremet-mang-cut-mau-nau', 750000.00, 'VND', 4, 'active', FALSE, TRUE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('summer-wine-001', 'Summer Wine – Entremet Anh Đào', 'https://example.com/thumbnail/summer-wine-anh-dao.jpg', 'Entremet Anh Đào mang phong vị mùa hè, tinh tế với mousse cherry và nhân Baileys cremeux.', 'SKU-SW001', 'BAR-SW001', 'summer-wine-entremet-anh-dao', 650000.00, 'VND', 4, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('sweetbox-signature-001', 'SWEETBOX SIGNATURE (Xanh) – Hộp 8 vị', 'https://example.com/thumbnail/sweetbox-signature-xanh.jpg', 'Hộp bánh Sweetbox Signature màu xanh với 8 vị mousse, thiết kế tinh tế, phù hợp làm quà tặng.', 'SKU-SS001', 'BAR-SS001', 'sweetbox-signature-xanh-hop-8-vi', 295000.00, 'VND', 1, 'active', FALSE, TRUE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('sweetbox-signature-002', 'SWEETBOX SIGNATURE (Xanh) – Hộp 16 vị', 'https://example.com/thumbnail/sweetbox-signature-xanh-16vi.jpg', 'Hộp bánh Sweetbox Signature màu xanh với 16 vị mousse, thiết kế tinh tế, phù hợp làm quà tặng sang trọng.', 'SKU-SS002', 'BAR-SS002', 'sweetbox-signature-xanh-hop-16-vi', 495000.00, 'VND', 1, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('chocolate-dream-delight-001', 'Chocolate Dream Cake (Delight)', 'https://example.com/thumbnail/chocolate-dream-delight.jpg', 'Bánh Sweetin Chocolate Dream Cake phiên bản Delight, mềm mịn, đậm vị socola, đựng trong hộp thiếc sang trọng.', 'SKU-CD001', 'BAR-CD001', 'chocolate-dream-cake-delight', 195000.00, 'VND', 2, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('sweetin-love-classic-001', 'Sweetin Love – Chocolate Dream Cake Classic', 'https://example.com/thumbnail/sweetin-love-classic.jpg', 'Bánh Sweetin Love phiên bản Classic cho Valentine, đậm vị socola với hạt giòn bùi, đựng trong hộp thiếc sang trọng.', 'SKU-SL001', 'BAR-SL001', 'sweetin-love-chocolate-dream-cake-classic', 245000.00, 'VND', 2, 'active', FALSE, TRUE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('sweetin-love-delight-001', 'Sweetin Love – Chocolate Dream Cake Delight', 'https://example.com/thumbnail/sweetin-love-delight.jpg', 'Bánh Sweetin Love phiên bản Delight cho Valentine, vị socola thuần túy tan chảy, đựng trong hộp thiếc sang trọng.', 'SKU-SD001', 'BAR-SD001', 'sweetin-love-chocolate-dream-cake-delight', 225000.00, 'VND', 2, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('green-bliss-mousse-bo-001', 'Green Bliss – Mousse Bơ', 'https://example.com/thumbnail/green-bliss-mousse-bo.jpg', 'Bánh mousse bơ với sắc xanh tự nhiên, mang cảm giác tươi mát, best-seller mùa hè của Cái Lò Nướng.', 'SKU-GB001', 'BAR-GB001', 'green-bliss-mousse-bo', 535000.00, 'VND', 3, 'active', FALSE, TRUE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('delicate-bloom-kem-bap-001', 'Delicate Bloom – Bánh Kem Bắp Dâu', 'https://example.com/thumbnail/delicate-bloom-kem-bap.jpg', 'Bánh kem bắp với tạo hình hoa nở rộ, kết hợp hương vị bắp truyền thống và trang trí hiện đại.', 'SKU-DB001', 'BAR-DB001', 'delicate-bloom-banh-kem-bap-dau', 465000.00, 'VND', 5, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('elsa-swan-banh-bap-001', 'Elsa Swan – Bánh Bắp Thiên Nga', 'https://example.com/thumbnail/elsa-swan-banh-bap.jpg', 'Bánh kem bắp với thiết kế thiên nga tinh tế, hơn 50 cánh socola trắng, vương miện chocolate phủ nhũ vàng bạc.', 'SKU-ES001', 'BAR-ES001', 'elsa-swan-banh-bap-thien-nga', 595000.00, 'VND', 5, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('flan-gato-berry-mix-001', 'Flan Gato Berry Mix', 'https://example.com/thumbnail/flan-gato-berry-mix.jpg', 'Bánh Flan Gato với flan truyền thống và bông lan sô-cô-la, trang trí dâu tươi và việt quất, phổ biến tại Hồ Chí Minh.', 'SKU-FG001', 'BAR-FG001', 'flan-gato-berry-mix', 515000.00, 'VND', 6, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('koko-mango-entremet-001', 'KoKo Mango – Entremet Xôi Xoài', 'https://example.com/thumbnail/koko-mango-entremet.jpg', 'Bánh Entremet Xôi Xoài lần đầu tại Sài Gòn, kết hợp xôi nếp Cái Hoa Vàng, xoài cát Hòa Lộc, và dừa, tôn vinh nông sản Việt.', 'SKU-KM001', 'BAR-KM001', 'koko-mango-entremet-xoi-xoai', 650000.00, 'VND', 4, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('flan-gato-fruit-pins-001', 'Flan Gato Fruit & Pins – Flan Gato Trái Cây', 'https://example.com/thumbnail/flan-gato-fruit-pins.jpg', 'Bánh Flan Gato với flan truyền thống và bông lan sô-cô-la, trang trí trái cây tươi và kem, phổ biến tại Hồ Chí Minh.', 'SKU-FF001', 'BAR-FF001', 'flan-gato-fruit-pins-trai-cay', 515000.00, 'VND', 6, 'active', FALSE, TRUE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('flan-gato-black-sesame-matcha-002', 'Soft Glow – Flan Gato Mè Đen Matcha', 'https://example.com/thumbnail/flan-gato-black-sesame-matcha.jpg', 'Bánh Flan Gato kết hợp flan mè đen thơm lừng và bông lan matcha tinh tế, trang trí với jelly caramel, đào, dâu tây và búp sữa chua, mang hương vị Nhật Bản đậm đà.', 'SKU-FM002', 'BAR-FM002', 'flan-gato-black-sesame-matcha', 525000.00, 'VND', 6, 'active', FALSE, FALSE);
INSERT INTO `products` (`name_code`, `name`, `thumbnail_url`, `description`, `sku`, `barcode`, `slug`, `default_price`, `currency`, `category_id`, `status`, `has_variant_pricing`, `is_favorite`)
VALUES ('flan-gato-thai-tea-003', 'Bold Charming – Flan Gato Trà Thái Đỏ', 'https://example.com/thumbnail/flan-gato-thai-tea.jpg', 'Bánh Flan Gato kết hợp flan trà Thái đỏ đặc trưng và bông lan sô-cô-la, trang trí với jelly caramel, đào, dâu tây và nho, mang hương vị Thái Lan độc đáo.', 'SKU-FT003', 'BAR-FT003', 'flan-gato-tra-thai-do-bold-charming', 435000.00, 'VND', 6, 'active', FALSE, FALSE);

INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (1, 1, 'Chua ngọt dịu nhẹ – hương thơm đặc trưng của măng cụt – Ngọt nhẹ của socola'),
       (1, 2, 'Phần thân bánh gồm: Mousse măng cụt vị chua ngọt, 2 bạt bông lan vani truyền thống, lớp nhân măng cụt với múi thịt tươi, lớp nhân quýt thơm chua ngọt với rượu cam'),
       (1, 3, 'Chocolate trắng tạo hình, thạch dẻo vị khế vàng, dâu tây, kem trang trí truyền thống, hoa tạo hình'),
       (1, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (1, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (1, 6, 'Bánh Entremet, BST Entremet Măng Cụt | Hồ thiên nga cho mùa trái chín');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (2, 1, 'Chua ngọt dịu nhẹ – Dẻo mềm – Thơm tự nhiên – Béo nhẹ'),
       (2, 2, 'Bạt bánh bông lan vani truyền thống, nhân cherry confit chua ngọt từ cherry và dâu nghiền với chút rượu cherry, nhân Baileys cremeux dẻo mềm từ chocolate trắng và rượu sữa Baileys, mousse cherry chua ngọt với hương rượu cherry'),
       (2, 3, 'Chocolate trắng tạo hình, viên mousse sữa chua, dâu tây'),
       (2, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (2, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (2, 6, 'Bánh Entremet, BST Entremet Anh Đào – Summer Wine');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (3, 1, 'Ngọt dịu – Béo nhẹ – Chua ngọt – Thơm tự nhiên'),
       (3, 2, 'Lớp trang trí trái cây tươi, sô-cô-la hoặc jelly, mousse theo từng vị bánh (khế, cherry, bơ, bắp, chuối caramel, mãng cầu, trà xanh, ổi hồng), cốt bánh bông lan'),
       (3, 3, 'Lớp trang trí trái cây tươi, sô-cô-la hoặc jelly'),
       (3, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (3, 5, 'Khung ảnh hoặc ghim thông điệp'),
       (3, 6, 'Sweetbox – Set bánh nhiều vị');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (4, 1, 'Ngọt dịu – Béo nhẹ – Chua ngọt – Thơm tự nhiên'),
       (4, 2, 'Lớp trang trí trái cây tươi, sô-cô-la hoặc jelly, mousse theo từng vị bánh (Bơ, Bắp, Táo, Khế, Yuzu, Xoài, Lê hoa cúc, Chuối caramel, Mãng cầu, Măng cụt, Ổi hồng, Dưa lưới, Cherry, Vải hoa hồng, Dừa, Trà xanh), cốt bánh bông lan'),
       (4, 3, 'Lớp trang trí trái cây tươi, sô-cô-la hoặc jelly'),
       (4, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (4, 5, 'Khung ảnh hoặc ghim thông điệp, hai chiếc muỗng cao cấp, sang trọng'),
       (4, 6, 'Sweetbox – Set bánh nhiều vị');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (5, 1, 'Đắng nhẹ – ngọt dịu – đậm vị socola'),
       (5, 2, 'Bạt bánh socola cake nướng, mousse socola đen nguyên chất, lớp ganache dẻo socola đen, lớp socola nguyên chất, bột cacao'),
       (5, 3, 'Phủ ngoài lớp ganache bóng mượt và bột cacao'),
       (5, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (5, 5, '1 thìa lá bạc'),
       (5, 6, 'Bánh hủ thiếc');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (7, 1, 'Đắng nhẹ – ngọt dịu – đậm vị socola'),
       (7, 2, 'Viên socola trái tim ở giữa bánh, 5 lớp từ dưới lên trên: bạt bánh socola cake nướng, mousse socola đen nguyên chất, lớp ganache dẻo socola đen, lớp socola nguyên chất, bột cacao'),
       (7, 3, 'Viên socola trái tim, phủ lớp ganache bóng mượt và bột cacao'),
       (7, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (7, 5, '1 thìa trái tim'),
       (7, 6, 'Bánh hủ thiếc');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (8, 1, 'Ngọt bùi tự nhiên – Hương bơ tươi – Béo nhẹ'),
       (8, 2, 'Phần thân bánh gồm: mousse bơ tươi, bông lan vị vani'),
       (8, 3, 'Bơ, dâu tươi, búp sữa chua'),
       (8, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (8, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (8, 6, 'Bánh mousse');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (9, 1, 'Ngọt dịu – Thơm đặc trưng – Béo nhẹ'),
       (9, 2, 'Phần thân bánh gồm: mousse bắp, bông lan bắp'),
       (9, 3, 'Tạo hình hoa với nho, dâu, đào, bắp'),
       (9, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (9, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (9, 6, 'Bánh kem bắp');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (10, 1, 'Ngọt dịu – Thơm đặc trưng – Béo nhẹ'),
       (10, 2, 'Bánh bông lan bắp kết hợp cùng kem bắp, cổ và cánh thiên nga được tạo hình bằng socola'),
       (10, 3, 'Hơn 50 cánh thiên nga từ chocolate trắng, vương miện chocolate phủ nhũ vàng bạc'),
       (10, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (10, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (10, 6, 'Bánh kem bắp');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (11, 1, 'Ngọt dịu – Béo nhẹ – Thơm – Đắng nhẹ'),
       (11, 2, 'Phần thân bánh gồm: bánh flan vị truyền thống, bông lan sô-cô-la'),
       (11, 3, 'Jelly caramel, dâu tươi, việt quất, kèm cây ghim trang trí theo chủ đề'),
       (11, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (11, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (11, 6, 'Bánh Flan Gato');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (12, 1, 'Chua ngọt dịu nhẹ – Dẻo bùi của nếp – Sần sật của dừa'),
       (12, 2, 'Phần thân bánh gồm: mousse sữa chua trái tim, nhân xôi nếp Cái Hoa Vàng cùng sữa và hạt vanilla, mousse xoài cát Hòa Lộc kết hợp nước cốt dừa và vụn dừa non, nhân xoài tắc confit thủ công, bông lan dừa'),
       (12, 3, 'Dâu, đào, tráng gương bóng, phun xù'),
       (12, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (12, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (12, 6, 'Bánh Entremet');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (13, 1, 'Ngọt dịu – Béo nhẹ – Đắng nhẹ'),
       (13, 2, 'Phần thân bánh gồm: bánh flan vị truyền thống, bông lan sô-cô-la'),
       (13, 3, 'Jelly caramel, vụn bánh gato, dâu tươi, đào, việt quất, kem tươi'),
       (13, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (13, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu yêu cầu)'),
       (13, 6, 'Bánh Flan Gato');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (14, 1, 'Ngọt dịu – Béo nhẹ – Thơm – Đắng nhẹ'),
       (14, 2, 'Phần thân bánh gồm các lớp chính: + Bánh flan vị mè đen + Bông lan matcha'),
       (14, 3, 'Jelly caramel, đào, dâu tây, búp sữa chua'),
       (14, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (14, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu bạn yêu cầu)'),
       (14, 6, 'Bánh Flan Gato, BST Hương Vị Nhật Bản | Soft Glow – Tỏa sáng dịu dàng');
INSERT INTO `product_property_assignments` (`product_id`, `property_id`, `property_value`)
VALUES (15, 1, 'Ngọt dịu – Béo nhẹ – Thơm – Đắng nhẹ'),
       (15, 2, 'Phần thân bánh gồm các lớp chính: + Bánh flan vị trà thái đỏ + Bông lan sô-cô-la'),
       (15, 3, 'Jelly caramel, đào, dâu tây, nho'),
       (15, 4, 'Bánh nên được dùng trong ngày và ngon hơn khi bảo quản lạnh trước khi thưởng thức'),
       (15, 5, '1 dao cắt bánh, 1 bộ dĩa và muỗng, 10 nến nhỏ (hoặc nến số nếu bạn yêu cầu)'),
       (15, 6, 'Bánh Flan Gato, BST Hương Vị Thái Lan | Bold Charming – Vẻ đẹp lôi cuốn');
