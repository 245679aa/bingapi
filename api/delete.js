import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { original } = req.body;

        if (!original) {
            return res.status(400).json({ error: '原始文本不能为空' });
        }

        const { data, error } = await supabase
            .from('data')
            .delete()
            .eq('original_text', original);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: '数据删除成功!' });
    } else {
        res.status(405).json({ error: '方法不允许' });
    }
}
