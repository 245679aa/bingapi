import { useState } from "react";
import md5 from "crypto-js/md5";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!content) {
      setMessage("请输入内容！");
      return;
    }

    // MD5 加密
    const encryptedContent = md5(content).toString();

    // 获取时间戳和 IP 地址
    const timestamp = new Date().toISOString();
    const ipAddress = await fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip);

    // 默认 MAC 地址（前端无法直接获取）
    const macAddress = "00:00:00:00:00:00";

    // 保存到 Supabase
    const { data, error } = await supabase.from("your_table_name").insert([
      {
        original_data: content,
        encrypted_data: encryptedContent,
        timestamp,
        ip_address: ipAddress,
        mac_address: macAddress,
        count: 9999,
      },
    ]);

    if (error) {
      setMessage("保存失败：" + error.message);
    } else {
      setMessage("数据已成功保存！");
    }

    setContent("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>MD5 加密工具</h1>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入内容"
        style={{ width: "300px", padding: "10px" }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: "10px", padding: "10px" }}>
        提交
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
