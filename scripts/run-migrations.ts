import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n⚠️  Migrations require service role key, not anon key for security.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  console.log('🚀 Running database migrations...\n')

  const migrations = [
    'database/migrations/002_add_exceptions_payments.sql',
    'database/migrations/003_fix_profiles_rls.sql',
  ]

  for (const migrationPath of migrations) {
    try {
      console.log(`📝 Running: ${migrationPath}`)
      const sql = readFileSync(join(process.cwd(), migrationPath), 'utf-8')
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
      
      if (error) {
        console.error(`❌ Error in ${migrationPath}:`, error)
      } else {
        console.log(`✅ Success: ${migrationPath}\n`)
      }
    } catch (err) {
      console.error(`❌ Failed to read ${migrationPath}:`, err)
    }
  }

  console.log('✨ Migration process complete!')
}

runMigrations()
