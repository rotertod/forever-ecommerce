'use server';

import prisma from '../prisma';

export const getPayments = async () => {
    try {
        const payments = await prisma.payment.findMany({});
        return payments;
    } catch (error) {
        console.error(error);
    }
};
