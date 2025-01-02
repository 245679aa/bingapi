import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { md5_hash, ip_address, mac_address } = req.body;

        // 检查传入参数是否完整
        if (!md5_hash || !ip_address || !mac_address) {
            return res.status(400).json({
                code: 400,
                message: '参数不完整，请提供 md5_hash, ip_address 和 mac_address'
            });
        }

        try {
            // 查询 md5_hash 的记录
            const { data, error: queryError } = await supabase
                .from('data')
                .select('md5_hash')
                .eq('md5_hash', md5_hash);

            if (queryError || data.length === 0) {
                return res.status(404).json({
                    code: 404,
                    message: '未找到匹配的记录'
                });
            }

            // 更新 ip_address 和 mac_address
            const { error: updateError } = await supabase
                .from('data')
                .update({ ip_address, mac_address })
                .eq('md5_hash', md5_hash);

            if (updateError) {
                return res.status(500).json({
                    code: 500,
                    message: '更新失败，请稍后重试'
                });
            }

            return res.status(200).json({
                code: 200,
                message: '更新成功'
            });
        } catch (err) {
            // 捕获其他错误
            return res.status(500).json({
                code: 500,
                message: '服务器内部错误',
                error: err.message
            });
        }
    } else {
        return res.status(405).json({
            code: 405,
            message: '方法不允许'
        });
    }
}
