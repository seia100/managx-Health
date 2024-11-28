// server.ts
import app from './app';
// import { ENV } from './config/env';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
