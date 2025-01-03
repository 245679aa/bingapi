import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,  // 使用环境变量
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   // 使用环境变量
);
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { originalText } = req.body;  // 获取前端传来的原始文本

        // 检查原始文本是否为空
        if (!originalText) {
            return res.status(400).json({ code: 400, message: '卡密不能为空' });
        }

        try {
            // 使用 Supabase 查询数据库中的数据
            const { data, error } = await supabase
                .from('data')  // 你要查询的表名
                .select('*')   // 查询所有列
                .eq('md5_hash', originalText); // 查找匹配的原始文本

            // 错误处理
            if (error) {
                return res.status(500).json({ code: 500, message: error.message });
            }

            // 如果没有找到匹配的数据
            if (data.length === 0) {
                return res.status(404).json({ code: 404, message: '没有找到匹配的卡密' });
            }

            // 返回查询结果
            return res.status(200).json({ code: 200, message: '查询成功', data });
        } catch (error) {
            return res.status(500).json({ code: 500, message: '服务器错误' });
        }
    } else {
        // 处理其他请求方法
        return res.status(405).json({ code: 405, message: '不支持的请求方法' });
    }
}
