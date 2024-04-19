/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidcategoriesError = createError('InvalidcategoriesError', 'categoria Inválido.', 400);
    const categories = app.mongo.db.collection('categories');
    const products = app.mongo.db.collection('products');

    app.get('/categories',
        async (request, reply) => {
            request.log.info(categories);
            return await products.find().toArray();
        }
    );

    app.get('/categories/:id', async (request, reply) => {
        let id =  request.params.id;
        let category = await categories.findOne({_id: new app.mongo.ObjectId(id)});
        
        return category;
    });

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    img_URL: {type: 'string'}
                },
                required: ['name','img_Url']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let product = request.body;
        
        await categories.insertOne(product);

        return reply.code(201).send();
    });

    app.put('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let product = request.body;
        
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                name: product.name,
                qtd: product.qtd
            }
        });
        
        return reply.code(204).send();;
    });

    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await categories.deleteOne({_id: new app.mongo.ObjectId(id)});
        
        return reply.code(204).send();;
    });

    app.get('/categories/:id/products', async (request, reply) =>{
        let id = request.params.id;
        let category = await categories.findOne({_id: new app.mongo.ObjectId(id)})
        let categoryName = category.name;
        let productCategory = await products.find({category: categoryName}).toArray();

        return productCategory;
    })
}