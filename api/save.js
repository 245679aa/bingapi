import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fcpclqkyakutcmgmmwzh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcGNscWt5YWt1dGNtZ21td3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDAwMjMsImV4cCI6MjA1MTIxNjAyM30.lme6Kc2LRO3Jiu4v9QQq7sOOZSWF9l09I0FbSMWqS1c');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { original, encrypted, added_time, ip_address, mac_address, count } = req.body;

        // Save to Supabase database
        const { data, error } = await supabase
            .from('encrypted_data')
            .insert([
                {
                    original,
                    encrypted,
                    added_time,
                    ip_address,
                    mac_address,
                    count
                }
            ]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Data saved successfully!' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
