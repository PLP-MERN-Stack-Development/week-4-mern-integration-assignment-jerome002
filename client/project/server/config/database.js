const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test the connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('count(*)');
    if (error) {
      console.error('Database connection error:', error);
    } else {
      console.log('✅ Database connected successfully');
    }
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

testConnection();

module.exports = supabase;