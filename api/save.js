import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { original, encrypted, added_time, mac_address, last_run_time,count } = req.body;

        if (!original || !encrypted || !added_time || !count) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('data')
            .insert([
                {
                    original_text: original,
                    md5_hash: encrypted,
                    created_at: added_time,
                    mac_address: mac_address,
                    last_run_time:last_run_time,
                    usage_count: count
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
