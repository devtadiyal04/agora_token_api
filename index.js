const app = express();
app.use(cors(), express.json());

const APP_ID = '957dacbfcd6b469ea2961bf8aa045542';
const APP_CERT = '2fa87c78d3e24a9eba53e342732eda0e';
const EXPIRE = 3600;

app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const token = RtmTokenBuilder.buildToken(
      APP_ID, APP_CERT, userId, RtmRole.Rtm_User, (Date.now()/1000|0) + EXPIRE
    );
    return res.json({ userId, token, expiresIn: EXPIRE });
  } catch (err) {
    console.error('Token error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
