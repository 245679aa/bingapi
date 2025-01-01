import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { original } = req.body;

        if (!original) {
            return res.status(400).json({ code: 400, message: '原始文本不能为空' });
        }

        const { data, error } = await supabase
            .from('data')
            .delete()
            .eq('original_text', original);

        if (error) {
            return res.status(400).json({ code: 400, message: error.message });
        }

        // 如果删除操作成功
        return res.status(200).json({ code: 200, message: '数据删除成功!' });
    } else {
        // 如果请求方法不允许
        return res.status(405).json({ code: 405, message: '方法不允许' });
    }
}
