/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidcategoriesError = createError('InvalidcategoriesError', 'categoria Inválido.', 400);
    const categories = app.mongo.db.collection('categories');
    const products = app.mongo.db.collection('products');

    app.get('/categories',
        {
            config: {
                logMe: true
            }
        },
        async (request, reply) => {
            //request.log.info(categories);
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
                    img_Url: {type: 'string'}
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

app.get('/categories/:id/products', async (request, reply) => {
    try {
        const id = request.params.id;

        // Consulta para encontrar a categoria pelo _id
        const category = await categories.findOne({ name: id });

        if (!category) {
            // Categoria não encontrada, retorna um código de status 404
            throw new Error('Categoria não encontrada');
        }

        // Consulta para encontrar os produtos com base no nome da categoria
        const productsCategory = await products.find({ category: category.name }).toArray();

        if (productsCategory.length === 0) {
            // Nenhum produto encontrado para esta categoria, retorna um código de status 204
            return reply.status(204).send();
        }

        // Retorna os produtos encontrados
        return productsCategory;
        
    } catch (error) {
        console.error(error);
        // Retorna um código de status 400 (Bad Request) em caso de erro
        reply.status(400).send({ error: error.message });
    }
});
}