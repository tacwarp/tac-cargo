import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Please apply migrations manually via Supabase Dashboard SQL Editor',
    instructions: 'See APPLY_MIGRATIONS.md for complete SQL',
    supabase_url: 'https://supabase.com/dashboard/project/dqthizzubvoxmclkcubc/sql',
    note: 'Supabase client cannot execute DDL statements. Use the SQL Editor in the dashboard.'
  })
}
