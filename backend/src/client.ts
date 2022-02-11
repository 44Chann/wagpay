import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	'https://iyjgewigalyzimllhbyq.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5amdld2lnYWx5emltbGxoYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQzMjY2NTgsImV4cCI6MTk1OTkwMjY1OH0.K-Jc-BDVzE3ZyGp6FCH0yAHjravB2Bl5-An4c6QQ33Y'
)