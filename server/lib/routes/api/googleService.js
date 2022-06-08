import express from 'express';
import auth from '#middleware/auth.js';
const router = express.Router();

/*
@example

```js
router.get('/googleService/getAndUpdateInventoryReceived', auth, (req, res) => {
    res.json("success")
})
```

*/


export default router;