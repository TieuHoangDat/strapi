const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Sử dụng body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json());

// Biến lưu trữ dữ liệu webhook để hiển thị
let webhookDataList = [];

// Danh sách client kết nối qua SSE
let clients = [];

// Middleware kiểm tra API_KEY từ header
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['api_key']; // Lấy API_KEY từ header

  const validApiKey = 'YOUR_SECRET_API_KEY'; // Thay bằng API_KEY hợp lệ của bạn

  if (apiKey && apiKey === validApiKey) {
    // Nếu API_KEY hợp lệ, cho phép tiếp tục
    next();
  } else {
    // Nếu không hợp lệ, trả về lỗi 401 Unauthorized
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
};

// Route nhận Webhook với middleware kiểm tra API_KEY
app.post('/webhook', checkApiKey, (req, res) => {
  const webhookData = req.body;

  // Lưu dữ liệu webhook vào mảng
  webhookDataList.push(webhookData);

  // Log dữ liệu nhận được
  console.log('Webhook received:', webhookData);

  // Gửi dữ liệu webhook mới tới tất cả các client đang kết nối SSE
  clients.forEach(client => client.write(`data: ${JSON.stringify(webhookData)}\n\n`));

  // Trả về phản hồi cho Strapi
  res.status(200).send('Webhook received');
});

// Route để lắng nghe SSE từ client
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: Connected\n\n');
  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Route để hiển thị dữ liệu webhook trên trình duyệt
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Webhook Data</h1>
        <ul id="webhook-list"></ul>
        <script>
          const eventSource = new EventSource('/events');
          
          eventSource.onmessage = function(event) {
            const newData = JSON.parse(event.data);
            const listItem = document.createElement('li');
            listItem.textContent = JSON.stringify(newData, null, 2);
            document.getElementById('webhook-list').appendChild(listItem);
          };
        </script>
      </body>
    </html>
  `);
});

// Khởi động server
app.listen(port, () => {
  console.log(`Webhook server is listening on port ${port}`);
});
