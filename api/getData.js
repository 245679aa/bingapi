import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // 查询数据表中的所有记录
        const { data, error } = await supabase
            .from('data')  // 你的表名
            .select('*');  // 选择所有字段

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // 返回查询到的数据
        res.status(200).json(data);
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
