-- Initial data for the battlers table
INSERT INTO public.battlers (name, alias, bio, avatar_url, social_links, stats)
VALUES
  ('Loaded Lux', 'King Lux', 'One of the most respected lyricists in battle rap history.', 'https://placehold.co/300x300?text=Loaded+Lux', '{"twitter": "@loadedlux", "instagram": "@loadedlux"}', '{"wins": 15, "losses": 2}'),
  ('Tsu Surf', 'Tsunami', 'Known for his raw emotion and street credibility.', 'https://placehold.co/300x300?text=Tsu+Surf', '{"twitter": "@tsu_surf", "instagram": "@tsu_surf"}', '{"wins": 18, "losses": 5}'),
  ('Geechi Gotti', 'The Face of URL', 'Compton native known for authenticity and consistency.', 'https://placehold.co/300x300?text=Geechi+Gotti', '{"twitter": "@geechigotti", "instagram": "@geechigotti"}', '{"wins": 20, "losses": 3}'),
  ('Rum Nitty', 'The Puncher', 'Known for his complex punch lines and wordplay.', 'https://placehold.co/300x300?text=Rum+Nitty', '{"twitter": "@RumNitty", "instagram": "@rum_nitty"}', '{"wins": 17, "losses": 4}'),
  ('Murda Mook', 'The Godfather', 'Pioneer who helped shape modern battle rap.', 'https://placehold.co/300x300?text=Murda+Mook', '{"twitter": "@MurdaMookez", "instagram": "@murdamookez"}', '{"wins": 12, "losses": 2}')
ON CONFLICT (id) DO NOTHING;

-- Initial data for the leagues table
INSERT INTO public.leagues (name, description, logo_url, social_links)
VALUES
  ('Ultimate Rap League', 'The world''s largest battle rap platform.', 'https://placehold.co/300x300?text=URL', '{"website": "https://urltv.tv", "youtube": "URLTV"}'),
  ('King of the Dot', 'Canada''s premier battle rap league.', 'https://placehold.co/300x300?text=KOTD', '{"website": "https://kingofthedot.com", "youtube": "KingOfTheDot"}'),
  ('RBE', 'Rare Breed Entertainment - Known for quality matchups.', 'https://placehold.co/300x300?text=RBE', '{"youtube": "RareBreeEnt"}')
ON CONFLICT (id) DO NOTHING;

-- Initial data for battles
INSERT INTO public.battles (title, league_id, event_name, battle_date, video_url, description)
SELECT 
  'Loaded Lux vs Tsu Surf', 
  l.id, 
  'Summer Madness 2', 
  '2022-09-15', 
  'https://www.youtube.com/watch?v=example1', 
  'One of the most anticipated battles in URL history.'
FROM public.leagues l
WHERE l.name = 'Ultimate Rap League'
LIMIT 1;

INSERT INTO public.battles (title, league_id, event_name, battle_date, video_url, description)
SELECT 
  'Geechi Gotti vs Rum Nitty', 
  l.id, 
  'Volume 5', 
  '2022-06-25', 
  'https://www.youtube.com/watch?v=example2', 
  'A classic West Coast matchup between two top-tier performers.'
FROM public.leagues l
WHERE l.name = 'Ultimate Rap League'
LIMIT 1;

-- Connect battlers to battles
INSERT INTO public.battle_participants (battle_id, battler_id)
SELECT b.id, bt.id
FROM public.battles b, public.battlers bt
WHERE b.title = 'Loaded Lux vs Tsu Surf' AND bt.name = 'Loaded Lux';

INSERT INTO public.battle_participants (battle_id, battler_id)
SELECT b.id, bt.id
FROM public.battles b, public.battlers bt
WHERE b.title = 'Loaded Lux vs Tsu Surf' AND bt.name = 'Tsu Surf';

INSERT INTO public.battle_participants (battle_id, battler_id)
SELECT b.id, bt.id
FROM public.battles b, public.battlers bt
WHERE b.title = 'Geechi Gotti vs Rum Nitty' AND bt.name = 'Geechi Gotti';

INSERT INTO public.battle_participants (battle_id, battler_id)
SELECT b.id, bt.id
FROM public.battles b, public.battlers bt
WHERE b.title = 'Geechi Gotti vs Rum Nitty' AND bt.name = 'Rum Nitty';

-- Initial data for badges
INSERT INTO public.badges (title, description, category, is_positive, icon)
VALUES
  ('Lyrical Genius', 'Exceptional wordplay and metaphors', 'writing', true, 'PenTool'),
  ('Puncher', 'Known for delivering hard-hitting punchlines', 'writing', true, 'Zap'),
  ('Crowd Control', 'Excellent at engaging and controlling the audience', 'performance', true, 'Users'),
  ('Choker', 'Frequently stumbles or forgets lyrics', 'performance', false, 'AlertTriangle'),
  ('Strategic Thinker', 'Demonstrates excellent battle strategy and approach', 'personal', true, 'Brain'),
  ('Consistency', 'Shows consistent quality across battles', 'personal', true, 'LineChart')
ON CONFLICT (title) DO NOTHING;
