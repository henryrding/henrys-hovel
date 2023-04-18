-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "inventory"
  ("cardId", "name", "image", "setName", "setCode", "rarity", "foil", "price", "quantity", "visible", "collectorNumber")
  values
    ('d32b3637-ffc8-4bda-bfc1-912f5789b5ed', 'Goblin King', '/front/d/3/d32b3637-ffc8-4bda-bfc1-912f5789b5ed.jpg?1675830355', 'Seventh Edition', '7ed', 'rare', true, 49999, 1, true, '190★'),
    ('7f1ccee1-20d1-48f2-ae90-a7a78172e05d', 'Hedron Detonator', '/front/7/f/7f1ccee1-20d1-48f2-ae90-a7a78172e05d.jpg?1680758876', 'March of the Machine Commander', 'moc', 'rare', true, 209, 1, true, '31'),
    ('94655928-1f1c-4993-8139-c705be369134', 'Rhuk, Hexgold Nabber' ,'/front/9/4/94655928-1f1c-4993-8139-c705be369134.jpg?1675957451', 'Phyrexia: All Will Be One', 'one', 'rare', true, 335, 1, true, '412'),
    ('14cb7a29-7bca-4402-b47c-e73eaa5e6fef', 'Slobad, Iron Goblin', '/front/1/4/14cb7a29-7bca-4402-b47c-e73eaa5e6fef.jpg?1675957506', 'Phyrexia: All Will Be One', 'one', 'rare', true, 199, 1, true, '448'),
    ('a6e8d7b9-ff5e-48ae-9e38-d2b6a45b119b', 'Exuberant Fuseling', '/front/a/6/a6e8d7b9-ff5e-48ae-9e38-d2b6a45b119b.jpg?1675957080', 'Phyrexia: All Will Be One', 'one', 'uncommon', true, 50, 4, true, '129'),
    ('8faf1d83-3b6b-4e07-a024-3dfd37c29814', 'Mizzix, Replica Rider', '/front/8/f/8faf1d83-3b6b-4e07-a024-3dfd37c29814.jpg?1675644720', 'Jumpstart 2022', 'j22', 'rare', false, 189, 2, true, '35'),
    ('529e62a1-a32f-477a-ae5c-955f3df2a628', 'Goblin Researcher', '/front/5/2/529e62a1-a32f-477a-ae5c-955f3df2a628.jpg?1675644707', 'Jumpstart 2022', 'j22', 'common', false, 25, 8, true, '34'),
    ('2a012f05-0009-42cf-8a69-07140b2a2aef', 'Ardoz, Cobbler of War', '/front/2/a/2a012f05-0009-42cf-8a69-07140b2a2aef.jpg?1675644648', 'Jumpstart 2022', 'j22', 'rare', false, 450, 2, true, '29'),
    ('1002dc28-0244-40c4-a74b-49bf4e09050d', 'Sardian Avenger', '/front/1/0/1002dc28-0244-40c4-a74b-49bf4e09050d.jpg?1674099587', 'The Brothers'' War Commander', 'brc', 'rare', true, 414, 1, true, '43'),
    ('1636d138-aa63-476f-a930-41b1be988032', 'Skirk Prospector', '/front/1/6/1636d138-aa63-476f-a930-41b1be988032.jpg?1562731846', 'Dominaria', 'dom', 'common', false, 35, 16, true, '144'),
    ('40f80bd8-7ce2-449d-b06c-d3e353b54daa', '_____ Goblin', '/front/4/0/40f80bd8-7ce2-449d-b06c-d3e353b54daa.jpg?1673917786', 'Unfinity', 'unf', 'common', true, 457, 3, true, '393');

insert into "users"
  ("username", "hashedPassword", "firstName", "lastName", "email", "isAdmin")
  values
    ('customer', 'password123', 'John', 'Smith', 'email@example.com', false);

insert into "carts"
  ("userId")
  values
    (1);

insert into "cartInventory"
  ("cartId", "inventoryId", "quantity")
  values
    (1, 1, 1);
