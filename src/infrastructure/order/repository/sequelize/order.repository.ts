import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository-interface";
import OrderItem from "../../../../domain/checkout/entity/orderItem";
import { Transaction } from 'sequelize';

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
              id: entity.id,
              customer_id: entity.customerId,
              total: entity.total(),
              items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
              })),
            },
            {
              include: [{ model: OrderItemModel }]
            }
          )  
    }

    async update(entity: Order): Promise<void> {      
      // transação
      const transaction = await OrderModel.sequelize.transaction();
      try {
        //itens do pedido
        const currentItems = await OrderItemModel.findAll({
            where: { order_id: entity.id },
            transaction
        });

        const itemsAtuais = new Set(currentItems.map(item => item.id));
        const itemsAlteradosIds = new Set(entity.items.map(item => item.id));

        // Atualizar ou criar novos itens
        for (const item of entity.items) {
            if (item.id && itemsAtuais.has(item.id)) {
                await OrderItemModel.update(
                    {
                        name: item.name,
                        price: item.price,
                        product_id: item.productId,
                        quantity: item.quantity,
                    },
                    { where: { id: item.id }, transaction }
                );
            } else if (!item.id || !itemsAtuais.has(item.id)) {
                await OrderItemModel.create({
                    order_id: entity.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                }, { transaction });
            }
        }

        // Remover itens que não estão mais no pedido
        for (const currentItem of currentItems) {
            if (!itemsAlteradosIds.has(currentItem.id)) {
                await OrderItemModel.destroy({ where: { id: currentItem.id }, transaction });
            }
        }

        //Total da ordem
        await OrderModel.update(
          {
              customer_id: entity.customerId,
              total: entity.total()
          },
          { where: { id: entity.id }, transaction }
      );

      await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new Error("Error updating Order");
    }
  }

  async find(id: string): Promise<Order> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: [{
          model: OrderItemModel,
          as: 'items'
        }]
      });
  
      if (!orderModel) {
        return null;
      }
  
      const items: OrderItem[] = orderModel.items.map((itemModel) =>
        new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity)
      );
  
      return new Order(orderModel.id, orderModel.customer_id, items);
    } catch (error) {
            throw new Error("Order not found");
        }     
  }

  async findAll(): Promise<Order[]> {
    const ordersWithItems = await OrderModel.findAll({
      include: [{
        model: OrderItemModel,
        as: 'items'
      }]
    });

    const orders: Order[] = ordersWithItems.map((orderModel) => {
      const items: OrderItem[] = orderModel.items.map((itemModel) =>
        new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity)
      );
  
      return new Order(orderModel.id, orderModel.customer_id, items);
    });

    return orders;
  }
}