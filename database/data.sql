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
  ("cardId", "name", "image", "setName", "setCode", "rarity", "finish", "price", "quantity", "visible", "collectorNumber", "manaCost", "typeLine", "oracleText", "power", "toughness", "flavorText", "artist")
  values
    ('d32b3637-ffc8-4bda-bfc1-912f5789b5ed', 'Goblin King', '/front/d/3/d32b3637-ffc8-4bda-bfc1-912f5789b5ed.jpg?1675830355', 'Seventh Edition', '7ed', 'rare', 'foil', 49999, 1, true, '190★', '{1}{R}{R}', 'Creature — Goblin', 'Other Goblins get +1/+1 and have mountainwalk.', '2', '2', 'To be king, Numsgil did in Blog, who did in Unkful, who did in Viddle, who did in Loll, who did in Alrok. . . .', 'Ron Spears'),
    ('7f1ccee1-20d1-48f2-ae90-a7a78172e05d', 'Hedron Detonator', '/front/7/f/7f1ccee1-20d1-48f2-ae90-a7a78172e05d.jpg?1680758876', 'March of the Machine Commander', 'moc', 'rare', 'foil', 209, 1, true, '31', '{2}{R}', 'Creature — Goblin Artificer', 'Whenever an artifact enters the battlefield under your control, Hedron Detonator deals 1 damage to target opponent.
{T}, Sacrifice two artifacts: Exile the top card of your library. You may play that card this turn.', '2', '3', '"*Compleat* this!"', 'Caroline Gariba'),
    ('94655928-1f1c-4993-8139-c705be369134', 'Rhuk, Hexgold Nabber' ,'/front/9/4/94655928-1f1c-4993-8139-c705be369134.jpg?1675957451', 'Phyrexia: All Will Be One', 'one', 'rare', 'foil', 335, 1, true, '412', '{2}{R}', 'Legendary Creature — Goblin Rebel', 'Trample, haste
Whenever an equipped creature you control other than Rhuk, Hexgold Nabber attacks or dies, you may attach all Equipment attached to that creature to Rhuk.', '2', '2', '', 'Andrea De Dominicis'),
    ('14cb7a29-7bca-4402-b47c-e73eaa5e6fef', 'Slobad, Iron Goblin', '/front/1/4/14cb7a29-7bca-4402-b47c-e73eaa5e6fef.jpg?1675957506', 'Phyrexia: All Will Be One', 'one', 'rare', 'foil', 199, 1, true, '448', '{2}{R}', 'Legendary Creature — Phyrexian Goblin Artificer', '{T}, Sacrifice an artifact: Add an amount of {R} equal to the sacrificed artifact''s mana value. Spend this mana only to cast artifact spells or activate abilities of artifacts.', '3', '3', 'The Forge embraces all who contribute to the Great Work.', 'Dominik Mayer'),
    ('a6e8d7b9-ff5e-48ae-9e38-d2b6a45b119b', 'Exuberant Fuseling', '/front/a/6/a6e8d7b9-ff5e-48ae-9e38-d2b6a45b119b.jpg?1675957080', 'Phyrexia: All Will Be One', 'one', 'uncommon', 'foil', 50, 4, true, '129', '{R}', 'Creature — Phyrexian Goblin Warrior', 'Trample
Exuberant Fuseling gets +1/+0 for each oil counter on it.
When Exuberant Fuseling enters the battlefield and whenever another creature or artifact you control is put into a graveyard from the battlefield, put an oil counter on Exuberant Fuseling.', '0', '1', '', 'Billy Christian'),
    ('8faf1d83-3b6b-4e07-a024-3dfd37c29814', 'Mizzix, Replica Rider', '/front/8/f/8faf1d83-3b6b-4e07-a024-3dfd37c29814.jpg?1675644720', 'Jumpstart 2022', 'j22', 'rare', 'nonfoil', 189, 2, true, '35', '{4}{R}', 'Legendary Creature — Goblin Wizard', 'Flying
Whenever you cast a spell from anywhere other than your hand, you may pay {1}{U/R}. If you do, copy that spell and you may choose new targets for the copy. If the copy is a permanent spell, it gains haste and "At the beginning of your end step, sacrifice this permanent." (A copy of a permanent spell becomes a token.)', '4', '5', '', 'Zoltan Boros'),
    ('529e62a1-a32f-477a-ae5c-955f3df2a628', 'Goblin Researcher', '/front/5/2/529e62a1-a32f-477a-ae5c-955f3df2a628.jpg?1675644707', 'Jumpstart 2022', 'j22', 'common', 'nonfoil', 25, 8, true, '34', '{3}{R}', 'Creature — Goblin Wizard', 'When Goblin Researcher enters the battlefield, exile the top card of your library. During any turn you attacked with Goblin Researcher, you may play that card.', '3', '3', 'Slonk was struck by lightning twenty-seven times before he got the idea. Another forty-three hits and he''d perfected it.', 'Izzy'),
    ('2a012f05-0009-42cf-8a69-07140b2a2aef', 'Ardoz, Cobbler of War', '/front/2/a/2a012f05-0009-42cf-8a69-07140b2a2aef.jpg?1675644648', 'Jumpstart 2022', 'j22', 'rare', 'nonfoil', 450, 2, true, '29', '{1}{R}', 'Legendary Creature — Goblin Shaman', 'Haste
Whenever Ardoz, Cobbler of War or another creature enters the battlefield under your control, that creature gets +2/+0 until end of turn.
{3}{R}: Create a 1/1 red Goblin creature token with haste. Activate only as a sorcery.', '1', '1', '', 'Kev Walker'),
    ('1002dc28-0244-40c4-a74b-49bf4e09050d', 'Sardian Avenger', '/front/1/0/1002dc28-0244-40c4-a74b-49bf4e09050d.jpg?1674099587', 'The Brothers'' War Commander', 'brc', 'rare', 'foil', 414, 1, true, '43', '{1}{R}', 'Creature — Goblin Warrior', 'First strike, trample
Whenever Sardian Avenger attacks, it gets +X/+0 until end of turn, where X is the number of artifacts your opponents control.
Whenever an artifact an opponent controls is put into a graveyard from the battlefield, Sardian Avenger deals 1 damage to that player.', '1', '1', '', 'Joseph Weston'),
    ('1636d138-aa63-476f-a930-41b1be988032', 'Skirk Prospector', '/front/1/6/1636d138-aa63-476f-a930-41b1be988032.jpg?1562731846', 'Dominaria', 'dom', 'common', 'nonfoil', 35, 16, true, '144', '{R}', 'Creature — Goblin', 'Sacrifice a Goblin: Add {R}.', '1', '1', 'Deep beneath the ruined continent of Otaria, there''s a mine where goblins still work, ignorant of the destruction above.', 'Slawomir Maniak'),
    ('40f80bd8-7ce2-449d-b06c-d3e353b54daa', '_____ Goblin', '/front/4/0/40f80bd8-7ce2-449d-b06c-d3e353b54daa.jpg?1673917786', 'Unfinity', 'unf', 'common', 'foil', 457, 3, true, '393', '{2}{R}', 'Creature — Goblin Guest', 'When this creature enters the battlefield, you may put a name sticker on it. Add {R} for each unique vowel on that sticker. (The vowels are A, E, I, O, U, and Y.)', '2', '2', 'The Astrotorium has never been a place for self-restraint.', 'Chuck Lukacs');

insert into "users"
  ("username", "hashedPassword", "firstName", "lastName", "email", "isAdmin")
  values
    ('admin', '$argon2id$v=19$m=4096,t=3,p=1$8G36FRSBhDmYKU2tPkFSrQ$q7fjPwfVVMJ/mXqh6H6T9U0hPBPU7I9yusMhEbJJOYI', 'Henry', 'Ding', 'dinghenryr@gmail.com', true),
    ('johnsmith', '$argon2id$v=19$m=4096,t=3,p=1$hc/LDCApdy3ReDg8ZAdjeg$55ZlZH7oZL4aoqeLoqc0axVlwB04j9gpVr+vOSEYhGM', 'John', 'Smith', 'johnsmith@example.com', false);

insert into "carts"
  ("userId")
  values
    (2);
