import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { md5_hash, last_run_time } = req.body;

        if (!md5_hash || !last_run_time) {
            return res.status(400).json({ error: '缺少必要的参数：md5_hash 或 Last_run_time' });
        }

        // 查询 md5_hash 对应的记录
        const { data, error } = await supabase
            .from('data')
            .select('id, usage_count')
            .eq('md5_hash', md5_hash)
            .single();  // 假设 md5_hash 是唯一的

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // 如果未找到记录，返回错误
        if (!data) {
            return res.status(404).json({ error: '未找到对应的 md5_hash 数据' });
        }

        // 减少 usage_count
        const newUsageCount = data.usage_count > 0 ? data.usage_count - 1 : 0;

        // 更新 Last_run_time 和 usage_count
        const { error: updateError } = await supabase
            .from('data')
            .update({ usage_count: newUsageCount, Last_run_time: last_run_time })
            .eq('md5_hash', md5_hash);

        if (updateError) {
            return res.status(400).json({ error: updateError.message });
        }

        res.status(200).json({ message: '操作成功', new_usage_count: newUsageCount });
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
}
