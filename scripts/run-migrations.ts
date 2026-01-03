import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

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
