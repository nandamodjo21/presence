import {Hono} from 'hono'

const route = new Hono();

route.get('/', (c) => {
    return c.json({data:'kontol'});
})

export default route;
