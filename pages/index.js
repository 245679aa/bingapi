import { useState } from 'react';
import md5 from 'crypto-js/md5';

export default function Home() {
  const [inputData, setInputData] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取用户IP地址（需要通过外部服务获取MAC地址）
  const getIpAddress = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // MD5加密
    const encryptedData = md5(inputData).toString();
    
    // 获取IP地址
    const ipAddress = await getIpAddress();
    const macAddress = '00:14:22:01:23:45'; // 假设获取到MAC地址

    // 向Supabase提交数据
    const data = {
      original_data: inputData,
      encrypted_data: encryptedData,
      ip_address: ipAddress,
      mac_address: macAddress,
      count: 9999
    };

    // 直接将数据提交到Supabase
    const response = await fetch('https://YOUR_SUPABASE_URL/rest/v1/encrypted_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'YOUR_SUPABASE_API_KEY',
        'Authorization': 'Bearer YOUR_SUPABASE_API_KEY',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setResponseMessage('数据保存成功');
    } else {
      setResponseMessage('保存数据失败');
    }
    
    setLoading(false);
  };

  return (
    <div>
      <h1>MD5加密并保存数据</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="输入要加密的内容"
        />
        <button type="submit" disabled={loading}>提交</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
