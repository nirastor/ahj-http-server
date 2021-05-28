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
      id: 2,
      status: false,
      name: 'Вторая таска',
      description: 'И её большое описание\n1.сначал это\n2.потом другое',
      created: new Date('2021-05-17, 11:17'),
    },
  ];

const router = new Router();

// task http
router.get('/apiVersion', async (ctx, next) => {
    ctx.response.body = '14 — clear comments';
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
router.post('/updateTicket', async(ctx, next) => {
    const ticketId = Number(ctx.request.query.id);
    const newStatus = ctx.request.query.status === 'true' ? true : false;
    const index = tickets.findIndex(o => o.id === ticketId);
    if (index !== -1) {
        tickets[index].status = newStatus
    }
    ctx.response.status = 204;
});
router.post('/newPost', async(ctx, next) => {
    const { name, description } = ctx.request.query
    tickets.push({
        id: tickets.map(i => i.id).sort((a,b) => b - a)[0] + 1,
        status: false,
        created: new Date(),
        name,
        description,
    })
    ctx.response.status = 204;
});
router.post('/editTicket', async(ctx, next) => {
    const { name, description } = ctx.request.query
    const id = Number(ctx.request.query.id)
    const ticketForEdit = tickets.find(t => t.id === id)
    ticketForEdit.name = name
    ticketForEdit.description = description
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));