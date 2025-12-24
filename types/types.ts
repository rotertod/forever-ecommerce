export type OrderType = {
    id: string;
    product: {
        images: { url: string }[];
    };
    status: { name: string };
    deliveryInfo: {
        firstName: string;
        lastName: string;
        email: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
    }[];
    payment: {
        name: string;
    };
    quantity: number;
    createdAt: Date;
};
