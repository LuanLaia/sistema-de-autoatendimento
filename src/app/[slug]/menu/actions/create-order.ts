"use server";

import { consumptionMethod } from "@prisma/client";

import { db } from "@/lib/prisma";

import { removeCpfPonctuation } from "../helpers/cpf";

interface createOrderInput {
  custumerName: string;
  custumerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: consumptionMethod;
  slug: string;
}



export const createOrder = async (input: createOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
        slug: input.slug,
    }
  })
  if (!restaurant) {
    throw new Error("Restaurant not found")
  }
  const productWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });

  const productWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productWithPrices.find((p) => p.id == product.id)!.price,
  }));
  
  await db.order.create({
    data: {
      status: "PENDING",
      custumerName: input.custumerName,
      custumerCpf: removeCpfPonctuation(input.custumerCpf),
      orderProducts: {
        createMany: {
          data: productWithPricesAndQuantities,
        },
      },
      total: productWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurant: {
        connect: { id: restaurant.id }
      }
    },
  });
};
