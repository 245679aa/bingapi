import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://fcpclqkyakutcmgmmwzh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcGNscWt5YWt1dGNtZ21td3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDAwMjMsImV4cCI6MjA1MTIxNjAyM30.lme6Kc2LRO3Jiu4v9QQq7sOOZSWF9l09I0FbSMWqS1c');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { original, encrypted, added_time, ip_address, mac_address, count } = req.body;

        // 检查必填字段
        if (!original || !encrypted || !added_time || !count) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 插入数据到 Supabase 数据库表
        const { data, error } = await supabase
            .from('data')  // 数据库表名
            .insert([
                {
                    original_text: original,  // 存储原始文本
                    md5_hash: encrypted,      // 存储加密后的文本
                    created_at: added_time,   // 存储时间戳
                    ip_address: ip_address,   // 存储 IP 地址
                    mac_address: mac_address, // 存储 MAC 地址
                    usage_count: count        // 存储使用次数
                }
            ]);

        if (error) {
            console.error(error);  // 在控制台打印错误信息
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Data saved successfully!' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
