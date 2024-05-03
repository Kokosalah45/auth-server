import express , {Request , Response  , NextFunction} from 'express';
import cors from 'cors'
import helmet from 'helmet';
import path from 'path';

import V1Router from './routes/api/v1';
import { CustomServerError } from './errors';

const app = express();

const rootPath = path.dirname(__dirname);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(rootPath, 'public')));
app.use(cors());
app.use(helmet({
    xPoweredBy: false,
}));


app.post('/api/v1', V1Router);

app.use((err: CustomServerError, req: Request, res: Response) => {
    res.statusCode = err.statusCode;
    res.json({
        error: {
            code: err.error_code,
            message: err.message,
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

