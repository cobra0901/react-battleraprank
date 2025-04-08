import { supabase } from '../lib/supabase'

async function seedBattlers() {
  const battlers = [
    {
      name: 'Loaded Lux',
      alias: 'King Lux',
      bio: 'One of the most respected lyricists in battle rap history.',
      avatar_url: 'https://placehold.co/300x300?text=Loaded+Lux',
      social_links: { twitter: '@loadedlux', instagram: '@loadedlux' },
      stats: { wins: 15, losses: 2 }
    },
    {
      name: 'Tsu Surf',
      alias: 'Tsunami',
      bio: 'Known for his raw emotion and street credibility.',
      avatar_url: 'https://placehold.co/300x300?text=Tsu+Surf',
      social_links: { twitter: '@tsu_surf', instagram: '@tsu_surf' },
      stats: { wins: 18, losses: 5 }
    },
    {
      name: 'Geechi Gotti',
      alias: 'The Face of URL',
      bio: 'Compton native known for authenticity and consistency.',
      avatar_url: 'https://placehold.co/300x300?text=Geechi+Gotti',
      social_links: { twitter: '@geechigotti', instagram: '@geechigotti' },
      stats: { wins: 20, losses: 3 }
    }
  ]

  console.log('Seeding battlers...')
  const { data, error } = await supabase.from('battlers').insert(battlers).select()
  
  if (error) {
    console.error('Error seeding battlers:', error)
    return null
  }
  
  console.log(`Seeded ${data?.length} battlers`)
  return data
}

async function seedLeagues() {
  const leagues = [
    {
      name: 'Ultimate Rap League',
      description: 'The world\'s largest battle rap platform.',
      logo_url: 'https://placehold.co/300x300?text=URL',
      social_links: { website: 'https://urltv.tv', youtube: 'URLTV' }
    },
    {
      name: 'King of the Dot',
      description: 'Canada\'s premier battle rap league.',
      logo_url: 'https://placehold.co/300x300?text=KOTD',
      social_links: { website: 'https://kingofthedot.com', youtube: 'KingOfTheDot' }
    }
  ]

  console.log('Seeding leagues...')
  const { data, error } = await supabase.from('leagues').insert(leagues).select()
  
  if (error) {
    console.error('Error seeding leagues:', error)
    return null
  }
  
  console.log(`Seeded ${data?.length} leagues`)
  return data
}

async function seedBadges() {
  const badges = [
    {
      title: 'Lyrical Genius',
      description: 'Exceptional wordplay and metaphors',
      category: 'writing',
      is_positive: true,
      icon: 'PenTool'
    },
    {
      title: 'Puncher',
      description: 'Known for delivering hard-hitting punchlines',
      category: 'writing',
      is_positive: true,
      icon: 'Zap'
    },
    {
      title: 'Choker',
      description: 'Frequently stumbles or forgets lyrics',
      category: 'performance',
      is_positive: false,
      icon: 'AlertTriangle'
    }
  ]

  console.log('Seeding badges...')
  const { data, error } = await supabase.from('badges').insert(badges).select()
  
  if (error) {
    console.error('Error seeding badges:', error)
    return null
  }
  
  console.log(`Seeded ${data?.length} badges`)
  return data
}

async function run() {
  try {
    const battlers = await seedBattlers()
    const leagues = await seedLeagues()
    await seedBadges()
    
    if (battlers && battlers.length > 0 && leagues && leagues.length > 0) {
      // Create a battle between the first two battlers in the first league
      const battle = {
        title: `${battlers[0].name} vs ${battlers[1].name}`,
        league_id: leagues[0].id,
        event_name: 'Sample Event',
        battle_date: new Date().toISOString().split('T')[0],
        video_url: 'https://www.youtube.com/watch?v=example',
        description: 'A sample battle between two top-tier battlers.'
      }
      
      console.log('Creating a sample battle...')
      const { data: battleData, error: battleError } = await supabase
        .from('battles')
        .insert(battle)
        .select()
      
      if (battleError) {
        console.error('Error creating battle:', battleError)
      } else if (battleData && battleData.length > 0) {
        console.log(`Created battle: ${battleData[0].title}`)
        
        // Connect battlers to the battle
        const participants = [
          { battle_id: battleData[0].id, battler_id: battlers[0].id },
          { battle_id: battleData[0].id, battler_id: battlers[1].id }
        ]
        
        const { error: participantsError } = await supabase
          .from('battle_participants')
          .insert(participants)
        
        if (participantsError) {
          console.error('Error connecting battlers to battle:', participantsError)
        } else {
          console.log('Connected battlers to battle')
        }
      }
    }
    
    console.log('Seed data process completed')
  } catch (error) {
    console.error('Error in seed process:', error)
  }
}

run()
