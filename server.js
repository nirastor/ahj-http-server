const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const tickets = [
    {
      id: 1,
      status: false,
      name: 'Задача 1',
      description: 'Описание задачи один',
      created: new Date('2021-05-21, 12:45'),
    },
    {
      id: 3,
      status: false,
      name: 'Вторая таска',
      description: 'И её большое описание\n1.сначал это\n2.потом другое',
      created: new Date('2021-05-17, 11:17'),
    },
  ];

const router = new Router();

// task http
router.get('/apiersion', async (ctx, next) => {
    ctx.response.body = '6 — delete version back';
});
router.get('/allTickets', async (ctx, next) => {
    ctx.response.body = tickets.map(t => ({
        id: t.id,
        status: t.status,
        name: t.name,
        created: t.created,
    }));
});
router.get('/ticketById', async (ctx, next) => {
    const ticketId = Number(ctx.request.query.id);
    ctx.response.body = tickets.find(t => t.id === ticketId);
});
router.delete('/deleteTicketById', async(ctx, next) => {
    const ticketId = Number(ctx.request.query.id);
    const index = tickets.findIndex(o => o.id === ticketId);
    if (index !== -1) {
        tickets.splice(index, 1);
    }
    ctx.response.status = 204;
});

// task different state of loading (demo on hooks)
// router.get('/data', async (ctx, next) => {
//     ctx.response.body = {status: "ok"};
// });
// router.get('/error', async (ctx, next) => {
//     ctx.response.status = 500;
//     ctx.response.body = {status: "Internal Error"};
// });
// router.get('/loading', async (ctx, next) => {
//     await new Promise(resolve => {
//         setTimeout(() => {
//             resolve();
//         }, 5000);
//     });
//     ctx.response.body = {status: "ok"};
// });

// task work with http (notes manager)

// router.get('/notes/nextid', async (ctx, next) => {
//     ctx.response.body = nextId;
// });
// router.post('/notes', async(ctx, next) => {
//     notes.push({...ctx.request.body, id: nextId++});
//     ctx.response.status = 204;
// });
// router.delete('/notes/:id', async(ctx, next) => {
//     const noteId = Number(ctx.params.id);
//     const index = notes.findIndex(o => o.id === noteId);
//     if (index !== -1) {
//         notes.splice(index, 1);
//     }
//     ctx.response.status = 204;
// });

// task router (like facebook)
// router.get('/posts', async (ctx, next) => {
//     ctx.response.body = posts;
// });
// router.get('/posts/nextid', async (ctx, next) => {
//     ctx.response.body = nextId;
// });
// router.post('/posts', async(ctx, next) => {
//     const {id, content} = ctx.request.body;
//     if (id !== 0) {
//         posts = posts.map(o => o.id !== id ? o : {...o, content: content});
//         ctx.response.status = 204;
//         return;
//     }
//     posts.push({...ctx.request.body, id: nextId++, created: Date.now()});
//     ctx.response.status = 204;
// });
// router.delete('/posts/:id', async(ctx, next) => {
//     const postId = Number(ctx.params.id);
//     const index = posts.findIndex(o => o.id === postId);
//     if (index !== -1) {
//         posts.splice(index, 1);
//     }
//     ctx.response.status = 204;
// });

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));